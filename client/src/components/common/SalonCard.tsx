import React from "react";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import errorImage from "../../images/errorLoading.png";

interface SalonCardProps {
  id: string;
  image: string;
  name: string;
  distance?: string;
  location: string;
  rating?: number;   // ⭐ average rating
  reviews?: number;  // number of reviews
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

  const showRating = rating && rating > 0;

  return (
    <div
      onClick={onClick}
      style={{
        width: "310px",
        height: "250px",
        backgroundColor: "#fff",
        borderRadius: "14px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
        cursor: "pointer",
        overflow: "hidden",
        flexShrink: 0,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 6px 14px rgba(0, 0, 0, 0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 12px rgba(0, 0, 0, 0.12)";
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
            height: "150px",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Details */}
      <div style={{ padding: "10px 14px" }}>

        {/* Name + Rating on right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 600,
            fontSize: "16px",
            alignItems: "center",
          }}
        >
          <span>{name}</span>

          {/* ⭐ Rating (only if exists) */}
          {showRating && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#000",
              }}
            >
              <AiFillStar size={18} color="#FFD03F" />
              {rating?.toFixed(1)}
            </div>
          )}
        </div>

        {/* Location */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "5px",
            color: "#7A7A7A",
            fontSize: "13px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
          title={location}
        >
          <FiMapPin size={14} style={{ marginRight: "4px", flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {location}
          </span>
        </div>

      </div>
    </div>
  );
};

export default SalonCard;
