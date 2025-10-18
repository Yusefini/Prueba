import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video,
  Smile,
  Paperclip,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { messagesAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const MessagesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${props => props.theme.spacing.lg};
  height: calc(100vh - 160px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const Sidebar = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }
`;

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm} 32px;
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.surfaceLight};
  }

  &.active {
    background: ${props => props.theme.colors.primary}20;
    border-left: 3px solid ${props => props.theme.colors.primary};
  }
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
  flex-shrink: 0;
`;

const ConversationInfo = styled.div`
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

const LastMessage = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${props => props.theme.spacing.xs};
`;

const Timestamp = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const UnreadBadge = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ChatArea = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surfaceLight};
`;

const ChatUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ChatUserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const ChatUserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ChatActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceLight};
  }
`;

const MessagesList = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
  ${props => props.isOwn && 'flex-direction: row-reverse;'}
`;

const MessageAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  max-width: 70%;
  ${props => props.isOwn && 'text-align: right;'}
`;

const MessageBubble = styled.div`
  background: ${props => props.isOwn ? props.theme.colors.primary : props.theme.colors.surfaceLight};
  color: ${props => props.isOwn ? 'white' : props.theme.colors.text};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  word-wrap: break-word;
  line-height: 1.4;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const MessageInput = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surfaceLight};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.sm};
`;

const InputActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const InputButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceLight};
  }
`;

const MessageTextArea = styled.textarea`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  font-size: 0.875rem;
  resize: none;
  max-height: 120px;
  min-height: 20px;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.accent};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
`;

const MobileBackButton = styled.button`
  display: none;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Messages = () => {
  const { user } = useAuth();
  const { emit, on, off } = useSocket();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch conversations
  const { data: conversationsData, refetch: refetchConversations } = useQuery(
    'conversations',
    () => messagesAPI.getConversations().then(res => res.data),
    {
      enabled: !!user
    }
  );

  // Fetch messages for selected conversation
  const { data: messagesData, refetch: refetchMessages } = useQuery(
    ['messages', selectedConversation?.partner.id],
    () => messagesAPI.getMessages(selectedConversation?.partner.id).then(res => res.data),
    {
      enabled: !!selectedConversation
    }
  );

  // Socket event listeners
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data.senderId === selectedConversation?.partner.id) {
        refetchMessages();
      }
      refetchConversations();
    };

    on('receive-message', handleReceiveMessage);

    return () => {
      off('receive-message', handleReceiveMessage);
    };
  }, [selectedConversation, on, off, refetchMessages, refetchConversations]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedConversation) return;

    try {
      await messagesAPI.sendMessage(selectedConversation.partner.id, message);
      setMessage('');
      refetchMessages();
      refetchConversations();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!user) {
    return (
      <MessagesContainer>
        <EmptyState>
          <h3>Please log in to view messages</h3>
        </EmptyState>
      </MessagesContainer>
    );
  }

  return (
    <MessagesContainer>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarHeader>
          <SearchContainer>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput placeholder="Search conversations..." />
          </SearchContainer>
        </SidebarHeader>
        
        <ConversationsList>
          {conversationsData?.map(conversation => (
            <ConversationItem
              key={conversation.partner.id}
              className={selectedConversation?.partner.id === conversation.partner.id ? 'active' : ''}
              onClick={() => {
                setSelectedConversation(conversation);
                setIsSidebarOpen(false);
              }}
            >
              <Avatar>
                {conversation.partner.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <ConversationInfo>
                <Username>{conversation.partner.username}</Username>
                <LastMessage>{conversation.lastMessage?.content}</LastMessage>
              </ConversationInfo>
              <MessageMeta>
                <Timestamp>
                  {conversation.lastMessage && formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                </Timestamp>
                {conversation.unreadCount > 0 && (
                  <UnreadBadge>{conversation.unreadCount}</UnreadBadge>
                )}
              </MessageMeta>
            </ConversationItem>
          ))}
        </ConversationsList>
      </Sidebar>

      <ChatArea>
        {selectedConversation ? (
          <>
            <ChatHeader>
              <ChatUserInfo>
                <MobileBackButton onClick={() => setIsSidebarOpen(true)}>
                  <ArrowLeft size={20} />
                </MobileBackButton>
                <ChatUserAvatar>
                  {selectedConversation.partner.username?.charAt(0).toUpperCase() || 'U'}
                </ChatUserAvatar>
                <ChatUserName>{selectedConversation.partner.username}</ChatUserName>
              </ChatUserInfo>
              <ChatActions>
                <ActionButton>
                  <Phone size={18} />
                </ActionButton>
                <ActionButton>
                  <Video size={18} />
                </ActionButton>
                <ActionButton>
                  <MoreVertical size={18} />
                </ActionButton>
              </ChatActions>
            </ChatHeader>

            <MessagesList>
              {messagesData?.map(msg => (
                <Message key={msg.id} isOwn={msg.senderId === user.id}>
                  <MessageAvatar>
                    {msg.sender.username?.charAt(0).toUpperCase() || 'U'}
                  </MessageAvatar>
                  <MessageContent isOwn={msg.senderId === user.id}>
                    <MessageBubble isOwn={msg.senderId === user.id}>
                      {msg.content}
                    </MessageBubble>
                    <MessageTime>
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </MessageTime>
                  </MessageContent>
                </Message>
              ))}
            </MessagesList>

            <MessageInput>
              <form onSubmit={handleSendMessage}>
                <InputContainer>
                  <InputActions>
                    <InputButton type="button">
                      <Paperclip size={18} />
                    </InputButton>
                    <InputButton type="button">
                      <Smile size={18} />
                    </InputButton>
                  </InputActions>
                  <MessageTextArea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows="1"
                  />
                  <SendButton type="submit" disabled={!message.trim()}>
                    <Send size={18} />
                  </SendButton>
                </InputContainer>
              </form>
            </MessageInput>
          </>
        ) : (
          <EmptyState>
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the sidebar to start messaging</p>
          </EmptyState>
        )}
      </ChatArea>
    </MessagesContainer>
  );
};

export default Messages;