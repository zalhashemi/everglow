import styled from 'styled-components';

interface BookingTileProps {
  businessName: string;
  serviceName: string;
  date: Date;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  onReschedule?: () => void;
  onCancel?: () => void;
}

const TileContainer = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const BusinessName = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.large};
`;

const Status = styled.span<{ status: BookingTileProps['status'] }>`
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.small};
  
  ${props => {
    switch (props.status) {
      case 'upcoming':
        return `
          background: ${props.theme.colors.primary}22;
          color: ${props.theme.colors.primary};
        `;
      case 'completed':
        return `
          background: #4CAF5022;
          color: #4CAF50;
        `;
      case 'cancelled':
        return `
          background: #F4433622;
          color: #F44336;
        `;
    }
  }}
`;

const ServiceDetails = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ServiceName = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.medium};
  color: ${props => props.theme.colors.gray.dark};
`;

const DateTime = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const DateTimeItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
`;

const Price = styled.p`
  margin: 0;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSizes.medium};
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.md}`};
  border-radius: ${props => props.theme.borderRadius.small};
  border: none;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.small};
  transition: background-color 0.2s ease-in-out;

  ${props => props.variant === 'primary' ? `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.white};
    &:hover {
      background-color: ${props.theme.colors.primary}dd;
    }
  ` : `
    background-color: ${props.theme.colors.gray.light};
    color: ${props.theme.colors.gray.dark};
    &:hover {
      background-color: ${props.theme.colors.gray.medium};
    }
  `}
`;

const BookingTile: React.FC<BookingTileProps> = ({
  businessName,
  serviceName,
  date,
  time,
  duration,
  status,
  price,
  onReschedule,
  onCancel
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <TileContainer>
      <Header>
        <BusinessName>{businessName}</BusinessName>
        <Status status={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Status>
      </Header>
      
      <ServiceDetails>
        <ServiceName>{serviceName}</ServiceName>
        <DateTime>
          <DateTimeItem>
            📅 {formatDate(date)}
          </DateTimeItem>
          <DateTimeItem>
            ⏰ {time}
          </DateTimeItem>
          <DateTimeItem>
            ⌛ {duration}
          </DateTimeItem>
        </DateTime>
        <Price>${price.toFixed(2)}</Price>
      </ServiceDetails>

      {status === 'upcoming' && (
        <Actions>
          {onReschedule && (
            <ActionButton variant="primary" onClick={onReschedule}>
              Reschedule
            </ActionButton>
          )}
          {onCancel && (
            <ActionButton variant="secondary" onClick={onCancel}>
              Cancel
            </ActionButton>
          )}
        </Actions>
      )}
    </TileContainer>
  );
};

export default BookingTile;