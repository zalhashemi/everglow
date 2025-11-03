import styled from 'styled-components';

interface ProfileHeaderProps {
  name: string;
  image: string;
  coverImage?: string;
  role?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }[];
}

const Container = styled.div`
  position: relative;
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CoverImage = styled.div<{ url?: string }>`
  height: 200px;
  background: ${props => props.url ? 
    `url(${props.url}) no-repeat center center / cover` : 
    props.theme.colors.primary};
`;

const ProfileContent = styled.div`
  padding: ${props => props.theme.spacing.xl};
  margin-top: -60px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid ${props => props.theme.colors.white};
  background: ${props => props.theme.colors.white};
  object-fit: cover;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Name = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.xlarge};
  text-align: center;
`;

const Role = styled.p`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.medium};
  margin: ${props => props.theme.spacing.xs} 0;
`;

const Stats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xl};
  margin: ${props => props.theme.spacing.lg} 0;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.large};
  font-weight: bold;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
  margin-top: ${props => props.theme.spacing.xs};
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.lg}`};
  border-radius: ${props => props.theme.borderRadius.medium};
  border: none;
  cursor: pointer;
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes.medium};
  transition: all 0.2s ease-in-out;

  ${props => props.variant === 'secondary' ? `
    background-color: ${props.theme.colors.gray.light};
    color: ${props.theme.colors.secondary};
    &:hover {
      background-color: ${props.theme.colors.gray.medium};
    }
  ` : `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.white};
    &:hover {
      background-color: ${props.theme.colors.primary}dd;
    }
  `}
`;

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  image,
  coverImage,
  role,
  stats,
  actions
}) => {
  return (
    <Container>
      <CoverImage url={coverImage} />
      <ProfileContent>
        <ProfileImage src={image} alt={name} />
        <Name>{name}</Name>
        {role && <Role>{role}</Role>}
        
        {stats && stats.length > 0 && (
          <Stats>
            {stats.map((stat, index) => (
              <StatItem key={index}>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            ))}
          </Stats>
        )}

        {actions && actions.length > 0 && (
          <Actions>
            {actions.map((action, index) => (
              <ActionButton
                key={index}
                onClick={action.onClick}
                variant={action.variant}
              >
                {action.label}
              </ActionButton>
            ))}
          </Actions>
        )}
      </ProfileContent>
    </Container>
  );
};

export default ProfileHeader;