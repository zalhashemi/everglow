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
  rating?: number;   
  reviews?: number; 
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
      className="salon-card"
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
      <style>{`
        @media (max-width: 1024px) {
          .salon-card {
            width: 280px !important;
            height: 230px !important;
          }
          .salon-card-image {
            height: 140px !important;
          }
          .salon-card-name {
            font-size: 15px !important;
          }
        }
        
        @media (max-width: 768px) {
          .salon-card {
            width: 100% !important;
            max-width: 350px !important;
            height: 240px !important;
          }
        }
        
        @media (max-width: 480px) {
          .salon-card {
            width: 100% !important;
            height: 220px !important;
          }
          .salon-card-image {
            height: 130px !important;
          }
          .salon-card-details {
            padding: 8px 12px !important;
          }
          .salon-card-name {
            font-size: 14px !important;
          }
          .salon-card-rating {
            font-size: 13px !important;
          }
          .salon-card-location {
            font-size: 12px !important;
          }
        }
      `}</style>

 
      <div style={{ position: "relative" }}>
        <img
          src={imgSrc}
          alt={name}
          onError={() => setImgSrc(errorImage)}
          className="salon-card-image"
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
          }}
        />
      </div>

      <div className="salon-card-details" style={{ padding: "10px 14px" }}>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 600,
            fontSize: "16px",
            alignItems: "center",
          }}
        >
          <span className="salon-card-name">{name}</span>

          {showRating && (
            <div
              className="salon-card-rating"
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

        <div
          className="salon-card-location"
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
