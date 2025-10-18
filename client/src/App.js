import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

// Components
import Navbar from './components/Navbar';
import AuthProvider from './contexts/AuthContext';
import SocketProvider from './contexts/SocketContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Servers from './pages/Servers';
import Messages from './pages/Messages';
import Friends from './pages/Friends';
import Achievements from './pages/Achievements';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Theme
const theme = {
  colors: {
    primary: '#00D4AA',
    secondary: '#FF6B6B',
    accent: '#4ECDC4',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceLight: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    success: '#00D4AA',
    warning: '#FFB347',
    error: '#FF6B6B',
    minecraft: {
      green: '#55C555',
      red: '#FF5555',
      blue: '#5555FF',
      yellow: '#FFFF55',
      purple: '#AA55AA',
      gold: '#FFAA00'
    }
  },
  fonts: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "Monaco", "Consolas", monospace'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.2)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.25)'
  }
};

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.colors.accent};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;
  }

  input, textarea {
    font-family: inherit;
    outline: none;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

// Main Container
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; // Account for fixed navbar
`;

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <AppContainer>
                <Navbar />
                <MainContent>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                      path="/profile/:id" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/servers" 
                      element={
                        <ProtectedRoute>
                          <Servers />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/messages" 
                      element={
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/friends" 
                      element={
                        <ProtectedRoute>
                          <Friends />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/achievements" 
                      element={
                        <ProtectedRoute>
                          <Achievements />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </MainContent>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: theme.colors.surface,
                      color: theme.colors.text,
                      border: `1px solid ${theme.colors.border}`,
                    },
                  }}
                />
              </AppContainer>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;