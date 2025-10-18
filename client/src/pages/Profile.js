import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { 
  User, 
  Calendar, 
  Users, 
  Server, 
  MessageCircle, 
  Edit,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUser, fetchUserPosts } from '../services/api';
import PostCard from '../components/PostCard';
import { formatDistanceToNow } from 'date-fns';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const BackButton = styled.button`
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
  margin-bottom: ${props => props.theme.spacing.lg};

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceLight};
  }
`;

const ProfileHeader = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 3rem;
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const Username = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const MinecraftUsername = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 1.125rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Bio = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ProfileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surfaceLight};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.primary ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: ${props => props.primary ? props.theme.colors.accent : props.theme.colors.border};
  }
`;

const PostsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textSecondary};
`;

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [postsPage, setPostsPage] = useState(1);

  const isOwnProfile = currentUser?.id === id;

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery(
    ['user', id],
    () => fetchUser(id),
    {
      enabled: !!id
    }
  );

  // Fetch user posts
  const { data: postsData, isLoading: postsLoading } = useQuery(
    ['user-posts', id, postsPage],
    () => fetchUserPosts(id, postsPage, 10),
    {
      enabled: !!id
    }
  );

  if (profileLoading) {
    return (
      <ProfileContainer>
        <LoadingSpinner>Loading profile...</LoadingSpinner>
      </ProfileContainer>
    );
  }

  if (!profile) {
    return (
      <ProfileContainer>
        <EmptyState>
          <h2>User not found</h2>
          <p>The user you're looking for doesn't exist.</p>
        </EmptyState>
      </ProfileContainer>
    );
  }

  const handleSendMessage = () => {
    navigate('/messages');
  };

  const handleAddFriend = () => {
    // TODO: Implement add friend functionality
    console.log('Add friend');
  };

  return (
    <ProfileContainer>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </BackButton>

      <ProfileHeader>
        <ProfileInfo>
          <Avatar>
            {profile.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <UserDetails>
            <Username>{profile.username}</Username>
            {profile.minecraftUsername && (
              <MinecraftUsername>@{profile.minecraftUsername}</MinecraftUsername>
            )}
            {profile.bio && <Bio>{profile.bio}</Bio>}
            <ProfileMeta>
              <MetaItem>
                <Calendar size={16} />
                Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
              </MetaItem>
              <MetaItem>
                <User size={16} />
                {profile.isOnline ? 'Online' : 'Offline'}
              </MetaItem>
            </ProfileMeta>
          </UserDetails>
        </ProfileInfo>

        <StatsGrid>
          <StatCard>
            <StatValue>{profile._count?.posts || 0}</StatValue>
            <StatLabel>Posts</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{profile._count?.friends || 0}</StatValue>
            <StatLabel>Friends</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{profile._count?.servers || 0}</StatValue>
            <StatLabel>Servers</StatLabel>
          </StatCard>
        </StatsGrid>

        {!isOwnProfile && (
          <ActionButtons>
            <ActionButton onClick={handleSendMessage}>
              <MessageCircle size={16} />
              Send Message
            </ActionButton>
            <ActionButton onClick={handleAddFriend}>
              <Users size={16} />
              Add Friend
            </ActionButton>
          </ActionButtons>
        )}

        {isOwnProfile && (
          <ActionButtons>
            <ActionButton onClick={() => navigate('/settings')}>
              <Settings size={16} />
              Edit Profile
            </ActionButton>
          </ActionButtons>
        )}
      </ProfileHeader>

      <PostsSection>
        <SectionTitle>Posts</SectionTitle>
        <PostsList>
          {postsLoading ? (
            <LoadingSpinner>Loading posts...</LoadingSpinner>
          ) : postsData?.posts?.length > 0 ? (
            postsData.posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <EmptyState>
              <p>No posts yet.</p>
            </EmptyState>
          )}
        </PostsList>
      </PostsSection>
    </ProfileContainer>
  );
};

export default Profile;