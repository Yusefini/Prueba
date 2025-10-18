import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Heart, 
  MessageCircle,
  Users,
  Server,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { achievementsAPI } from '../services/api';

const AchievementsContainer = styled.div`
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
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.md};
  color: white;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Categories = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
  overflow-x: auto;
  padding-bottom: ${props => props.theme.spacing.sm};
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-weight: 500;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AchievementCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.md};
  }

  &.unlocked {
    border-color: ${props => props.theme.colors.success};
    background: ${props => props.theme.colors.success}10;
  }

  &.locked {
    opacity: 0.6;
  }
`;

const AchievementHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const AchievementIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const AchievementInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AchievementName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const AchievementCategory = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AchievementDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const AchievementFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AchievementStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 0.875rem;
  font-weight: 500;

  &.unlocked {
    color: ${props => props.theme.colors.success};
  }

  &.locked {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const UnlockDate = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${props => props.theme.colors.surfaceLight};
  border-radius: 2px;
  overflow: hidden;
  margin-top: ${props => props.theme.spacing.sm};
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  border-radius: 2px;
  transition: width 0.3s ease;
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

const Achievements = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch all achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery(
    'achievements',
    () => achievementsAPI.getAchievements().then(res => res.data),
    {
      enabled: !!user
    }
  );

  // Fetch user's achievements
  const { data: userAchievements, isLoading: userAchievementsLoading } = useQuery(
    ['user-achievements', user?.id],
    () => achievementsAPI.getUserAchievements(user?.id).then(res => res.data),
    {
      enabled: !!user
    }
  );

  const categories = [
    { id: 'all', name: 'All', icon: Trophy },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'server', name: 'Server', icon: Server },
    { id: 'communication', name: 'Communication', icon: MessageCircle },
    { id: 'special', name: 'Special', icon: Star }
  ];

  const getAchievementStatus = (achievementId) => {
    if (!userAchievements) return 'locked';
    return userAchievements.find(ua => ua.achievementId === achievementId) ? 'unlocked' : 'locked';
  };

  const getAchievementIcon = (category) => {
    const iconMap = {
      social: Users,
      server: Server,
      communication: MessageCircle,
      special: Star,
      default: Trophy
    };
    return iconMap[category] || iconMap.default;
  };

  const getAchievementColor = (category) => {
    const colorMap = {
      social: '#4ECDC4',
      server: '#FF6B6B',
      communication: '#FFB347',
      special: '#AA55AA',
      default: '#00D4AA'
    };
    return colorMap[category] || colorMap.default;
  };

  const filteredAchievements = achievements?.filter(achievement => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const unlockedCount = userAchievements?.length || 0;
  const totalCount = achievements?.length || 0;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  if (!user) {
    return (
      <AchievementsContainer>
        <EmptyState>
          <h3>Please log in to view achievements</h3>
        </EmptyState>
      </AchievementsContainer>
    );
  }

  return (
    <AchievementsContainer>
      <Header>
        <Title>Achievements</Title>
        <HeaderActions>
          <SearchContainer>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          <FilterButton>
            <Filter size={16} />
            Filter
          </FilterButton>
        </HeaderActions>
      </Header>

      <StatsSection>
        <StatsGrid>
          <StatCard>
            <StatIcon color="#00D4AA">
              <Trophy size={32} />
            </StatIcon>
            <StatValue>{unlockedCount}</StatValue>
            <StatLabel>Achievements Unlocked</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon color="#4ECDC4">
              <Target size={32} />
            </StatIcon>
            <StatValue>{totalCount}</StatValue>
            <StatLabel>Total Achievements</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon color="#FF6B6B">
              <Zap size={32} />
            </StatIcon>
            <StatValue>{completionPercentage}%</StatValue>
            <StatLabel>Completion Rate</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      <Categories>
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <CategoryButton
              key={category.id}
              active={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon size={16} />
              {category.name}
            </CategoryButton>
          );
        })}
      </Categories>

      {achievementsLoading || userAchievementsLoading ? (
        <LoadingSpinner>Loading achievements...</LoadingSpinner>
      ) : filteredAchievements.length > 0 ? (
        <AchievementsGrid>
          {filteredAchievements.map(achievement => {
            const status = getAchievementStatus(achievement.id);
            const Icon = getAchievementIcon(achievement.category);
            const color = getAchievementColor(achievement.category);
            const userAchievement = userAchievements?.find(ua => ua.achievementId === achievement.id);

            return (
              <AchievementCard key={achievement.id} className={status}>
                <AchievementHeader>
                  <AchievementIcon color={color}>
                    <Icon size={24} />
                  </AchievementIcon>
                  <AchievementInfo>
                    <AchievementName>{achievement.name}</AchievementName>
                    <AchievementCategory>{achievement.category}</AchievementCategory>
                  </AchievementInfo>
                </AchievementHeader>

                <AchievementDescription>
                  {achievement.description}
                </AchievementDescription>

                <AchievementFooter>
                  <AchievementStatus className={status}>
                    {status === 'unlocked' ? (
                      <>
                        <Trophy size={16} />
                        Unlocked
                      </>
                    ) : (
                      <>
                        <Target size={16} />
                        Locked
                      </>
                    )}
                  </AchievementStatus>
                  {userAchievement && (
                    <UnlockDate>
                      Unlocked {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                    </UnlockDate>
                  )}
                </AchievementFooter>
              </AchievementCard>
            );
          })}
        </AchievementsGrid>
      ) : (
        <EmptyState>
          <Trophy size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No achievements found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </EmptyState>
      )}
    </AchievementsContainer>
  );
};

export default Achievements;