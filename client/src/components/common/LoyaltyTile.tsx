import React from "react";
import styled from "styled-components";

interface LoyaltyTileProps {
  name?: string;
  offer?: string;
  filledCircles?: number;
  totalCircles?: number;
}

const TileContainer = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: ${(props) => props.theme.borderRadius.large};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.md};
  width: 100%;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const LoyaltyTile: React.FC<LoyaltyTileProps> = ({
  name = "Salon",
  offer = "Reward",
  filledCircles = 0,
  totalCircles = 5,
}) => {
  return (
    <TileContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            color: "#2d2d2d",
          }}
        >
          {name}
        </h3>

        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#555",
            textTransform: "capitalize",
          }}
        >
          {offer}
        </span>

        <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
          {Array.from({ length: totalCircles }).map((_, index) => (
            <div
              key={index}
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                backgroundColor:
                  index < filledCircles ? "#27374d" : "#d4d4d4",
                transition: "0.2s ease",
              }}
            />
          ))}
        </div>
      </div>
    </TileContainer>
  );
};

export default LoyaltyTile;
