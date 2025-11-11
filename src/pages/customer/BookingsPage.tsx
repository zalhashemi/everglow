import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import ServiceTile from "../../components/common/ServiceTile";
import errorImage from "../../images/errorLoading.png";

const BookingsPage: React.FC = () => {
  const location = useLocation();
  const salon = location.state as any;

  // ✅ Hooks must come before conditionals
  const [activeTab, setActiveTab] = useState(salon?.categories?.[0] || "");
  const [imgSrc, setImgSrc] = useState(salon?.image || errorImage);

  if (!salon) {
    return <div style={{ padding: "20px" }}>Salon not found.</div>;
  }

  return (
    <div style={{ backgroundColor: "#F7F1F3", minHeight: "100vh", padding: "40px 0" }}>
      <div
        style={{
          width: "90%",
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Salon Header */}
        <img
          src={imgSrc}
          alt={salon.name}
          onError={() => setImgSrc(errorImage)}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
          }}
        />

        <div style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700 }}>{salon.name}</h2>

          {/* Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "6px",
              color: "#7A7A7A",
              fontSize: "14px",
            }}
          >
            {React.createElement(FiMapPin as any, {
              size: 16,
              style: { marginRight: "4px" },
            })}
            {salon.location}
          </div>

          {/* Hours */}
          <div style={{ color: "#7A7A7A", fontSize: "14px", marginTop: "4px" }}>
            {salon.hours}
          </div>

          {/* Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "6px",
              fontSize: "14px",
            }}
          >
            {React.createElement(AiFillStar as any, {
              color: "#FFD03F",
              size: 16,
              style: { marginRight: "4px" },
            })}
            <span>{salon.rating}</span>
            <span style={{ color: "#7A7A7A", marginLeft: "4px" }}>
              ({salon.reviews})
            </span>
          </div>

          {/* Description */}
          <p style={{ marginTop: "12px", color: "#555", fontSize: "14px" }}>
            {salon.description}
          </p>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              borderBottom: "1px solid #e5e5e5",
              marginTop: "20px",
            }}
          >
            {salon.categories.map((tab: string) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  border: "none",
                  background: "none",
                  fontWeight: 500,
                  color: activeTab === tab ? "#000" : "#7A7A7A",
                  borderBottom:
                    activeTab === tab ? "2px solid #000" : "2px solid transparent",
                  padding: "10px 0",
                  cursor: "pointer",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Services */}
          <div style={{ marginTop: "20px" }}>
            {salon.services.map((service: any) => (
              <ServiceTile
                key={service.id}
                name={service.name}
                price={service.price}
                duration={service.duration}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
