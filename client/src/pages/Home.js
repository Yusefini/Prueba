import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { Plus, TrendingUp, Users, Server, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import ServerCard from '../components/ServerCard';
import { fetchPosts, fetchServers } from '../services/api';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: ${props => props.theme.spacing.md};
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    order: -1;
  }
`;

const WelcomeSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: ${props => props.theme.spacing.sm};
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surfaceLight};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.sm};
  color: white;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Section = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const SectionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.accent};
  }
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const ServersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xl};
`;

const Home = () => {
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Fetch posts
  const { data: postsData, isLoading: postsLoading, refetch: refetchPosts } = useQuery(
    'posts',
    () => fetchPosts({ page: 1, limit: 10 }),
    {
      enabled: !!user
    }
  );

  // Fetch servers
  const { data: serversData, isLoading: serversLoading } = useQuery(
    'servers',
    () => fetchServers({ page: 1, limit: 5 }),
    {
      enabled: !!user
    }
  );

  const handlePostCreated = () => {
    setShowCreatePost(false);
    refetchPosts();
  };

  if (!user) {
    return (
      <HomeContainer>
        <MainContent>
          <WelcomeSection>
            <WelcomeTitle>Welcome to Minecraft Social</WelcomeTitle>
            <WelcomeSubtitle>
              Connect with fellow Minecraft players, share your builds, discover amazing servers, 
              and make new friends in the ultimate Minecraft community!
            </WelcomeSubtitle>
            <StatsGrid>
              <StatCard>
                <StatIcon color="#00D4AA">
                  <Users size={20} />
                </StatIcon>
                <StatValue>1,000+</StatValue>
                <StatLabel>Players</StatLabel>
              </StatCard>
              <StatCard>
                <StatIcon color="#4ECDC4">
                  <Server size={20} />
                </StatIcon>
                <StatValue>50+</StatValue>
                <StatLabel>Servers</StatLabel>
              </StatCard>
              <StatCard>
                <StatIcon color="#FF6B6B">
                  <MessageCircle size={20} />
                </StatIcon>
                <StatValue>5,000+</StatValue>
                <StatLabel>Messages</StatLabel>
              </StatCard>
              <StatCard>
                <StatIcon color="#FFB347">
                  <TrendingUp size={20} />
                </StatIcon>
                <StatValue>100+</StatValue>
                <StatLabel>Posts Daily</StatLabel>
              </StatCard>
            </StatsGrid>
          </WelcomeSection>
        </MainContent>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <MainContent>
        {showCreatePost ? (
          <CreatePost onCancel={() => setShowCreatePost(false)} onSuccess={handlePostCreated} />
        ) : (
          <Section>
            <SectionHeader>
              <SectionTitle>What's happening?</SectionTitle>
              <SectionButton onClick={() => setShowCreatePost(true)}>
                <Plus size={16} />
                Create Post
              </SectionButton>
            </SectionHeader>
            <PostsList>
              {postsLoading ? (
                <LoadingSpinner>Loading posts...</LoadingSpinner>
              ) : postsData?.posts?.length > 0 ? (
                postsData.posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <EmptyState>
                  <p>No posts yet. Be the first to share something!</p>
                </EmptyState>
              )}
            </PostsList>
          </Section>
        )}
      </MainContent>

      <Sidebar>
        <Section>
          <SectionHeader>
            <SectionTitle>Popular Servers</SectionTitle>
          </SectionHeader>
          <ServersList>
            {serversLoading ? (
              <LoadingSpinner>Loading servers...</LoadingSpinner>
            ) : serversData?.servers?.length > 0 ? (
              serversData.servers.map(server => (
                <ServerCard key={server.id} server={server} />
              ))
            ) : (
              <EmptyState>
                <p>No servers found</p>
              </EmptyState>
            )}
          </ServersList>
        </Section>
      </Sidebar>
    </HomeContainer>
  );
};

export default Home;