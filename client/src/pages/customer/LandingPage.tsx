import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import everglowLogo from "../../images/everglowLogo.png";
import ProfileHeader from "../../components/common/ProfileHeader";
import SalonCard from "../../components/common/SalonCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(p) => p.theme.colors.background};
  min-height: 100vh;
`;

const Header = styled.header`
  width: 100%;
  background: ${(p) => p.theme.colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(p) => p.theme.spacing.md} 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing.sm};
  font-family: "Playfair Display", serif;
  font-size: ${(p) => p.theme.typography.fontSizes.xxlarge};
  color: ${(p) => p.theme.colors.secondary};
  width: 100%;

  img {
    width: 40%;
    height: 40%;
    object-fit: contain;
  }
`;

const Content = styled.section`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 1200px;
  gap: ${(p) => p.theme.spacing.xl};
  margin-top: ${(p) => p.theme.spacing.lg};
  flex-wrap: wrap;
`;

const LeftColumn = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Headline = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: ${(p) => p.theme.colors.secondary};
  line-height: 1.2;
  margin-bottom: ${(p) => p.theme.spacing.lg};

  span {
    display: block;
  }
`;

const SubText = styled.p`
  color: ${(p) => p.theme.colors.gray.dark};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  margin-bottom: ${(p) => p.theme.spacing.lg};
  max-width: 400px;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.md};
`;

const PrimaryButton = styled.button`
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.small};
  padding: ${(p) => `${p.theme.spacing.sm} ${p.theme.spacing.lg}`};
  cursor: pointer;
  font-weight: 600;
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${(p) => p.theme.colors.secondary};
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: 1px solid ${(p) => p.theme.colors.gray.medium};
  color: ${(p) => p.theme.colors.secondary};
  border-radius: ${(p) => p.theme.borderRadius.small};
  padding: ${(p) => `${p.theme.spacing.sm} ${p.theme.spacing.lg}`};
  cursor: pointer;
  font-weight: 500;
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const RightColumn = styled.div`
  flex: 1;
  min-width: 320px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${(p) => p.theme.spacing.sm};

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: ${(p) => p.theme.borderRadius.small};
  }
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <Logo>
          {/* Replace with your logo file if available */}
          <img src={everglowLogo} alt="EverGlow" />
        </Logo>
      </Header>
      
      <Content>
        <LeftColumn>
          <Headline>
            <span>Browse.</span>
            <span>Book.</span>
            <span>Beauty.</span>
          </Headline>

          <SubText>
            Unlock your beauty journey with ease — explore salons, book appointments,
            and glow with confidence.
          </SubText>

          <ButtonRow>
            <PrimaryButton onClick={() => navigate("/signup")}>Sign Up →</PrimaryButton>
            <SecondaryButton onClick={() => navigate("/login")}>Login</SecondaryButton>
          </ButtonRow>
        </LeftColumn>

        <RightColumn>
          <img src="/images/lash.jpg" alt="Lash Extension" />
          <img src="/images/nails.jpg" alt="Nail Art" />
          <img src="/images/facial.jpg" alt="Facial Treatment" />
          <img src="/images/hair.jpg" alt="Hair Styling" />
        </RightColumn>
      </Content>
    </Container>
  );
};

export default LandingPage;
