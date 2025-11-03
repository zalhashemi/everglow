import styled from 'styled-components';

interface SalonCardProps {
  name: string;
  image: string;
  rating: number;
  location: string;
  services: string[];
  onClick?: () => void;
}

const Card = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  width: 100%;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: ${props => props.theme.spacing.md};
`;

const Name = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.large};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Location = styled.p`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
  margin: ${props => props.theme.spacing.xs} 0;
`;

const Rating = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSizes.medium};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ServicesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.sm};
`;

const ServiceTag = styled.span`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.secondary};
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.small};
`;

const SalonCard: React.FC<SalonCardProps> = ({
  name,
  image,
  rating,
  location,
  services,
  onClick
}) => {
  return (
    <Card onClick={onClick}>
      <ImageContainer>
        <Image src={image} alt={name} />
      </ImageContainer>
      <Content>
        <Name>{name}</Name>
        <Location>{location}</Location>
        <Rating>★ {rating.toFixed(1)}</Rating>
        <ServicesList>
          {services.map((service, index) => (
            <ServiceTag key={index}>{service}</ServiceTag>
          ))}
        </ServicesList>
      </Content>
    </Card>
  );
};

export default SalonCard;