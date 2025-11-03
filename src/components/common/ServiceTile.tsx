import styled from 'styled-components';

interface ServiceTileProps {
  name: string;
  duration: string;
  price: number;
  description?: string;
  onClick?: () => void;
  selected?: boolean;
}

const TileContainer = styled.div<{ selected?: boolean }>`
  background: ${props => props.selected ? props.theme.colors.primary + '22' : props.theme.colors.white};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.gray.medium};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const ServiceName = styled.h4`
  margin: 0;
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.medium};
`;

const ServiceDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.xs};
`;

const Duration = styled.span`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
`;

const Price = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  font-size: ${props => props.theme.typography.fontSizes.medium};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
  margin: ${props => props.theme.spacing.sm} 0 0 0;
`;

const ServiceTile: React.FC<ServiceTileProps> = ({
  name,
  duration,
  price,
  description,
  onClick,
  selected = false
}) => {
  return (
    <TileContainer onClick={onClick} selected={selected}>
      <ServiceName>{name}</ServiceName>
      <ServiceDetails>
        <Duration>{duration}</Duration>
        <Price>${price.toFixed(2)}</Price>
      </ServiceDetails>
      {description && <Description>{description}</Description>}
    </TileContainer>
  );
};

export default ServiceTile;