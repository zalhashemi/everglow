import React from "react";
import { Plus } from "react-feather";

interface ServiceTileProps {
  name: string;
  duration: string;
  price: number;
  description?: string;
  onClick?: () => void;
  selected?: boolean;
  actions?: React.ReactNode;
}

const ServiceTile: React.FC<ServiceTileProps> = ({
  name,
  duration,
  price,
  description,
  onClick,
  selected = false,
  actions,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: selected ? "#f5f5f5" : "#ffffff",
        borderBottom: "1px solid #ddd",
        padding: "16px 12px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h4
          style={{
            margin: 0,
            fontSize: "15px",
            color: "#333",
            fontWeight: 600,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {name}
        </h4>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          <span>{price} BD</span>
          <span>⏱️ {duration}</span>
        </div>

        {description && (
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#777",
              opacity: 0.8,
            }}
          >
            {description}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
      </div>
    </div>
  );
};

export default ServiceTile;
