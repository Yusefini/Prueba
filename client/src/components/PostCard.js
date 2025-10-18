import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreVertical, 
  Trash2,
  Edit,
  User,
  Server
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const PostContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled(Link)`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  margin-right: ${props => props.theme.spacing.sm};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MinecraftUsername = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-top: ${props => props.theme.spacing.xs};
`;

const ServerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  margin-top: ${props => props.theme.spacing.xs};
`;

const PostActions = styled.div`
  position: relative;
`;

const ActionButton = styled.button`
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

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 150px;
  z-index: 1000;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  width: 100%;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceLight};
  }

  &.danger {
    color: ${props => props.theme.colors.error};
  }
`;

const PostContent = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButtonWithCount = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.surfaceLight};
  }

  &.liked {
    color: ${props => props.theme.colors.error};
  }
`;

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLike = async () => {
    try {
      await postsAPI.likePost(post.id);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(post.id);
        onDelete?.(post.id);
        toast.success('Post deleted successfully');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
    setShowDropdown(false);
  };

  const isOwner = user?.id === post.authorId;
  const canEdit = isOwner;

  return (
    <PostContainer>
      <PostHeader>
        <Avatar>
          {post.author?.username?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <UserInfo>
          <Username to={`/profile/${post.author.id}`}>
            {post.author?.username}
          </Username>
          {post.author?.minecraftUsername && (
            <MinecraftUsername>
              @{post.author.minecraftUsername}
            </MinecraftUsername>
          )}
          <PostMeta>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </PostMeta>
          {post.server && (
            <ServerInfo>
              <Server size={14} />
              {post.server.name}
            </ServerInfo>
          )}
        </UserInfo>
        {canEdit && (
          <PostActions>
            <ActionButton onClick={() => setShowDropdown(!showDropdown)}>
              <MoreVertical size={16} />
            </ActionButton>
            {showDropdown && (
              <Dropdown>
                <DropdownItem className="danger" onClick={handleDelete}>
                  <Trash2 size={16} />
                  Delete
                </DropdownItem>
              </Dropdown>
            )}
          </PostActions>
        )}
      </PostHeader>

      <PostContent>
        {post.content}
        {post.imageUrl && (
          <PostImage src={post.imageUrl} alt="Post content" />
        )}
      </PostContent>

      <PostFooter>
        <ActionGroup>
          <ActionButtonWithCount
            className={isLiked ? 'liked' : ''}
            onClick={handleLike}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            {likeCount}
          </ActionButtonWithCount>
          <ActionButtonWithCount>
            <MessageCircle size={16} />
            {post._count?.comments || 0}
          </ActionButtonWithCount>
          <ActionButtonWithCount>
            <Share size={16} />
            Share
          </ActionButtonWithCount>
        </ActionGroup>
      </PostFooter>
    </PostContainer>
  );
};

export default PostCard;