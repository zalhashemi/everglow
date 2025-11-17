import React from "react";
import styled from "styled-components";
import ellieProfile from "../../images/ellieProfile.jpg";

interface ProfileStat {
  label: string;
  value: string | number;
}

interface ProfileHeaderProps {
  type: "customer" | "business";
  name: string;
  // legacy numeric stats
  stat1?: number;
  stat2?: number;
  stat3?: number;
  // optional richer props
  image?: string;
  coverImage?: string;
  stats?: ProfileStat[];
}

const Container = styled.div`
  width: 1300px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const HeaderBanner = styled.div`
  height: 140px;
  background-color: #4a5074;
  width: 100%;
`;

const Content = styled.div`
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const ProfileSection = styled.div`
  display: flex;
  gap: 32px;
`;

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #fff;
  margin-top: -65px;
  object-fit: cover;
`;

const Name = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 60px;
  padding-top: 8px;
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #6d6d6d;
  margin-top: 2px;
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
            <ProfileImage src={image || ellieProfile} alt="Profile" />
          </AvatarWrapper>

          <InfoColumn>
            <Name>{name}</Name>
          </InfoColumn>
        </ProfileSection>

        <StatsRow>
          {stats && stats.length > 0 ? (
            stats.map((s) => (
              <StatBlock key={s.label}>
                <StatNumber>{s.value}</StatNumber>
                <StatLabel>{s.label}</StatLabel>
              </StatBlock>
            ))
          ) : type === "customer" ? (
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
          ) : (
            <>
              <StatBlock>
                <StatNumber>{stat1}</StatNumber>
                <StatLabel>Avg Rating</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatNumber>{stat2}</StatNumber>
                <StatLabel>Total Clients</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatNumber>{stat3}</StatNumber>
                <StatLabel>Staff Members</StatLabel>
              </StatBlock>
            </>
          )}
        </StatsRow>
      </Content>
    </Container>
  );
};

export default ProfileHeader;
