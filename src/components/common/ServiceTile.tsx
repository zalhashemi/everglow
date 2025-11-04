import React from 'react';
import styled from 'styled-components';
import { Plus } from 'react-feather'; // Icon for add button

interface ServiceTileProps {
  name: string;
  duration: string;
  price: number;
  description?: string;
  onClick?: () => void;
  selected?: boolean;
}

const TileContainer = styled.div<{ selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.gray.medium};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.sm};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.gray.light};
  }

  ${props =>
    props.selected &&
    `
    background-color: ${props.theme.colors.gray.light};
    border-left: 3px solid ${props.theme.colors.primary};
  `}
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ServiceName = styled.h4`
  margin: 0;
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes.medium};
  color: ${props => props.theme.colors.secondary};
  font-weight: 600;
`;

const SubInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Price = styled.span`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
  font-weight: 500;
`;

const Duration = styled.span`
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '⏱️';
    font-size: 0.9em;
  }
`;

const Description = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
  opacity: 0.8;
`;

const AddButton = styled.button`
  background: none;
  border: 1.5px solid ${props => props.theme.colors.gray.medium};
  color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.round};
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: scale(1.05);
  }
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
      <LeftSection>
        <ServiceName>{name}</ServiceName>
        <SubInfo>
          <Price>{price} BD</Price>
          <Duration>{duration}</Duration>
        </SubInfo>
        {description && <Description>{description}</Description>}
      </LeftSection>
      <AddButton>
        <Plus size={16} />
      </AddButton>
    </TileContainer>
  );
};

export default ServiceTile;
