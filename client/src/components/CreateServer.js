import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Server, Globe, MessageCircle, Save } from 'lucide-react';
import { serversAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const CreateServerContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.surfaceLight};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
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

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.secondary {
    background: ${props => props.theme.colors.surfaceLight};
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};

    &:hover {
      background: ${props => props.theme.colors.border};
    }
  }

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props => props.theme.colors.accent};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const CreateServer = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ip: '',
    port: 25565,
    version: '',
    maxPlayers: 20,
    website: '',
    discord: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' || name === 'maxPlayers' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await serversAPI.createServer(formData);
      toast.success('Server created successfully!');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CreateServerContainer>
      <Header>
        <Title>Add New Server</Title>
        <CloseButton onClick={onCancel}>
          <X size={20} />
        </CloseButton>
      </Header>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="name">Server Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="My Awesome Server"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            placeholder="Describe your server, what makes it special, rules, etc."
            value={formData.description}
            onChange={handleChange}
            maxLength={500}
          />
          <HelpText>{formData.description.length}/500 characters</HelpText>
        </InputGroup>

        <Row>
          <InputGroup>
            <Label htmlFor="ip">Server IP *</Label>
            <Input
              id="ip"
              name="ip"
              type="text"
              placeholder="play.example.com"
              value={formData.ip}
              onChange={handleChange}
              required
            />
            <HelpText>Enter the server IP address or domain name</HelpText>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              name="port"
              type="number"
              placeholder="25565"
              value={formData.port}
              onChange={handleChange}
              min="1"
              max="65535"
            />
            <HelpText>Default: 25565</HelpText>
          </InputGroup>
        </Row>

        <Row>
          <InputGroup>
            <Label htmlFor="version">Minecraft Version</Label>
            <Select
              id="version"
              name="version"
              value={formData.version}
              onChange={handleChange}
            >
              <option value="">Select version</option>
              <option value="1.20.4">1.20.4</option>
              <option value="1.20.3">1.20.3</option>
              <option value="1.20.2">1.20.2</option>
              <option value="1.20.1">1.20.1</option>
              <option value="1.20">1.20</option>
              <option value="1.19.4">1.19.4</option>
              <option value="1.19.3">1.19.3</option>
              <option value="1.19.2">1.19.2</option>
              <option value="1.19.1">1.19.1</option>
              <option value="1.19">1.19</option>
              <option value="1.18.2">1.18.2</option>
              <option value="1.17.1">1.17.1</option>
              <option value="1.16.5">1.16.5</option>
              <option value="Other">Other</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="maxPlayers">Max Players</Label>
            <Input
              id="maxPlayers"
              name="maxPlayers"
              type="number"
              placeholder="20"
              value={formData.maxPlayers}
              onChange={handleChange}
              min="1"
              max="1000"
            />
          </InputGroup>
        </Row>

        <InputGroup>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleChange}
          />
          <HelpText>Optional: Link to your server's website</HelpText>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="discord">Discord</Label>
          <Input
            id="discord"
            name="discord"
            type="url"
            placeholder="https://discord.gg/example"
            value={formData.discord}
            onChange={handleChange}
          />
          <HelpText>Optional: Link to your Discord server</HelpText>
        </InputGroup>

        <Actions>
          <Button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="primary" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? 'Creating...' : 'Create Server'}
          </Button>
        </Actions>
      </Form>
    </CreateServerContainer>
  );
};

export default CreateServer;