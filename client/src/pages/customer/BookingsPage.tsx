// src/pages/customer/BookingsPage.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import BookingTile from "../../components/common/BookingTile";
import api from "../../utils/api";
import errorImage from "../../images/errorLoading.png";
import Popup from "../../components/common/Popup"; // ⬅️ adjust path/props if needed

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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

type ServiceDto = {
  _id: string;
  name: string;
  durationMinutes: number;
  priceBHD: number;
  description?: string;
};

type BusinessDto = {
  _id: string;
  businessName: string;
  address: string;
  city: string;
  imageUrl?: string;
};

type BookingDto = {
  _id: string;
  business: BusinessDto;
  services: ServiceDto[];
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

type BookingListItem = {
  id: string;
  bookingId: string;
  businessId: string;
  date: string;
  image: string;
  businessName: string;
  location: string;
  services: string[];
  servicesFull: ServiceDto[];
  totalDuration: number;
  totalPrice: number;
  status: "upcoming" | "past" | "cancelled";
};

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState<BookingListItem[]>([]);
  const [past, setPast] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [bookingIdToCancel, setBookingIdToCancel] = useState<string | null>(
    null
  );

  // ---- Load bookings for logged-in customer ----
  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get<BookingDto[]>("/bookings/me");
      const bookings = res.data || [];

      const now = new Date();

      const upcomingList: BookingListItem[] = [];
      const pastList: BookingListItem[] = [];

      bookings.forEach((b) => {
        const start = new Date(b.startTime);

        let tileStatus: "upcoming" | "past" | "cancelled";
        if (b.status === "cancelled") {
          tileStatus = "cancelled";
        } else if (start > now) {
          tileStatus = "upcoming";
        } else {
          tileStatus = "past";
        }

        const businessName = b.business?.businessName || "Salon";
        const location = b.business
          ? `${b.business.address}, ${b.business.city}`
          : "";

        const totalDuration = b.services.reduce(
          (sum, s) => sum + (s.durationMinutes || 0),
          0
        );
        const totalPrice = b.services.reduce(
          (sum, s) => sum + (s.priceBHD || 0),
          0
        );

        const item: BookingListItem = {
          id: b._id,
          bookingId: b._id,
          businessId: b.business?._id,
          date: start.toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          image: b.business?.imageUrl
            ? `http://localhost:5000${b.business.imageUrl}`
            : errorImage,
          businessName,
          location,
          services: b.services.map((s) => s.name),
          servicesFull: b.services,
          totalDuration,
          totalPrice,
          status: tileStatus,
        };

        if (tileStatus === "upcoming") {
          upcomingList.push(item);
        } else {
          pastList.push(item);
        }
      });

      setUpcoming(upcomingList);
      setPast(pastList);
    } catch (err) {
      console.error("Error loading customer bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // ---- Cancel booking handlers ----
  const handleCancelClick = (id: string) => {
    setBookingIdToCancel(id);
    setShowCancelPopup(true);
  };

  const confirmCancel = async () => {
    if (!bookingIdToCancel) return;
    try {
      await api.patch(`/bookings/${bookingIdToCancel}`, {
        action: "cancel",
      });
      setShowCancelPopup(false);
      setBookingIdToCancel(null);
      await loadBookings(); // refresh UI
    } catch (err: any) {
      console.error("Cancel booking error:", err);
      alert(err?.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const cancelPopupSecondary = () => {
    setShowCancelPopup(false);
    setBookingIdToCancel(null);
  };

  // ---- Reschedule booking ----
  const handleRescheduleClick = (booking: BookingListItem) => {
    navigate("/book/select-date", {
      state: {
        isReschedule: true,
        bookingId: booking.bookingId,
        businessId: booking.businessId,
        businessName: booking.businessName,
        selectedServices: booking.servicesFull,
        totalDurationMinutes: booking.totalDuration,
        totalPrice: booking.totalPrice,
      },
    });
  };

  if (loading) {
    return (
      <PageWrapper>
        <TabBar type="customer" />
        <ContentWrapper>
          <SectionTitle>Loading your bookings…</SectionTitle>
        </ContentWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <TabBar type="customer" />

      <ContentWrapper>
        {/* UPCOMING SECTION */}
        <Section>
          <SectionTitle>Upcoming Bookings</SectionTitle>
          <TilesContainer>
            {upcoming.length === 0 && <p>No upcoming bookings.</p>}
            {upcoming.map((booking) => (
              <BookingTile
                key={booking.id}
                id={booking.id}
                date={booking.date}
                image={booking.image}
                businessName={booking.businessName}
                location={booking.location}
                services={booking.services}
                status={
                  booking.status === "cancelled"
                    ? "cancelled"
                    : "upcoming"
                }
                onCancel={() => handleCancelClick(booking.id)}
                onReschedule={() => handleRescheduleClick(booking)}
                onViewReceipt={() => navigate(`/book/receipt/${booking.id}`)}
              />
            ))}
          </TilesContainer>
        </Section>

     {/* PAST SECTION */}
<Section>
  <SectionTitle>Past Bookings</SectionTitle>
  <TilesContainer>
    {past.length === 0 && <p>No past bookings.</p>}
    {past.map((booking) => (
      <BookingTile
        key={booking.id}
        id={booking.id}
        date={booking.date}
        image={booking.image}
        businessName={booking.businessName}
        location={booking.location}
        services={booking.services}
        status={booking.status}
        onViewReceipt={() => navigate(`/book/receipt/${booking.id}`)}
        onLeaveRating={() => alert("Ratings soon")}
      />
    ))}
  </TilesContainer>
</Section>

      </ContentWrapper>

      {/* Cancel Confirmation Popup */}
      {showCancelPopup && (
        <Popup
          title="Cancel Booking"
          description="Are you sure you want to cancel this booking?"
          primaryLabel="Yes, cancel"
          secondaryLabel="No, keep it"
          onPrimary={confirmCancel}
          onSecondary={cancelPopupSecondary}
        />
      )}
    </PageWrapper>
  );
};

export default BookingsPage;
