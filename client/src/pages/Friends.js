import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { 
  Search, 
  UserPlus, 
  Users, 
  UserCheck, 
  UserX,
  MessageCircle,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { friendsAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const FriendsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.lg};
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm} 40px;
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
  width: 300px;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const AddFriendButton = styled.button`
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
`;

const Tabs = styled.div`
  display: flex;
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Tab = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  border: none;
  color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    color: ${props => props.active ? 'white' : props.theme.colors.text};
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  }
`;

const FriendsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FriendCard = styled.div`
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

const FriendHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const FriendInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const Username = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MinecraftUsername = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isOnline ? props.theme.colors.success : props.theme.colors.error};
`;

const FriendActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.primary ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: ${props => props.primary ? props.theme.colors.accent : props.theme.colors.border};
  }

  &.danger {
    color: ${props => props.theme.colors.error};
    border-color: ${props => props.theme.colors.error};

    &:hover {
      background: ${props => props.theme.colors.error}20;
    }
  }
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

const RequestCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const RequestHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const RequestInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const RequestAvatar = styled.div`
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

const RequestDetails = styled.div`
  flex: 1;
`;

const RequestUsername = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const RequestMinecraftUsername = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
`;

const RequestActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const AcceptButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.success};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.success}dd;
  }
`;

const RejectButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.error};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.error}dd;
  }
`;

const Friends = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch friends
  const { data: friends, isLoading: friendsLoading, refetch: refetchFriends } = useQuery(
    'friends',
    () => friendsAPI.getFriends().then(res => res.data),
    {
      enabled: !!user
    }
  );

  // Fetch friend requests
  const { data: friendRequests, isLoading: requestsLoading, refetch: refetchRequests } = useQuery(
    'friend-requests',
    () => friendsAPI.getFriendRequests().then(res => res.data),
    {
      enabled: !!user
    }
  );

  const handleAcceptRequest = async (userId) => {
    try {
      await friendsAPI.acceptFriendRequest(userId);
      toast.success('Friend request accepted');
      refetchRequests();
      refetchFriends();
    } catch (error) {
      toast.error('Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await friendsAPI.rejectFriendRequest(userId);
      toast.success('Friend request rejected');
      refetchRequests();
    } catch (error) {
      toast.error('Failed to reject friend request');
    }
  };

  const handleRemoveFriend = async (userId) => {
    if (window.confirm('Are you sure you want to remove this friend?')) {
      try {
        await friendsAPI.removeFriend(userId);
        toast.success('Friend removed');
        refetchFriends();
      } catch (error) {
        toast.error('Failed to remove friend');
      }
    }
  };

  const handleSendMessage = (userId) => {
    // TODO: Navigate to messages with this user
    console.log('Send message to', userId);
  };

  if (!user) {
    return (
      <FriendsContainer>
        <EmptyState>
          <h3>Please log in to view friends</h3>
        </EmptyState>
      </FriendsContainer>
    );
  }

  return (
    <FriendsContainer>
      <Header>
        <Title>Friends</Title>
        <HeaderActions>
          <SearchContainer>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          <AddFriendButton>
            <UserPlus size={16} />
            Add Friend
          </AddFriendButton>
        </HeaderActions>
      </Header>

      <Tabs>
        <Tab 
          active={activeTab === 'friends'} 
          onClick={() => setActiveTab('friends')}
        >
          <Users size={16} />
          Friends ({friends?.length || 0})
        </Tab>
        <Tab 
          active={activeTab === 'requests'} 
          onClick={() => setActiveTab('requests')}
        >
          <UserCheck size={16} />
          Requests ({friendRequests?.length || 0})
        </Tab>
      </Tabs>

      {activeTab === 'friends' && (
        <>
          {friendsLoading ? (
            <LoadingSpinner>Loading friends...</LoadingSpinner>
          ) : friends?.length > 0 ? (
            <FriendsGrid>
              {friends
                .filter(friend => 
                  friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  friend.minecraftUsername?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(friend => (
                  <FriendCard key={friend.id}>
                    <FriendHeader>
                      <Avatar>
                        {friend.username?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <FriendInfo>
                        <Username>{friend.username}</Username>
                        {friend.minecraftUsername && (
                          <MinecraftUsername>@{friend.minecraftUsername}</MinecraftUsername>
                        )}
                        <Status>
                          <StatusIndicator isOnline={friend.isOnline} />
                          {friend.isOnline ? 'Online' : 'Offline'}
                        </Status>
                      </FriendInfo>
                    </FriendHeader>
                    <FriendActions>
                      <ActionButton onClick={() => handleSendMessage(friend.id)}>
                        <MessageCircle size={16} />
                        Message
                      </ActionButton>
                      <ActionButton 
                        className="danger" 
                        onClick={() => handleRemoveFriend(friend.id)}
                      >
                        <UserX size={16} />
                        Remove
                      </ActionButton>
                    </FriendActions>
                  </FriendCard>
                ))}
            </FriendsGrid>
          ) : (
            <EmptyState>
              <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3>No friends yet</h3>
              <p>Start by adding some friends to connect with!</p>
            </EmptyState>
          )}
        </>
      )}

      {activeTab === 'requests' && (
        <>
          {requestsLoading ? (
            <LoadingSpinner>Loading requests...</LoadingSpinner>
          ) : friendRequests?.length > 0 ? (
            <div>
              {friendRequests.map(request => (
                <RequestCard key={request.id}>
                  <RequestHeader>
                    <RequestInfo>
                      <RequestAvatar>
                        {request.username?.charAt(0).toUpperCase() || 'U'}
                      </RequestAvatar>
                      <RequestDetails>
                        <RequestUsername>{request.username}</RequestUsername>
                        {request.minecraftUsername && (
                          <RequestMinecraftUsername>@{request.minecraftUsername}</RequestMinecraftUsername>
                        )}
                      </RequestDetails>
                    </RequestInfo>
                    <RequestActions>
                      <AcceptButton onClick={() => handleAcceptRequest(request.id)}>
                        <UserCheck size={16} />
                        Accept
                      </AcceptButton>
                      <RejectButton onClick={() => handleRejectRequest(request.id)}>
                        <UserX size={16} />
                        Reject
                      </RejectButton>
                    </RequestActions>
                  </RequestHeader>
                </RequestCard>
              ))}
            </div>
          ) : (
            <EmptyState>
              <UserCheck size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3>No pending requests</h3>
              <p>You don't have any pending friend requests.</p>
            </EmptyState>
          )}
        </>
      )}
    </FriendsContainer>
  );
};

export default Friends;