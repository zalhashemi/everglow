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
  status: "upcoming" | "past" | "completed" | "cancelled";
  onCancel?: () => void;
  onViewReceipt?: () => void;
  onLeaveRating?: () => void;
  onReschedule?: () => void;
}

/* ---- STYLED COMPONENTS ---- */
const Tile = styled.div`
  width: 1600px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 28px 32px; /* Slightly more breathing room */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: left;
`;

const DateText = styled.div`
  font-size: 17px; /* +2 */
  font-weight: 800;
  color: #555;
  text-align: left;
  width: 100%;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const SalonImage = styled.img`
  width: 96px; /* +16px from 80px */
  height: 96px;
  border-radius: 14px;
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SalonName = styled.div`
  font-size: 20px; /* +2 */
  font-weight: 700;
  color: #0b1c36;
  text-align: left;
`;

const LocationText = styled.div`
  font-size: 17px; /* +2 */
  color: #7a7a7a;
  text-align: left;
`;

const ServiceText = styled.div`
  font-size: 16px; /* +2 */
  color: #9aa0a6;
  text-align: left;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  width: 100%;
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
}) => {
  const displayName = salonName || businessName || "Salon";
  const serviceList = Array.isArray(services)
    ? services.join(", ")
    : services || serviceName || "";

  const [imgSrc, setImgSrc] = React.useState(image || errorImage);
  const isPast = status === "past" || status === "completed";

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
          <SecondaryButton width="180px" onClick={onLeaveRating}>
            Leave a Rating
          </SecondaryButton>
        )}
      </InfoRow>

      {/* ✅ Upcoming Booking Buttons (Left-aligned, unchanged size) */}
      {status === "upcoming" && (
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
      {status === "past" && (
        <ReceiptButton fullWidth onClick={onViewReceipt}>
          View Receipt
        </ReceiptButton>
      )}
    </Tile>
  );
};

export default BookingTile;
