import React from "react";
import styled from "styled-components";
import errorLoading from "../../images/errorLoading.png";

const Wrapper = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  margin-bottom: 40px;
  flex-shrink: 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

const OfferTextContainer = styled.div`
  position: absolute;
  left: 20px;
  bottom: 70px;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
`;

const OfferTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
`;

const SalonName = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const BookNowButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: #0b1c36;
  color: white;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

interface PromoBannerProps {
  image: string;
  title: string;
  salonName: string;
  onBookNow: () => void;
}

export default function PromoBanner({
  image,
  title,
  salonName,
  onBookNow,
}: PromoBannerProps) {
  return (
    <Wrapper>
      <Image src={image || errorLoading} alt={title} />

      <OfferTextContainer>
        <OfferTitle>{title}</OfferTitle>
        <SalonName>{salonName}</SalonName>
      </OfferTextContainer>

      <BookNowButton onClick={onBookNow}>Book Now</BookNowButton>
    </Wrapper>
  );
}
