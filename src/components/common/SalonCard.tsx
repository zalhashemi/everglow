import React from "react";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import errorImage from "../../images/errorLoading.png";

interface SalonCardProps {
  id: string;
  image: string;
  name: string;
  distance: string;
  location: string;
  rating: number;
  reviews: number;
  onClick: () => void;
}

const SalonCard: React.FC<SalonCardProps> = ({
  id,
  image,
  name,
  distance,
  location,
  rating,
  reviews,
  onClick,
}) => {
  const [imgSrc, setImgSrc] = React.useState(image || errorImage);

  return (
    <div
      onClick={onClick}
      style={{
        width: "280px",
        height: "211px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative" }}>
        <img
          src={imgSrc}
          alt={name}
          onError={() => setImgSrc(errorImage)}
          style={{
            width: "100%",
            height: "120px",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Details */}
      <div style={{ padding: "8px 12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 600,
            fontSize: "15px",
          }}
        >
          <span>{name}</span>
          <span style={{ color: "#7A7A7A", fontSize: "13px" }}>{distance}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "3px",
            color: "#7A7A7A",
            fontSize: "13px",
          }}
        >
          {React.createElement(FiMapPin as React.JSXElementConstructor<any>, {
            size: 14,
            style: { marginRight: "4px" },
          })}
          {location}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "4px",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          {React.createElement(AiFillStar as React.JSXElementConstructor<any>, {
            color: "#FFD03F",
            size: 16,
            style: { marginRight: "4px" },
          })}
          <span>{rating}</span>
          <span style={{ color: "#7A7A7A", marginLeft: "4px" }}>({reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
