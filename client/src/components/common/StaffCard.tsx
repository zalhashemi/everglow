import React from 'react';
import styled from 'styled-components';
import { Star, Edit2 } from 'react-feather';

interface StaffCardProps {
  name: string;
  role: string;
  image?: string;
  specialties: string[];
  rating: number;
  reviews?: number; // ✅ made optional
  onEdit?: () => void;
  onClick?: () => void; // ✅ added for business page
  selected?: boolean;
}

const Card = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: ${props => props.theme.spacing.md};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 2px solid
    ${props => (props.selected ? props.theme.colors.primary : 'transparent')};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.round};
  background: ${props => props.theme.colors.gray.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: ${props => props.theme.colors.white};
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.medium};
  font-weight: 600;
`;

const Role = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
`;

const Specialty = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
  opacity: 0.8;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.small};
  margin-top: ${props => props.theme.spacing.xs};
`;

const StarIcon = styled(Star)`
  color: #f5b301;
  width: 14px;
  height: 14px;
  fill: #f5b301;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const EditButton = styled.button`
  background: ${props => props.theme.colors.gray.light};
  border: none;
  border-radius: ${props => props.theme.borderRadius.round};
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  accent-color: ${props => props.theme.colors.primary};
`;

const StaffCard: React.FC<StaffCardProps> = ({
  name,
  role,
  image,
  specialties,
  rating,
  reviews,
  onEdit,
  onClick,
  selected = false,
}) => {
  return (
    <Card onClick={onClick} selected={selected}>
      <LeftSection>
        <Avatar>{image ? <Image src={image} alt={name} /> : '👩‍🎨'}</Avatar>
        <Info>
          <Name>{name}</Name>
          <Role>{role}</Role>
          <Specialty>Specialties: {specialties.join(', ')}</Specialty>
          <RatingRow>
            <StarIcon />
            {rating.toFixed(1)}
            {reviews !== undefined && ` (${reviews} reviews)`}
          </RatingRow>
        </Info>
      </LeftSection>

      <RightSection>
        {onEdit && (
          <EditButton onClick={onEdit}>
            <Edit2 size={14} />
          </EditButton>
        )}
        <Checkbox checked={selected} readOnly />
      </RightSection>
    </Card>
  );
};

export default StaffCard;
