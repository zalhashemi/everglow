import React from "react";
import styled from "styled-components";
import TabBar from "../../components/common/TabBar";
import BookingTile from "../../components/common/BookingTile";
import salonImage from "../../images/oliviaSalon.jpg"; // example image


// ---- Styled Components ----
const PageWrapper = styled.div`
  background-color: #f2dcdc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  padding: 40px 0;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* ✅ forces all children (BookingTile) to start on left */
  gap: 60px;
`;


const Section = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-family: "Inter", sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #27374d;
  margin-bottom: 25px;
`;

const TilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

// ---- Component ----
const BookingsPage: React.FC = () => {
  console.log("✅ BookingsPage rendered");
  const upcomingBookings = [
    {
      id: 1,
      date: "Sep 10, 2024 - 9:30 AM",
      image: salonImage,
      salonName: "Hair Avenue",
      location: "Lakewood, California",
      services: ["Hair Cut", "Hair Wash"],
      status: "upcoming" as const,
    },
  ];

  const pastBookings = [
    {
      id: 2,
      date: "Sep 5, 2024 - 11:30 AM",
      image: salonImage,
      salonName: "CL Salon",
      location: "Lakewood, California",
      services: ["Hair Cut", "Hair Wash"],
      status: "past" as const,
    },
    {
      id: 3,
      date: "Aug 15, 2024 - 9:00 AM",
      image: salonImage,
      salonName: "Mcolors Beauty Salon",
      location: "Lakewood, California",
      services: ["Hair Cut", "Hair Wash"],
      status: "past" as const,
    },
  ];

  return (
    <PageWrapper>
      <TabBar type="customer" />

      <ContentWrapper>
        <Section>
          <SectionTitle>Upcoming Bookings</SectionTitle>
          <TilesContainer>
            {upcomingBookings.map((booking) => (
              <BookingTile
                key={booking.id}
                {...booking}
                onCancel={() => alert(`Cancelled booking ${booking.id}`)}
                onViewReceipt={() => alert(`View receipt for ${booking.id}`)}
                onReschedule={() => alert(`Reschedule booking ${booking.id}`)}
              />
            ))}
          </TilesContainer>
        </Section>

        <Section>
          <SectionTitle>Past Bookings</SectionTitle>
          <TilesContainer>
            {pastBookings.map((booking) => (
              <BookingTile
                key={booking.id}
                {...booking}
                onLeaveRating={() => alert(`Leave rating for ${booking.id}`)}
                onViewReceipt={() => alert(`View receipt for ${booking.id}`)}
              />
            ))}
          </TilesContainer>
        </Section>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default BookingsPage;
