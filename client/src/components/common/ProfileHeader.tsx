import React from "react";
import styled from "styled-components";

interface ProfileStat {
  label: string;
  value: string | number;
}

interface ProfileHeaderProps {
  type: "customer" | "business";
  name: string;
  stat1?: number;
  stat2?: number;
  stat3?: number;
  image?: string | null;
  coverImage?: string;
  stats?: ProfileStat[];
}

const Container = styled.div`
  width: 100%;
  max-width: 1300px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    border-radius: 8px;
  }
`;

const HeaderBanner = styled.div`
  height: 140px;
  background-color: #4a5074;
  width: 100%;

  @media (max-width: 768px) {
    height: 100px;
  }

  @media (max-width: 480px) {
    height: 80px;
  }
`;

const Content = styled.div`
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  position: relative;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 20px;
    padding: 24px 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
`;


const InitialsCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #76949f;
  margin-top: -65px;
  border: 4px solid #fff;
  font-size: 42px;
  font-weight: 700;
  color: #faf6ea;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    margin-top: -45px;
    font-size: 32px;
    border: 3px solid #fff;
  }

  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
    margin-top: -35px;
    font-size: 24px;
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #fff;
  margin-top: -65px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    margin-top: -45px;
    border: 3px solid #fff;
  }

  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
    margin-top: -35px;
  }
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  flex: 1;
  min-width: 0;

  @media (max-width: 480px) {
    padding-top: 4px;
  }
`;

const Name = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 60px;
  padding-top: 8px;

  @media (max-width: 968px) {
    padding-top: 0;
    gap: 40px;
    justify-content: flex-start;
  }

  @media (max-width: 640px) {
    gap: 30px;
  }

  @media (max-width: 480px) {
    gap: 20px;
    flex-wrap: wrap;
  }
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  @media (max-width: 480px) {
    text-align: left;
    flex: 1;
    min-width: 80px;
  }
`;

const StatNumber = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #6d6d6d;
  margin-top: 2px;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    white-space: normal;
  }
`;

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  type,
  name,
  stat1 = 0,
  stat2 = 0,
  stat3 = 0,
  image,
  coverImage,
  stats,
}) => {
 
  const initials =
    name
      ?.trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("") || "C";


  const hasBusinessImage =
    type === "business" && image && image !== "" && image !== null;

  return (
    <Container>
      <HeaderBanner
        style={
          coverImage
            ? { backgroundImage: `url(${coverImage})`, backgroundSize: "cover" }
            : undefined
        }
      />

      <Content>
        <ProfileSection>
          <AvatarWrapper>
           
            {type === "customer" && <InitialsCircle>{initials}</InitialsCircle>}

        
            {type === "business" &&
              (hasBusinessImage ? (
                <ProfileImage src={image} alt="Profile" />
              ) : (
                <InitialsCircle>{initials}</InitialsCircle>
              ))}
          </AvatarWrapper>

          <InfoColumn>
            <Name>{name}</Name>
          </InfoColumn>
        </ProfileSection>

  
        {type === "customer" && (
          <StatsRow>
            {stats && stats.length > 0 ? (
              stats.map((s) => (
                <StatBlock key={s.label}>
                  <StatNumber>{s.value}</StatNumber>
                  <StatLabel>{s.label}</StatLabel>
                </StatBlock>
              ))
            ) : (
              <>
                <StatBlock>
                  <StatNumber>{stat1}</StatNumber>
                  <StatLabel>Bookings</StatLabel>
                </StatBlock>
                <StatBlock>
                  <StatNumber>{stat2}</StatNumber>
                  <StatLabel>Visited</StatLabel>
                </StatBlock>
                <StatBlock>
                  <StatNumber>{stat3}</StatNumber>
                  <StatLabel>Active Loyalty Programs</StatLabel>
                </StatBlock>
              </>
            )}
          </StatsRow>
        )}
      </Content>
    </Container>
  );
};

export default ProfileHeader;
