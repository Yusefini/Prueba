import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Server, 
  Users, 
  Globe, 
  MessageCircle, 
  ExternalLink,
  Wifi,
  WifiOff
} from 'lucide-react';

const ServerCardContainer = styled(Link)`
  display: block;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const ServerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ServerIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const ServerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ServerName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ServerStatus = styled.div`
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

const ServerDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ServerDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const PlayerCount = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const ServerVersion = styled.span`
  background: ${props => props.theme.colors.surfaceLight};
  padding: 2px 6px;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 500;
`;

const ServerLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.sm};
  padding-top: ${props => props.theme.spacing.sm};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const LinkButton = styled.a`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.border};
  }
`;

const ServerCard = ({ server }) => {
  const getServerIcon = (name) => {
    return name?.charAt(0).toUpperCase() || 'S';
  };

  const formatPlayerCount = (current, max) => {
    return `${current}/${max}`;
  };

  return (
    <ServerCardContainer to={`/servers/${server.id}`}>
      <ServerHeader>
        <ServerIcon>
          {getServerIcon(server.name)}
        </ServerIcon>
        <ServerInfo>
          <ServerName>{server.name}</ServerName>
          <ServerStatus>
            <StatusIndicator isOnline={server.isOnline} />
            {server.isOnline ? 'Online' : 'Offline'}
          </ServerStatus>
        </ServerInfo>
      </ServerHeader>

      {server.description && (
        <ServerDescription>{server.description}</ServerDescription>
      )}

      <ServerDetails>
        <DetailItem>
          <Users size={14} />
          <PlayerCount>
            {formatPlayerCount(server.playerCount, server.maxPlayers)}
          </PlayerCount>
          players
        </DetailItem>
        
        {server.version && (
          <ServerVersion>{server.version}</ServerVersion>
        )}
      </ServerDetails>

      {(server.website || server.discord) && (
        <ServerLinks>
          {server.website && (
            <LinkButton 
              href={server.website} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Globe size={12} />
              Website
            </LinkButton>
          )}
          {server.discord && (
            <LinkButton 
              href={server.discord} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <MessageCircle size={12} />
              Discord
            </LinkButton>
          )}
        </ServerLinks>
      )}
    </ServerCardContainer>
  );
};

export default ServerCard;