import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Trophy, 
  Server, 
  User, 
  LogOut, 
  Menu,
  X,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  backdrop-filter: blur(10px);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${props => props.theme.colors.surface};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    flex-direction: column;
    padding: ${props => props.theme.spacing.lg};
    gap: ${props => props.theme.spacing.md};
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceLight};
  }

  &.active {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.surfaceLight};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surfaceLight};
  color: ${props => props.theme.colors.textSecondary};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.border};
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const UserMenu = styled.div`
  position: relative;
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
  min-width: 200px;
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceLight};
  }

  &:first-child {
    border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  width: 100%;
  background: none;
  border: none;
  color: ${props => props.theme.colors.error};
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceLight};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const AuthButton = styled(Link)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props => props.theme.colors.accent};
    }
  }

  &.secondary {
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.border};

    &:hover {
      background: ${props => props.theme.colors.surfaceLight};
    }
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          <LogoIcon>M</LogoIcon>
          Minecraft Social
        </Logo>

        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/" className={isActive('/') ? 'active' : ''}>
            <Home size={20} />
            Home
          </NavLink>
          
          {user && (
            <>
              <NavLink to="/servers" className={isActive('/servers') ? 'active' : ''}>
                <Server size={20} />
                Servers
              </NavLink>
              <NavLink to="/friends" className={isActive('/friends') ? 'active' : ''}>
                <Users size={20} />
                Friends
              </NavLink>
              <NavLink to="/messages" className={isActive('/messages') ? 'active' : ''}>
                <MessageCircle size={20} />
                Messages
              </NavLink>
              <NavLink to="/achievements" className={isActive('/achievements') ? 'active' : ''}>
                <Trophy size={20} />
                Achievements
              </NavLink>
            </>
          )}
        </NavLinks>

        <UserSection>
          {user ? (
            <>
              <SearchButton>
                <Search size={20} />
              </SearchButton>
              
              <UserMenu>
                <UserAvatar onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </UserAvatar>
                
                {isUserMenuOpen && (
                  <Dropdown>
                    <DropdownItem to={`/profile/${user.id}`}>
                      <User size={16} />
                      Profile
                    </DropdownItem>
                    <LogoutButton onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </LogoutButton>
                  </Dropdown>
                )}
              </UserMenu>
            </>
          ) : (
            <AuthButtons>
              <AuthButton to="/login" className="secondary">
                Login
              </AuthButton>
              <AuthButton to="/register" className="primary">
                Register
              </AuthButton>
            </AuthButtons>
          )}

          <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </UserSection>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;