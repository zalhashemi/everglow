import React from "react";
import styled from "styled-components";

interface LoyaltyTileProps {
  name?: string;          // reward name
  offer?: string;         // reward offer
  salon?: string;         // salon name
  filledCircles?: number;
  totalCircles?: number;
}

const TileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 14px;
  background: #faf9ff;
  border: 1px solid #e3ddff;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SalonName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #4A5174;
  opacity: 0.9;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #2b1f47;
`;

const OfferText = styled.span`
  font-size: 13px;
  color: #5a5a7a;
`;

const CirclesRow = styled.div`
  display: flex;
  gap: 6px;
`;

const Circle = styled.div<{ $filled?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  
  /* ★ NEW purple color */
  border: 2px solid #4A5174;
  background: ${({ $filled }) => ($filled ? "#4A5174" : "transparent")};
`;

const LoyaltyTile: React.FC<LoyaltyTileProps> = ({
  name = "Reward",
  offer = "Reward",
  salon = "",
  filledCircles = 0,
  totalCircles = 5,
}) => {
  const circles = Array.from({ length: totalCircles }, (_, i) => i);

  return (
    <TileContainer>
      <InfoColumn>
        {salon && <SalonName>{salon}</SalonName>}
        <Title>{name}</Title>
        <OfferText>{offer}</OfferText>
      </InfoColumn>

      <CirclesRow>
        {circles.map((i) => (
          <Circle key={i} $filled={i < filledCircles} />
        ))}
      </CirclesRow>
    </TileContainer>
  );
};

export default LoyaltyTile;
