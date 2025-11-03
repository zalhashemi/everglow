import styled from 'styled-components';

interface LoyaltyTileProps {
  points: number;
  level: string;
  nextLevel: string;
  pointsToNext: number;
  rewards: string[];
}

const TileContainer = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

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

const LoyaltyTile: React.FC<LoyaltyTileProps> = ({
  points,
  level,
  nextLevel,
  pointsToNext,
  rewards
}) => {
  const progress = Math.min((points / (points + pointsToNext)) * 100, 100);

  return (
    <TileContainer>
      <Header>
        <Points>
          <PointsValue>{points}</PointsValue>
          <PointsLabel>Points</PointsLabel>
        </Points>
        <Level>
          <CurrentLevel>{level}</CurrentLevel>
          <NextLevel>{pointsToNext} points to {nextLevel}</NextLevel>
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
};

export default LoyaltyTile;