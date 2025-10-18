import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { 
  Plus, 
  Search, 
  Server, 
  Users, 
  Globe, 
  MessageCircle,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { fetchServers } from '../services/api';
import ServerCard from '../components/ServerCard';
import CreateServer from '../components/CreateServer';

const ServersContainer = styled.div`
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

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  border: none;
  color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.active ? 'white' : props.theme.colors.text};
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  }
`;

const CreateButton = styled.button`
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

const ServersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
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

const StatsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.md};
  color: white;
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

const Servers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateServer, setShowCreateServer] = useState(false);

  // Fetch servers
  const { data: serversData, isLoading, refetch } = useQuery(
    ['servers', searchQuery],
    () => fetchServers({ search: searchQuery, page: 1, limit: 50 }),
    {
      keepPreviousData: true
    }
  );

  const handleCreateServer = () => {
    setShowCreateServer(true);
  };

  const handleServerCreated = () => {
    setShowCreateServer(false);
    refetch();
  };

  if (showCreateServer) {
    return (
      <ServersContainer>
        <CreateServer 
          onCancel={() => setShowCreateServer(false)} 
          onSuccess={handleServerCreated} 
        />
      </ServersContainer>
    );
  }

  return (
    <ServersContainer>
      <Header>
        <Title>Minecraft Servers</Title>
        <HeaderActions>
          <SearchContainer>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          <FilterButton>
            <Filter size={16} />
            Filter
          </FilterButton>
          <ViewToggle>
            <ViewButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </ViewButton>
            <ViewButton 
              active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </ViewButton>
          </ViewToggle>
          <CreateButton onClick={handleCreateServer}>
            <Plus size={16} />
            Add Server
          </CreateButton>
        </HeaderActions>
      </Header>

      <StatsSection>
        <StatsGrid>
          <StatCard>
            <StatIcon color="#00D4AA">
              <Server size={24} />
            </StatIcon>
            <StatValue>{serversData?.servers?.length || 0}</StatValue>
            <StatLabel>Total Servers</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon color="#4ECDC4">
              <Users size={24} />
            </StatIcon>
            <StatValue>
              {serversData?.servers?.reduce((sum, server) => sum + server.playerCount, 0) || 0}
            </StatValue>
            <StatLabel>Players Online</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon color="#FF6B6B">
              <Globe size={24} />
            </StatIcon>
            <StatValue>
              {serversData?.servers?.filter(server => server.isOnline).length || 0}
            </StatValue>
            <StatLabel>Servers Online</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {isLoading ? (
        <LoadingSpinner>Loading servers...</LoadingSpinner>
      ) : serversData?.servers?.length > 0 ? (
        viewMode === 'grid' ? (
          <ServersGrid>
            {serversData.servers.map(server => (
              <ServerCard key={server.id} server={server} />
            ))}
          </ServersGrid>
        ) : (
          <ServersList>
            {serversData.servers.map(server => (
              <ServerCard key={server.id} server={server} />
            ))}
          </ServersList>
        )
      ) : (
        <EmptyState>
          <Server size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No servers found</h3>
          <p>Try adjusting your search or add a new server to get started.</p>
        </EmptyState>
      )}
    </ServersContainer>
  );
};

export default Servers;