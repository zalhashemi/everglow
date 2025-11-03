import React, { useState } from 'react';
import styled from 'styled-components';
import TextBox from '../../components/common/TextBox';
import Button from '../../components/common/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl};
`;

const FormContainer = styled.div`
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.secondary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.xxlarge};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ToggleText = styled.p`
  text-align: center;
  margin-top: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};

  span {
    color: ${props => props.theme.colors.primary};
    cursor: pointer;
    font-weight: 500;
  }
`;

const UserTypeToggle = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'customer' | 'business'>('customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <Container>
      <FormContainer>
        <Title>Welcome Back</Title>
        <Form onSubmit={handleSubmit}>
          <UserTypeToggle>
            <Button
              variant={userType === 'customer' ? 'primary' : 'outline'}
              onClick={() => setUserType('customer')}
              fullWidth
            >
              Customer
            </Button>
            <Button
              variant={userType === 'business' ? 'primary' : 'outline'}
              onClick={() => setUserType('business')}
              fullWidth
            >
              Business
            </Button>
          </UserTypeToggle>

          <TextBox
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextBox
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth>
            Login
          </Button>
        </Form>

        <ToggleText>
          Don't have an account?{' '}
          <span>Register</span>
        </ToggleText>
      </FormContainer>
    </Container>
  );
};

export default Login;