import React from "react";
import styled from "styled-components";
import Button from "../common/Button";                // ✅ Primary button
import SecondaryButton from "../common/SecondaryButton"; // ✅ Secondary button
import errorImage from '../../images/errorLoading.png';

interface BookingTileProps {
  id: number | string;
  // allow either Date or formatted string
  date: Date | string;
  image?: string;
  // callers may pass `businessName` or `salonName`
  salonName?: string;
  businessName?: string;
  // callers may pass either an array of services or a single serviceName
  services?: string[] | string;
  serviceName?: string;
  location?: string;
  status: "upcoming" | "past" | "completed" | "cancelled";
  onCancel?: () => void;
  onViewReceipt?: () => void;
  onLeaveRating?: () => void;
  onReschedule?: () => void;
}

const Tile = styled.div`
  width: 95%;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid rgba(0,0,0,0.05);
`;

const DateText = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #555;
  text-align: left;
  width: 100%;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const SalonImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SalonName = styled.div`
  font-size: 16px;
  font-weight: 600;
  text-align: left;
`;

const LocationText = styled.div`
  font-size: 14px;
  color: #7a7a7a;
  text-align: left;
`;

const ServiceText = styled.div`
  font-size: 13px;
  color: #9aa0a6;
  text-align: left;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
`;

const ReceiptButton = styled(Button)`
  width: 100%;
  max-width: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  gap: 12px;
`;

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
  // Normalize incoming props to the shape this component expects
  const displayName = salonName || businessName || "Salon";
  const serviceList = Array.isArray(services)
    ? services.join(', ')
    : services || serviceName || '';

  const [imgSrc, setImgSrc] = React.useState(image || errorImage);

  const isPast = status === 'past' || status === 'completed';

  const displayDate = typeof date === 'string'
    ? date
    : date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });

  return (
    <Tile>
  <DateText>{displayDate}</DateText>

      <InfoRow>
        <LeftSection>
          <SalonImage 
            src={imgSrc} 
            alt={salonName} 
            onError={() => setImgSrc(errorImage)}
          />

          <Details>
            <SalonName>{salonName}</SalonName>
            <LocationText>{location}</LocationText>
            <ServiceText>Services: {serviceList}</ServiceText>
          </Details>
        </LeftSection>

        {isPast && (
          <SecondaryButton width="150px" onClick={onLeaveRating}>
            Leave a Rating
          </SecondaryButton>
        )}
      </InfoRow>

      {/* UPCOMING BOOKING UI */}
      {status === "upcoming" && (
        <ButtonRow>
          <SecondaryButton width="160px" onClick={onReschedule}>
            Reschedule
          </SecondaryButton>

          <SecondaryButton width="160px" onClick={onCancel}>
            Cancel Booking
          </SecondaryButton>

          <Button width="160px" onClick={onViewReceipt}>
            View Receipt
          </Button>
        </ButtonRow>
      )}

      {/* PAST BOOKING UI */}
      {status === "past" && (
        <ReceiptButton fullWidth onClick={onViewReceipt}>
          View Receipt
        </ReceiptButton>
      )}
    </Tile>
  );
};

export default BookingTile;
