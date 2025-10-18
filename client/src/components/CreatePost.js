import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Image, Server, Send } from 'lucide-react';
import { useQuery } from 'react-query';
import { postsAPI, serversAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const CreatePostContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PostTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceLight};
  }
`;

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SelectContainer = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ImagePreview = styled.div`
  position: relative;
  margin-top: ${props => props.theme.spacing.md};
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.md};
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: 50%;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.border};
  }
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.border};
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.accent};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CreatePost = ({ onCancel, onSuccess }) => {
  const [content, setContent] = useState('');
  const [serverId, setServerId] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user's servers
  const { data: serversData } = useQuery(
    'user-servers',
    () => serversAPI.getServers().then(res => res.data),
    {
      select: (data) => data.servers || []
    }
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (serverId) formData.append('serverId', serverId);
      if (image) formData.append('image', image);

      await postsAPI.createPost(formData);
      
      toast.success('Post created successfully!');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CreatePostContainer>
      <PostHeader>
        <PostTitle>Create a new post</PostTitle>
        <CloseButton onClick={onCancel}>
          <X size={20} />
        </CloseButton>
      </PostHeader>

      <PostForm onSubmit={handleSubmit}>
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share your latest Minecraft adventure, build, or server experience..."
          maxLength={2000}
        />

        {serversData && serversData.length > 0 && (
          <SelectContainer>
            <Select
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
            >
              <option value="">Post to general feed</option>
              {serversData.map(server => (
                <option key={server.id} value={server.id}>
                  {server.name}
                </option>
              ))}
            </Select>
          </SelectContainer>
        )}

        {imagePreview && (
          <ImagePreview>
            <PreviewImage src={imagePreview} alt="Preview" />
            <RemoveImageButton onClick={removeImage}>
              <X size={16} />
            </RemoveImageButton>
          </ImagePreview>
        )}

        <PostActions>
          <ActionButtons>
            <FileInputLabel>
              <Image size={16} />
              Add Image
              <FileInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FileInputLabel>
            {serversData && serversData.length > 0 && (
              <ActionButton type="button">
                <Server size={16} />
                Server
              </ActionButton>
            )}
          </ActionButtons>

          <SubmitButton
            type="submit"
            disabled={isSubmitting || !content.trim()}
          >
            <Send size={16} />
            {isSubmitting ? 'Posting...' : 'Post'}
          </SubmitButton>
        </PostActions>
      </PostForm>
    </CreatePostContainer>
  );
};

export default CreatePost;