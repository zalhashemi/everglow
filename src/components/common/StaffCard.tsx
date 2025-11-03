import styled from 'styled-components';

interface StaffCardProps {
  name: string;
  role: string;
  image: string;
  specialties: string[];
  rating: number;
  availability?: string;
  onClick?: () => void;
  selected?: boolean;
}

const Card = styled.div<{ selected?: boolean }>`
  background: ${props => props.theme.colors.white};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: ${props => props.theme.spacing.md} auto;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: ${props => props.theme.spacing.md};
  text-align: center;
`;

const Name = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.large};
`;

const Role = styled.p`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
  margin: ${props => props.theme.spacing.xs} 0;
`;

const Rating = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSizes.medium};
  margin: ${props => props.theme.spacing.sm} 0;
`;

const SpecialtiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  justify-content: center;
  margin: ${props => props.theme.spacing.sm} 0;
`;

const Specialty = styled.span`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.secondary};
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.small};
`;

const Availability = styled.p`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSizes.small};
  margin: ${props => props.theme.spacing.sm} 0 0 0;
`;

const StaffCard: React.FC<StaffCardProps> = ({
  name,
  role,
  image,
  specialties,
  rating,
  availability,
  onClick,
  selected = false
}) => {
  return (
    <Card onClick={onClick} selected={selected}>
      <ImageContainer>
        <Image src={image} alt={name} />
      </ImageContainer>
      <Content>
        <Name>{name}</Name>
        <Role>{role}</Role>
        <Rating>★ {rating.toFixed(1)}</Rating>
        <SpecialtiesList>
          {specialties.map((specialty, index) => (
            <Specialty key={index}>{specialty}</Specialty>
          ))}
        </SpecialtiesList>
        {availability && <Availability>{availability}</Availability>}
      </Content>
    </Card>
  );
};

export default StaffCard;