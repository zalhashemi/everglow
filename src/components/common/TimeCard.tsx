import styled from 'styled-components';

interface TimeCardProps {
  time: string;
  available: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const Card = styled.div<{ available: boolean; selected?: boolean }>`
  background: ${props => {
    if (!props.available) return props.theme.colors.gray.light;
    if (props.selected) return props.theme.colors.primary;
    return props.theme.colors.white;
  }};
  border: 2px solid ${props => {
    if (!props.available) return props.theme.colors.gray.medium;
    if (props.selected) return props.theme.colors.primary;
    return props.theme.colors.gray.light;
  }};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  cursor: ${props => props.available ? 'pointer' : 'not-allowed'};
  transition: all 0.2s ease-in-out;
  text-align: center;

  &:hover {
    ${props => props.available && !props.selected && `
      border-color: ${props.theme.colors.primary};
      transform: translateY(-2px);
    `}
  }
`;

const Time = styled.span<{ available: boolean; selected?: boolean }>`
  font-size: ${props => props.theme.typography.fontSizes.medium};
  color: ${props => {
    if (!props.available) return props.theme.colors.gray.dark;
    if (props.selected) return props.theme.colors.white;
    return props.theme.colors.secondary;
  }};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
`;

const TimeCard: React.FC<TimeCardProps> = ({
  time,
  available,
  selected = false,
  onClick
}) => {
  return (
    <Card
      available={available}
      selected={selected}
      onClick={available ? onClick : undefined}
    >
      <Time available={available} selected={selected}>
        {time}
      </Time>
    </Card>
  );
};

export default TimeCard;