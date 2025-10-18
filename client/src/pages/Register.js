import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, EyeOff, Mail, Lock, User, Gamepad2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.background} 0%, ${props => props.theme.colors.surface} 100%);
`;

const RegisterCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xxl};
  box-shadow: ${props => props.theme.shadows.xl};
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const LogoIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 2rem;
  margin: 0 auto ${props => props.theme.spacing.md};
`;

const LogoTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const LogoSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} 48px;
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceLight};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: white;
  font-size: 1rem;
  font-weight: 600;
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${props => props.theme.spacing.lg} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
  
  span {
    padding: 0 ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.875rem;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;

  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
    text-decoration: none;

    &:hover {
      color: ${props => props.theme.colors.accent};
    }
  }
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.error}20;
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  text-align: center;
`;

const PasswordRequirements = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    minecraftUsername: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (formData.minecraftUsername && formData.minecraftUsername.length < 3) {
      setError('Minecraft username must be at least 3 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await register(
      formData.email,
      formData.username,
      formData.password,
      formData.minecraftUsername || undefined
    );
    
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>
          <LogoIcon>M</LogoIcon>
          <LogoTitle>Join Minecraft Social</LogoTitle>
          <LogoSubtitle>Create your account to get started</LogoSubtitle>
        </Logo>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <InputGroup>
            <InputIcon>
              <Mail size={20} />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <User size={20} />
            </InputIcon>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Gamepad2 size={20} />
            </InputIcon>
            <Input
              type="text"
              name="minecraftUsername"
              placeholder="Minecraft username (optional)"
              value={formData.minecraftUsername}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
            <PasswordRequirements>
              Password must be at least 6 characters long
            </PasswordRequirements>
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <Divider>
          <span>or</span>
        </Divider>

        <LoginLink>
          Already have an account? <Link to="/login">Sign in</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;