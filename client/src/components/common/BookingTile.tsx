import React from "react";
import styled from "styled-components";
import Button from "./Button";
import SecondaryButton from "./SecondaryButton";
import errorImage from "../../images/errorLoading.png";

interface BookingTileProps {
  id: number | string;
  date: Date | string;
  image?: string;
  salonName?: string;
  businessName?: string;
  services?: string[] | string;
  serviceName?: string;
  location?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  onCancel?: () => void;
  onViewReceipt?: () => void;
  onLeaveRating?: () => void;
  onReschedule?: () => void;
  hasReview?: boolean; // ⭐ determines button label
}

/* ---- STYLED COMPONENTS ---- */
const Tile = styled.div`
  width: 1200px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: left;

  @media (max-width: 1280px) {
    width: 100%;
    max-width: 1200px;
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    gap: 18px;
  }

  @media (max-width: 480px) {
    padding: 16px 20px;
    gap: 16px;
  }
`;

const DateText = styled.div`
  font-size: 17px;
  font-weight: 800;
  color: #555;
  text-align: left;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const SalonImage = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 14px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const SalonName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #0b1c36;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const LocationText = styled.div`
  font-size: 17px;
  color: #7a7a7a;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ServiceText = styled.div`
  font-size: 16px;
  color: #9aa0a6;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const ReceiptButton = styled(Button)`
  width: 100%;
  max-width: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;

  @media (max-width: 768px) {
    gap: 16px;
    width: 100%;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const RatingButton = styled(SecondaryButton)`
  @media (max-width: 768px) {
    width: 100% !important;
    max-width: 100%;
  }
`;

/* ---- COMPONENT ---- */
const BookingTile: React.FC<BookingTileProps> = ({
  date,
  image,
  salonName,
  businessName,
  location,
  services,
  serviceName,
  status,
  onCancel,
  onViewReceipt,
  onLeaveRating,
  onReschedule,
  hasReview,
}) => {
  const displayName = salonName || businessName || "Salon";
  const serviceList = Array.isArray(services)
    ? services.join(", ")
    : services || serviceName || "";

  const [imgSrc, setImgSrc] = React.useState(image || errorImage);

  const isUpcoming = status === "pending" || status === "confirmed";
  const isPast = status === "completed" || status === "cancelled";

  const displayDate =
    typeof date === "string"
      ? date
      : date.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });

  return (
    <Tile>
      <DateText>{displayDate}</DateText>

      <InfoRow>
        <LeftSection>
          <SalonImage
            src={imgSrc}
            alt={displayName}
            onError={() => setImgSrc(errorImage)}
          />
          <Details>
            <SalonName>{displayName}</SalonName>
            <LocationText>{location}</LocationText>
            <ServiceText>Services: {serviceList}</ServiceText>
          </Details>
        </LeftSection>

        {isPast && (
          <RatingButton width="180px" onClick={onLeaveRating}>
            {hasReview ? "Edit Rating" : "Leave a Rating"}
          </RatingButton>
        )}
      </InfoRow>

      {/* Upcoming Booking Buttons */}
      {isUpcoming && (
        <ButtonRow>
          <SecondaryButton width="180px" onClick={onReschedule}>
            Reschedule
          </SecondaryButton>
          <SecondaryButton width="180px" onClick={onCancel}>
            Cancel
          </SecondaryButton>
          <Button width="180px" onClick={onViewReceipt}>
            View Receipt
          </Button>
        </ButtonRow>
      )}

      {/* Past Booking Button */}
      {isPast && (
        <ReceiptButton fullWidth onClick={onViewReceipt}>
          View Receipt
        </ReceiptButton>
      )}
    </Tile>
  );
};

export default BookingTile;
