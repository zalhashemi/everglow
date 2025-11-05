import React from "react";
import styled from "styled-components";
import Button from "../common/Button";                // ✅ Primary button
import SecondaryButton from "../common/SecondaryButton"; // ✅ Secondary button
import errorImage from '../../images/errorLoading.png';

interface BookingTileProps {
  id: string;
  date: string; // "Sep 10, 2024 - 9:30 AM"
  image: string;
  salonName: string;
  location: string;
  services: string[];
  status: "upcoming" | "past";
  onCancel?: () => void;
  onViewReceipt?: () => void;
  onLeaveRating?: () => void;
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
  location,
  services,
  status,
  onCancel,
  onViewReceipt,
  onLeaveRating,
}) => {
  const serviceList = services.join(", ");
  const [imgSrc, setImgSrc] = React.useState(image || errorImage);

  return (
    <Tile>
      <DateText>{date}</DateText>

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

        {status === "past" && (
          <SecondaryButton width="150px" onClick={onLeaveRating}>
            Leave a Rating
          </SecondaryButton>
        )}
      </InfoRow>

      {/* UPCOMING BOOKING UI */}
      {status === "upcoming" && (
        <ButtonRow>
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
