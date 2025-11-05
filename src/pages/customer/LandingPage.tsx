import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import SecondaryButton from '../../components/common/SecondaryButton';
import SalonCard from '../../components/common/SalonCard';
import BookingTile from '../../components/common/BookingTile';
import TimeCard from '../../components/common/TimeCard';
import ProfileHeader from '../../components/common/ProfileHeader';
import ServiceTile from '../../components/common/ServiceTile';
import LoyaltyTile from '../../components/common/LoyaltyTile';
import StaffCard from '../../components/common/StaffCard';



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
  const navigate = useNavigate();

  // Mock data
  const exampleService = {
    name: "Premium Haircut",
    duration: "45 min",
    price: 55,
    description: "Includes wash and style"
  };

  const exampleLoyalty = {
    points: 450,
    level: "Gold Member",
    nextLevel: "Platinum",
    pointsToNext: 550,
    rewards: [
      "10% off on all services",
      "Free birthday treatment",
      "Priority booking"
    ]
  };

  const exampleStaff = {
    name: "Sarah Johnson",
    role: "Senior Stylist",
    image: "https://example.com/staff1.jpg",
    specialties: ["Haircut", "Coloring"],
    rating: 4.9
  };

  return (
    <Container>
      <Hero>
        <Title>Discover and Book the Best Beauty & Wellness Services</Title>
        <Subtitle>
          Find, book, and experience top-rated beauty and wellness services in your area
        </Subtitle>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <ServiceTile {...exampleService} />
          <LoyaltyTile {...exampleLoyalty} />
          <StaffCard {...exampleStaff} />
        </div>
        
        <ButtonGroup>
          <Button
            width="200px"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
          <SecondaryButton
            width="200px"
            onClick={() => navigate('/login')}
          >
            Login
          </SecondaryButton>
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