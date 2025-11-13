import React from 'react';
import styled from 'styled-components';
import { MapPin, Star } from 'react-feather';

// ✅ Combined interface: supports both "points" and "reward" tiles
interface LoyaltyTileProps {
  // Points-based (Profile page)
  points?: number;
  level?: string;
  nextLevel?: string;
  pointsToNext?: number;
  rewards?: string[];

  // Reward-based (Offers page)
  name?: string;
  location?: string;
  rating?: number;
  reviews?: number;
  offer?: string;
  filledCircles?: number;
  totalCircles?: number;
  distance?: string;
}

// ---------- Shared / Base Styles ----------
const TileContainer = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

// ---------- Points Tile Styles ----------
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Points = styled.div`
  text-align: center;
`;

const PointsValue = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.xxlarge};
  font-weight: 700;
`;

const PointsLabel = styled.p`
  color: ${props => props.theme.colors.gray.dark};
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.small};
`;

const Level = styled.div`
  text-align: right;
`;

const CurrentLevel = styled.h3`
  color: ${props => props.theme.colors.secondary};
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.large};
  font-weight: 600;
`;

const NextLevel = styled.p`
  color: ${props => props.theme.colors.gray.dark};
  margin: ${props => props.theme.spacing.xs} 0 0 0;
  font-size: ${props => props.theme.typography.fontSizes.small};
`;

const ProgressBar = styled.div`
  background: ${props => props.theme.colors.gray.light};
  height: 8px;
  border-radius: ${props => props.theme.borderRadius.small};
  margin: ${props => props.theme.spacing.md} 0;
  overflow: hidden;
`;

const Progress = styled.div<{ progress: number }>`
  background: ${props => props.theme.colors.primary};
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.3s ease-in-out;
`;

const RewardsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${props => props.theme.spacing.md} 0 0 0;
`;

const RewardItem = styled.li`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.small};
  margin-bottom: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;

  &:before {
    content: "✓";
    color: ${props => props.theme.colors.primary};
    margin-right: ${props => props.theme.spacing.xs};
  }
`;

// ---------- Reward Tile Styles ----------
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h4`
  margin: 0;
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes.medium};
  color: ${props => props.theme.colors.secondary};
  font-weight: 600;
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
`;

const StarIcon = styled(Star)`
  color: #f5b301;
  width: 14px;
  height: 14px;
  fill: #f5b301;
`;

const Offer = styled.span`
  font-weight: 700;
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.medium};
  text-transform: uppercase;
`;

const Circles = styled.div`
  display: flex;
  gap: 6px;
`;

const Circle = styled.div<{ filled?: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${props =>
    props.filled ? props.theme.colors.primary : props.theme.colors.gray.medium};
  transition: all 0.2s ease-in-out;
`;

const Distance = styled.span`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
  opacity: 0.8;
`;

// ---------- Component ----------
const LoyaltyTile: React.FC<LoyaltyTileProps> = props => {
  // If points exist, show Points Tile layout
  if (props.points !== undefined) {
    const { points, level, nextLevel, pointsToNext, rewards = [] } = props;
    const progress = Math.min(
      (points! / (points! + (pointsToNext ?? 0))) * 100,
      100
    );

    return (
      <TileContainer>
        <Header>
          <Points>
            <PointsValue>{points}</PointsValue>
            <PointsLabel>Points</PointsLabel>
          </Points>
          <Level>
            <CurrentLevel>{level}</CurrentLevel>
            <NextLevel>
              {pointsToNext} points to {nextLevel}
            </NextLevel>
          </Level>
        </Header>
        <ProgressBar>
          <Progress progress={progress} />
        </ProgressBar>
        <RewardsList>
          {rewards.map((reward, index) => (
            <RewardItem key={index}>{reward}</RewardItem>
          ))}
        </RewardsList>
      </TileContainer>
    );
  }

  // Otherwise, show Reward Tile layout
  const {
    name,
    location,
    rating,
    reviews,
    offer,
    filledCircles = 0,
    totalCircles = 5,
    distance,
  } = props;

  return (
    <TileContainer>
      <Row>
        <Info>
          <Name>{name}</Name>
          <LocationRow>
            <MapPin size={14} />
            {location}
          </LocationRow>
          <RatingRow>
            <StarIcon />
            {rating} ({reviews})
          </RatingRow>
        </Info>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Offer>{offer}</Offer>
          <Circles>
            {Array.from({ length: totalCircles }).map((_, index) => (
              <Circle key={index} filled={index < filledCircles} />
            ))}
          </Circles>
          <Distance>{distance}</Distance>
        </div>
      </Row>
    </TileContainer>
  );
};

export default LoyaltyTile;
