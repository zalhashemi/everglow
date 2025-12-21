import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import BookingTile from "../../components/common/BookingTile";
import AlertPopup from "../../components/common/AlertPopup";
import api from "../../utils/api";
import errorImage from "../../images/errorLoading.png";
import { API_BASE } from "../../utils/config";



//styled components
const PageWrapper = styled.div`
  background-color: #faf6ea;
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
  gap: 60px;

  @media (max-width: 1024px) {
    padding: 32px 0;
    gap: 48px;
  }

  @media (max-width: 768px) {
    padding: 24px 0;
    gap: 40px;
  }

  @media (max-width: 480px) {
    padding: 20px 0;
    gap: 32px;
  }
`;

const Section = styled.div`
  width: 100%;
  padding: 0 3%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 4%;
  }

  @media (max-width: 480px) {
    padding: 0 5%;
  }
`;

const SectionTitle = styled.h2`
  font-family: "Inter", sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #4A5074;
  margin-bottom: 25px;
  width: 1200px;
  max-width: 100%;
  text-align: left;

  @media (max-width: 1024px) {
    font-size: 32px;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 18px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 16px;
  }
`;

const TilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #555;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const ErrorText = styled.p`
  font-size: 14px;
  color: red;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const StarRatingContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const Star = styled.button<{ filled: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 32px;
  color: ${(p) => (p.filled ? "#FFD700" : "#E0E0E0")};
  transition: color 0.2s ease, transform 0.1s ease;
  padding: 0;
  line-height: 1;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const RescheduleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormLabel = styled.label`
  font-size: 13px;
  color: #27374d;
  font-weight: 600;
`;

const FormInputRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const FormInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d0d4e4;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #4a5174;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d0d4e4;
  font-size: 14px;
  outline: none;
  background: #ffffff;
  &:focus {
    border-color: #4a5174;
  }
`;

const FormSubtext = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
`;

const ReviewTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d0d4e4;
  font-size: 14px;
  outline: none;
  resize: vertical;
  &:focus {
    border-color: #4a5174;
  }
`;

//types
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

type BookingApiBusiness = {
  _id?: string;
  businessName: string;
  address?: string;
  city?: string;
  imageUrl?: string;        
  profileImageUrl?: string;   
};


type BookingApiService = {
  name: string;
  durationMinutes: number;
  priceBHD: number;
};

type BookingApi = {
  _id: string;
  business: BookingApiBusiness;
  services: BookingApiService[];
  startTime: string;
  status: BookingStatus;
  staffName?: string | null;
};

type BookingCard = {
  id: string;
  businessId: string;
  startTime: string; 
  date: string; 
  image: string;
  salonName: string;
  location: string;
  services: string[];
  status: BookingStatus;
  totalDuration?: number;
};

type AvailableStaff = {
  index: number; 
  fullName: string;
  role: string;
};

//component
const BookingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState<BookingCard[]>([]);
  const [past, setPast] = useState<BookingCard[]>([]);
  const [cancelled, setCancelled] = useState<BookingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editBooking, setEditBooking] = useState<BookingCard | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [availableStaff, setAvailableStaff] = useState<AvailableStaff[]>([]);
  const [staffIndex, setStaffIndex] = useState<number | null>(null);
  const [loadingStaff, setLoadingStaff] = useState(false);

  const [reviewBooking, setReviewBooking] = useState<BookingCard | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [alertPopup, setAlertPopup] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [cancelBooking, setCancelBooking] = useState<BookingCard | null>(null);

  const loadBookings = useCallback(async (withSpinner: boolean = true) => {
    try {
      if (withSpinner) setLoading(true);
      setError(null);

      const res = await api.get<BookingApi[]>("/bookings/me");
      const data = res.data || [];

      const now = new Date();

      const upcomingTmp: BookingCard[] = [];
      const pastTmp: BookingCard[] = [];
      const cancelledTmp: BookingCard[] = [];

      data.forEach((b) => {
        const start = new Date(b.startTime);
        const isFuture = start >= now;

        const formattedDate = start.toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });

        const totalDuration = (b.services || []).reduce(
          (sum, service) => sum + (service.durationMinutes || 0),
          0
        );

        const card: BookingCard = {
          id: b._id,
          businessId: b.business?._id || "",
          startTime: b.startTime,
          date: formattedDate,
          image: b.business?.imageUrl
  ? `${API_BASE}${b.business.imageUrl}`
  : b.business?.profileImageUrl
  ? `${API_BASE}${b.business.profileImageUrl}`
  : errorImage,

          salonName: b.business?.businessName || "Unknown Salon",
          location: `${b.business?.city || ""}${
            b.business?.city && b.business?.address ? " · " : ""
          }${b.business?.address || ""}`,
          services: (b.services || []).map((s) => s.name),
          status: b.status,
          totalDuration,
        };

        if (b.status === "cancelled") {
          cancelledTmp.push(card);
          return;
        }

        const isUpcoming =
          isFuture && (b.status === "pending" || b.status === "confirmed");

        if (isUpcoming) {
          upcomingTmp.push(card);
        } else {
          pastTmp.push(card);
        }
      });

      setUpcoming(upcomingTmp);
      setPast(pastTmp);
      setCancelled(cancelledTmp);
    } catch (err: any) {
      console.error("Error loading bookings", err);
      setError(err?.response?.data?.message || "Failed to load bookings.");
    } finally {
      if (withSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings(true);

    const id = setInterval(() => {
      loadBookings(false);
    }, 10000);

    return () => clearInterval(id);
  }, [loadBookings]);


  const handleCancel = (booking: BookingCard) => {
    setCancelBooking(booking);
  };

  const confirmCancel = async () => {
    if (!cancelBooking) return;

    try {
      setError(null);
      await api.patch(`/bookings/${cancelBooking.id}/cancel`);
      await loadBookings(false);
      setCancelBooking(null); 
      setAlertPopup({
        type: "success",
        message: "Booking cancelled successfully.",
      });
    } catch (err: any) {
      console.error("Error cancelling booking", err);
      setCancelBooking(null); 
      setAlertPopup({
        type: "error",
        message: err?.response?.data?.message || "Failed to cancel booking.",
      });
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  const isToday = (dateString: string) => {
    return dateString === getTodayDate();
  };

  const getFilteredSlots = (slots: string[], dateStr: string): string[] => {
    if (!isToday(dateStr)) {
      return slots;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return slots.filter((slot) => {
      const [hourStr, minuteStr] = slot.split(":");
      const slotHour = parseInt(hourStr, 10);
      const slotMinute = parseInt(minuteStr, 10);

      if (slotHour > currentHour) return true;
      if (slotHour === currentHour && slotMinute > currentMinute) return true;
      return false;
    });
  };

  const fetchAvailableSlots = async (booking: BookingCard, dateStr: string) => {
    if (!booking.businessId || !dateStr) {
      setAvailableSlots([]);
      setEditTime("");
      return;
    }

    try {
      setLoadingSlots(true);
      setEditError(null);

      const totalDuration = booking.totalDuration || 60;

      const res = await api.get<string[]>(
        `/bookings/available-slots/${booking.businessId}`,
        {
          params: {
            date: dateStr,
            duration: totalDuration,
          },
        }
      );

      const rawSlots = res.data || [];
      const filteredSlots = getFilteredSlots(rawSlots, dateStr);

      setAvailableSlots(filteredSlots);
      setEditTime("");
      setAvailableStaff([]);
      setStaffIndex(null);

      if (filteredSlots.length === 0) {
        setEditError(
          "No time slots available for this date. The business may be closed or fully booked."
        );
      }
    } catch (err: any) {
      console.error("Error loading slots", err);
      setAvailableSlots([]);
      setEditTime("");
      setEditError(
        err?.response?.data?.message ||
          "Failed to load available time slots. The business may be closed on this date."
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchAvailableStaff = async (
    booking: BookingCard,
    dateStr: string,
    timeStr: string
  ) => {
    if (!booking.businessId || !dateStr || !timeStr) {
      setAvailableStaff([]);
      setStaffIndex(null);
      return;
    }

    try {
      setLoadingStaff(true);
      setEditError(null);

      const rawStart = `${dateStr}T${timeStr}:00`;

      const start = new Date(rawStart);
      if (isNaN(start.getTime())) {
        setAvailableStaff([]);
        setStaffIndex(null);
        setLoadingStaff(false);
        return;
      }

      const res = await api.get("/bookings/available-staff", {
        params: {
          businessId: booking.businessId,
          startTime: rawStart, 
        },
      });

      const staff: AvailableStaff[] = res.data?.staff || [];
      setAvailableStaff(staff);

      if (staff.length > 0) {
        setStaffIndex(staff[0].index);
      } else {
        setStaffIndex(null);
        setEditError(
          "No staff available for this time. They may be off-duty or fully booked. Try another time slot."
        );
      }
    } catch (err: any) {
      console.error("Error loading staff", err);
      setAvailableStaff([]);
      setStaffIndex(null);
      setEditError(
        err?.response?.data?.message ||
          "Failed to load staff availability. Please try another time."
      );
    } finally {
      setLoadingStaff(false);
    }
  };

  // Open edit popup
  const handleOpenEdit = (booking: BookingCard) => {
    try {
      const d = new Date(booking.startTime);
      if (isNaN(d.getTime())) {
        throw new Error("Invalid date");
      }

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");

      const dateStr = `${yyyy}-${mm}-${dd}`;
      const timeStr = `${hh}:${min}`;

      setEditDate(dateStr);
      setEditTime(timeStr);
      setEditError(null);
      setEditBooking(booking);

      fetchAvailableSlots(booking, dateStr);
    } catch {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");

      const dateStr = `${yyyy}-${mm}-${dd}`;

      setEditDate(dateStr);
      setEditTime("");
      setEditError(null);
      setEditBooking(booking);

      fetchAvailableSlots(booking, dateStr);
    }
  };

  const handleCloseEdit = () => {
    if (savingEdit) return;
    setEditBooking(null);
    setEditDate("");
    setEditTime("");
    setAvailableSlots([]);
    setEditError(null);
    setAvailableStaff([]);
    setStaffIndex(null);
  };

  const handleChangeDate = (value: string) => {
    setEditDate(value);
    setEditTime("");
    setAvailableStaff([]);
    setStaffIndex(null);

    if (editBooking && value) {
      fetchAvailableSlots(editBooking, value);
    }
  };

  const handleChangeTime = (value: string) => {
    setEditTime(value);
    if (editBooking && editDate && value) {
      fetchAvailableStaff(editBooking, editDate, value);
    }
  };

  const isValidDateTime = (dateStr: string, timeStr: string): boolean => {
    if (!dateStr || !timeStr) return false;

    const selectedDateTime = new Date(`${dateStr}T${timeStr}:00`);
    const now = new Date();

    return selectedDateTime > now;
  };

  const handleSaveEdit = async () => {
    if (!editBooking) return;
    if (!editDate || !editTime) {
      setEditError("Please select both date and time.");
      return;
    }

    if (editDate < getTodayDate()) {
      setEditError("Cannot reschedule to a past date.");
      return;
    }

    if (!isValidDateTime(editDate, editTime)) {
      setEditError(
        "Cannot reschedule to a past time. Please select a future date/time."
      );
      return;
    }

    if (staffIndex === null) {
      setEditError("Please pick a staff member (or change time).");
      return;
    }

    try {
      setSavingEdit(true);
      setEditError(null);

      const newStart = new Date(`${editDate}T${editTime}:00`);
      if (isNaN(newStart.getTime())) {
        setEditError("Invalid date/time.");
        setSavingEdit(false);
        return;
      }

      const newStartISO = newStart.toISOString();

      await api.patch(`/bookings/${editBooking.id}/reschedule`, {
        startTime: newStartISO,
        staffIndex,
      });

      await loadBookings(false);
      handleCloseEdit();
      setAlertPopup({
        type: "success",
        message: "Booking rescheduled successfully.",
      });
    } catch (err: any) {
      console.error("Error rescheduling booking", err);
      setEditError(
        err?.response?.data?.message ||
          "Failed to reschedule booking. Please try again."
      );
    } finally {
      setSavingEdit(false);
    }
  };



  const handleOpenReview = (booking: BookingCard) => {
    setReviewBooking(booking);
    setReviewRating(5);
    setReviewComment("");
    setReviewError(null);
  };

  const handleCloseReview = () => {
    if (reviewSaving) return;
    setReviewBooking(null);
    setReviewRating(5);
    setReviewComment("");
    setReviewError(null);
  };

  const handleStarClick = (rating: number) => {
    setReviewRating(rating);
  };

  const handleSubmitReview = async () => {
    if (!reviewBooking) return;

    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      setReviewError("Please select a rating between 1 and 5.");
      return;
    }

    try {
      setReviewSaving(true);
      setReviewError(null);

      await api.post("/reviews", {
        businessId: reviewBooking.businessId,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      });

      handleCloseReview();
      setAlertPopup({
        type: "success",
        message: "Review submitted successfully. Thank you!",
      });
    } catch (err: any) {
      console.error("Error submitting review", err);
      setReviewError(
        err?.response?.data?.message || "Failed to submit review."
      );
    } finally {
      setReviewSaving(false);
    }
  };


  return (
    <PageWrapper>
      <TabBar type="customer" />

      <ContentWrapper>
        <Section>
          <SectionTitle>Upcoming Bookings</SectionTitle>

          {loading && <EmptyText>Loading your bookings...</EmptyText>}
          {error && <ErrorText>{error}</ErrorText>}
          {!loading && !error && upcoming.length === 0 && (
            <EmptyText>No upcoming bookings found.</EmptyText>
          )}

          <TilesContainer>
            {upcoming.map((b) => (
              <BookingTile
                key={b.id}
                id={b.id}
                date={b.date}
                image={b.image}
                salonName={b.salonName}
                location={b.location}
                services={b.services}
                status={b.status}
                onCancel={() => handleCancel(b)}
                onViewReceipt={() => navigate(`/bookings/${b.id}`)}
                onReschedule={() => handleOpenEdit(b)}
              />
            ))}
          </TilesContainer>
        </Section>

        <Section>
          <SectionTitle>Past Bookings</SectionTitle>

          {!loading && !error && past.length === 0 && (
            <EmptyText>No past bookings yet.</EmptyText>
          )}

          <TilesContainer>
            {past.map((b) => (
              <BookingTile
                key={b.id}
                id={b.id}
                date={b.date}
                image={b.image}
                salonName={b.salonName}
                location={b.location}
                services={b.services}
                status={b.status}
                onViewReceipt={() => navigate(`/bookings/${b.id}`)}
                onLeaveRating={() => handleOpenReview(b)}
              />
            ))}
          </TilesContainer>
        </Section>

        <Section>
          <SectionTitle>Cancelled Bookings</SectionTitle>

          {!loading && !error && cancelled.length === 0 && (
            <EmptyText>No cancelled bookings.</EmptyText>
          )}

          <TilesContainer>
            {cancelled.map((b) => (
              <BookingTile
                key={b.id}
                id={b.id}
                date={b.date}
                image={b.image}
                salonName={b.salonName}
                location={b.location}
                services={b.services}
                status={b.status}
              />
            ))}
          </TilesContainer>
        </Section>
      </ContentWrapper>

      {cancelBooking && (
        <AlertPopup
          type="error"
          title="Cancel Booking"
          message={`Are you sure you want to cancel your booking at ${cancelBooking.salonName}?`}
          onConfirm={confirmCancel}
          onClose={() => setCancelBooking(null)}
          confirmLabel="Yes, Cancel"
          cancelLabel="No, Keep It"
        />
      )}

      {editBooking && (
        <AlertPopup
          type="success"
          title="Edit Booking"
          message={
            <>
              <FormSubtext>
                {editBooking.salonName} — {editBooking.services.join(", ")}
                {editBooking.totalDuration && (
                  <span> ({editBooking.totalDuration} min)</span>
                )}
              </FormSubtext>

              <RescheduleContent>
                <FormRow>
                  <FormLabel>New date &amp; time</FormLabel>
                  <FormInputRow>
                    <FormInput
                      type="date"
                      value={editDate}
                      min={getTodayDate()}
                      onChange={(e) => handleChangeDate(e.target.value)}
                    />
                    <FormSelect
                      value={editTime}
                      onChange={(e) => handleChangeTime(e.target.value)}
                      disabled={loadingSlots || availableSlots.length === 0}
                    >
                      <option value="">
                        {loadingSlots
                          ? "Loading available times..."
                          : availableSlots.length === 0
                          ? "No slots available"
                          : "Select time"}
                      </option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </FormSelect>
                  </FormInputRow>
                </FormRow>

                <FormRow>
                  <FormLabel>Staff Member</FormLabel>
                  {loadingStaff && (
                    <FormSubtext>Checking staff availability...</FormSubtext>
                  )}
                  {!loadingStaff && availableStaff.length > 0 && (
                    <FormSelect
                      value={staffIndex !== null ? staffIndex : ""}
                      onChange={(e) => setStaffIndex(Number(e.target.value))}
                    >
                      {availableStaff.map((s) => (
                        <option key={s.index} value={s.index}>
                          {s.fullName}
                          {s.role ? ` — ${s.role}` : ""}
                        </option>
                      ))}
                    </FormSelect>
                  )}
                  {!loadingStaff && availableStaff.length === 0 && !editTime && (
                    <FormSubtext>
                      Select a time first to see available staff.
                    </FormSubtext>
                  )}
                  {!loadingStaff && availableStaff.length === 0 && editTime && (
                    <FormSubtext>
                      No staff available for this time. Try selecting a different
                      time slot.
                    </FormSubtext>
                  )}
                </FormRow>

                {editError && (
                  <FormSubtext style={{ color: "red" }}>{editError}</FormSubtext>
                )}
              </RescheduleContent>
            </>
          }
          onConfirm={handleSaveEdit}
          onClose={handleCloseEdit}
          confirmLabel={savingEdit ? "Saving..." : "Save"}
          cancelLabel="Cancel"
          confirmDisabled={
            savingEdit ||
            loadingSlots ||
            loadingStaff ||
            !editDate ||
            !editTime ||
            staffIndex === null
          }
        />
      )}

      {reviewBooking && (
        <AlertPopup
          type="success"
          title="Rate Your Visit"
          message={
            <>
              <FormSubtext>
                {reviewBooking.salonName} — {reviewBooking.services.join(", ")}
              </FormSubtext>

              <ReviewContent>
                <FormRow>
                  <FormLabel>Rating</FormLabel>
                  <StarRatingContainer>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        filled={star <= reviewRating}
                        onClick={() => handleStarClick(star)}
                        type="button"
                      >
                        {star <= reviewRating ? "★" : "☆"}
                      </Star>
                    ))}
                  </StarRatingContainer>
                </FormRow>

                <FormRow>
                  <FormLabel>Comment (optional)</FormLabel>
                  <ReviewTextArea
                    placeholder="Tell others about your experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </FormRow>

                {reviewError && (
                  <FormSubtext style={{ color: "red" }}>{reviewError}</FormSubtext>
                )}
              </ReviewContent>
            </>
          }
          onConfirm={handleSubmitReview}
          onClose={handleCloseReview}
          confirmLabel={reviewSaving ? "Submitting..." : "Submit Review"}
          cancelLabel="Cancel"
          confirmDisabled={reviewSaving || !reviewRating}
        />
      )}

      {alertPopup && (
        <AlertPopup
          type={alertPopup.type}
          message={alertPopup.message}
          onClose={() => setAlertPopup(null)}
        />
      )}
    </PageWrapper>
  );
};

export default BookingsPage;
