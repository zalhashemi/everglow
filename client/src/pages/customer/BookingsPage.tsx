import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import BookingTile from "../../components/common/BookingTile";
import api from "../../utils/api";
import errorImage from "../../images/errorLoading.png";
import Popup from "../../components/common/Popup";
import RatingPopup from "../../components/common/RatingPopup";

/* ---------- Styled Components ---------- */

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

/* ---------- Types ---------- */

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

type MyReviewDto = {
  _id: string;
  rating: number;
  comment?: string;
  business: {
    _id: string;
    businessName: string;
    city: string;
  };
};

/* ---------- Component ---------- */

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState<BookingListItem[]>([]);
  const [past, setPast] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [bookingIdToCancel, setBookingIdToCancel] = useState<string | null>(
    null
  );

  // ⭐ My reviews (keyed by businessId)
  const [myReviews, setMyReviews] = useState<Record<string, MyReviewDto>>({});

  // ⭐ Rating popup states
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(
    null
  );
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [initialRating, setInitialRating] = useState<number | null>(null);
  const [initialComment, setInitialComment] = useState<string>("");

  /* ---------- Load Bookings ---------- */

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
        if (b.status === "cancelled") tileStatus = "cancelled";
        else if (start > now) tileStatus = "upcoming";
        else tileStatus = "past";

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

        if (tileStatus === "upcoming") upcomingList.push(item);
        else pastList.push(item);
      });

      setUpcoming(upcomingList);
      setPast(pastList);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Load My Reviews ---------- */

  const loadMyReviews = async () => {
    try {
      const res = await api.get<MyReviewDto[]>("/reviews/me");
      const list = res.data || [];
      const map: Record<string, MyReviewDto> = {};
      list.forEach((r) => {
        if (r.business && r.business._id) {
          map[r.business._id] = r;
        }
      });
      setMyReviews(map);
    } catch (err) {
      console.error("Error loading my reviews:", err);
    }
  };

  useEffect(() => {
    loadBookings();
    loadMyReviews();
  }, []);

  /* ---------- Cancel Booking ---------- */

  const handleCancelClick = (id: string) => {
    setBookingIdToCancel(id);
    setShowCancelPopup(true);
  };

  const confirmCancel = async () => {
    if (!bookingIdToCancel) return;

    try {
      await api.patch(`/bookings/${bookingIdToCancel}`, { action: "cancel" });
      setShowCancelPopup(false);
      setBookingIdToCancel(null);
      loadBookings();
    } catch (err: any) {
      console.error("Cancel booking error:", err);
      alert(err?.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const cancelPopupSecondary = () => {
    setShowCancelPopup(false);
    setBookingIdToCancel(null);
  };

  /* ---------- Reschedule ---------- */

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

  /* ---------- Open Rating Popup (new or edit) ---------- */

  const handleRatingClick = (businessId: string) => {
    setSelectedBusinessId(businessId);

    const existing = myReviews[businessId];

    if (existing) {
      setEditingReviewId(existing._id);
      setInitialRating(existing.rating);
      setInitialComment(existing.comment || "");
    } else {
      setEditingReviewId(null);
      setInitialRating(null);
      setInitialComment("");
    }

    setShowRatingPopup(true);
  };

  /* ---------- Submit Rating (create or update) ---------- */

  const submitReview = async (rating: number, comment: string) => {
    if (!selectedBusinessId) return;

    try {
      if (editingReviewId) {
        // UPDATE existing review
        await api.put(`/reviews/${editingReviewId}`, {
          rating,
          comment,
        });
      } else {
        // CREATE new review
        await api.post("/reviews", {
          businessId: selectedBusinessId,
          rating,
          comment,
        });
      }

      alert("Your review has been saved.");
      setShowRatingPopup(false);
      setSelectedBusinessId(null);
      setEditingReviewId(null);
      setInitialRating(null);
      setInitialComment("");
      loadMyReviews();
    } catch (err) {
      console.error("Submit review error:", err);
      alert("Failed to submit review.");
    }
  };

  /* ---------- Delete Review ---------- */

  const deleteReview = async () => {
    if (!editingReviewId) return;

    try {
      await api.delete(`/reviews/${editingReviewId}`);
      alert("Your review has been deleted.");
      setShowRatingPopup(false);
      setSelectedBusinessId(null);
      setEditingReviewId(null);
      setInitialRating(null);
      setInitialComment("");
      loadMyReviews();
    } catch (err) {
      console.error("Delete review error:", err);
      alert("Failed to delete review.");
    }
  };

  /* ---------- Loading State ---------- */

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

  /* ---------- Render ---------- */

  return (
    <PageWrapper>
      <TabBar type="customer" />

      <ContentWrapper>
        {/* UPCOMING */}
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
                status={booking.status}
                onCancel={() => handleCancelClick(booking.id)}
                onReschedule={() => handleRescheduleClick(booking)}
                onViewReceipt={() => navigate(`/book/receipt/${booking.id}`)}
              />
            ))}
          </TilesContainer>
        </Section>

        {/* PAST */}
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
                hasReview={!!myReviews[booking.businessId]} // ⭐ controls label
                onViewReceipt={() => navigate(`/book/receipt/${booking.id}`)}
                onLeaveRating={() => handleRatingClick(booking.businessId)}
              />
            ))}
          </TilesContainer>
        </Section>
      </ContentWrapper>

      {/* CANCEL POPUP */}
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

      {/* ⭐ RATING POPUP */}
      {showRatingPopup && selectedBusinessId && (
        <RatingPopup
          businessId={selectedBusinessId}
          initialRating={initialRating || undefined}
          initialComment={initialComment}
          onClose={() => {
            setShowRatingPopup(false);
            setEditingReviewId(null);
          }}
          onSubmit={submitReview}
          onDelete={editingReviewId ? deleteReview : undefined}
        />
      )}
    </PageWrapper>
  );
};

export default BookingsPage;
