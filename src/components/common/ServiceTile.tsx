import React from "react";
import { Plus } from "react-feather";

interface ServiceTileProps {
  name: string;
  duration: string;
  price: number;
  description?: string;
  onClick?: () => void;
  selected?: boolean;
  icon?: React.ReactNode; // 👈 optional custom icon prop
}

const ServiceTile: React.FC<ServiceTileProps> = ({
  name,
  duration,
  price,
  description,
  onClick,
  selected = false,
  icon, // 👈 use this
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: selected ? "#f5f5f5" : "#ffffff",
        borderBottom: "1px solid #ddd",
        padding: "16px 12px",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      {/* Left section */}
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

      {/* Dynamic Button */}
      <button
        style={{
          background: "none",
          border: "1.5px solid #bbb",
          color: "#333",
          borderRadius: "50%",
          padding: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease-in-out",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = "#76949F";
          e.currentTarget.style.color = "#76949F";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = "#bbb";
          e.currentTarget.style.color = "#333";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* 👇 Default to Plus if no icon prop passed */}
        {icon || <Plus size={16} />}
      </button>
    </div>
  );
};

export default ServiceTile;
