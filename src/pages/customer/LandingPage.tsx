import React from 'react';
import styled from 'styled-components';
import Button from '../../components/common/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Hero = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 80vh;
  justify-content: center;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.xxlarge};
  margin-bottom: ${props => props.theme.spacing.md};
  max-width: 800px;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.large};
  margin-bottom: ${props => props.theme.spacing.xl};
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const Features = styled.div`
  padding: ${props => props.theme.spacing.xl};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.white};
`;

const FeatureCard = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.large};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.medium};
`;

const LandingPage: React.FC = () => {
  return (
    <Container>
      <Hero>
        <Title>Discover and Book the Best Beauty & Wellness Services</Title>
        <Subtitle>
          Find, book, and experience top-rated beauty and wellness services in your area
        </Subtitle>
        <ButtonGroup>
          <Button variant="primary" size="large">
            Get Started
          </Button>
          <Button variant="outline" size="large">
            Learn More
          </Button>
        </ButtonGroup>
      </Hero>

      <Features>
        <FeatureCard>
          <FeatureIcon>🔍</FeatureIcon>
          <FeatureTitle>Easy Search</FeatureTitle>
          <FeatureDescription>
            Find the perfect service provider with our smart search and filtering system
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📅</FeatureIcon>
          <FeatureTitle>Simple Booking</FeatureTitle>
          <FeatureDescription>
            Book appointments instantly with our real-time scheduling system
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>⭐</FeatureIcon>
          <FeatureTitle>Verified Reviews</FeatureTitle>
          <FeatureDescription>
            Make informed decisions with authentic reviews from real customers
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🎁</FeatureIcon>
          <FeatureTitle>Loyalty Rewards</FeatureTitle>
          <FeatureDescription>
            Earn points and get exclusive rewards with every booking
          </FeatureDescription>
        </FeatureCard>
      </Features>
    </Container>
  );
};

export default LandingPage;