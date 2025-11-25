// src/pages/customer/BookingsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import BookingTile from "../../components/common/BookingTile";
import api from "../../utils/api";
import errorImage from "../../images/errorLoading.png";

/* ============================================================
   Styled Components
============================================================ */
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
  color: #27374d;
  margin-bottom: 25px;

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

/* ===== Shared Popup Styles ===== */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const PopupBox = styled.div`
  width: 420px;
  max-width: 90%;
  background: #ffffff;
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 24px 20px;
    gap: 16px;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
    padding: 20px 16px;
    gap: 14px;
    border-radius: 12px;
  }
`;

const PopupTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #27374d;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const PopupSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #555;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const PopupRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: #27374d;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d0d4e4;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #4a5174;
  }

  @media (max-width: 768px) {
    padding: 9px 11px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 14px;
    width: 100%;
  }
`;

const Select = styled.select`
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

  @media (max-width: 768px) {
    padding: 9px 11px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 14px;
  }
`;

const TextArea = styled.textarea`
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

  @media (max-width: 768px) {
    padding: 9px 11px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 14px;
  }
`;

const PopupButtonsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 6px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 8px;
    margin-top: 4px;
  }
`;

const PopupButton = styled.button<{ variant?: "primary" | "ghost" }>`
  min-width: 90px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: ${(p) =>
    p.variant === "primary" ? "none" : "1px solid #d0d4e4"};
  background: ${(p) => (p.variant === "primary" ? "#4a5174" : "#ffffff")};
  color: ${(p) => (p.variant === "primary" ? "#ffffff" : "#27374d")};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    min-width: 80px;
    padding: 8px 12px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
    padding: 10px 14px;
    font-size: 14px;
  }
`;

const PopupError = styled.p`
  margin: 0;
  font-size: 13px;
  color: red;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

/* ============================================================
   Types
============================================================ */
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

type BookingApiBusiness = {
  _id?: string;
  businessName: string;
  address?: string;
  city?: string;
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
  startTime: string; // ISO
  date: string; // formatted for display
  image: string;
  salonName: string;
  location: string;
  services: string[];
  status: BookingStatus;
  totalDuration?: number;
};

type AvailableStaff = {
  index: number; // staffIndex
  fullName: string;
  role: string;
};

/* ============================================================
   Component
============================================================ */
const BookingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState<BookingCard[]>([]);
  const [past, setPast] = useState<BookingCard[]>([]);
  const [cancelled, setCancelled] = useState<BookingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Edit popup state
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

  // Review popup state
  const [reviewBooking, setReviewBooking] = useState<BookingCard | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  /* ---------------- Load bookings (shared helper) ---------------- */
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
          image: b.business?.profileImageUrl || errorImage,
          salonName: b.business?.businessName || "Unknown Salon",
          location: `${b.business?.city || ""}${
            b.business?.city && b.business?.address ? " · " : ""
          }${b.business?.address || ""}`,
          services: (b.services || []).map((s) => s.name),
          status: b.status,
          totalDuration,
        };

        // Separate cancelled bookings into their own list
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
    // initial load
    loadBookings(true);

    // 🔁 Poll every 10 seconds so business changes reflect on customer side
    const id = setInterval(() => {
      loadBookings(false);
    }, 10000);

    return () => clearInterval(id);
  }, [loadBookings]);

  /* ============================================================
     Handlers: Cancel & Reschedule
  ============================================================ */

  const handleCancel = async (booking: BookingCard) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setActionLoadingId(booking.id);
      setError(null);

      await api.patch(`/bookings/${booking.id}/cancel`);

      // re-sync from server
      await loadBookings(false);
    } catch (err: any) {
      console.error("Error cancelling booking", err);
      setError(err?.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ✅ Helper to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  // ✅ Check if selected date is today
  const isToday = (dateString: string) => {
    return dateString === getTodayDate();
  };

  // ✅ Filter out past times if date is today
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

  // ✅ Fetch available time slots when date changes
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

      const start = new Date(`${dateStr}T${timeStr}:00`);
      if (isNaN(start.getTime())) {
        setAvailableStaff([]);
        setStaffIndex(null);
        setLoadingStaff(false);
        return;
      }

      const startISO = start.toISOString();

      const res = await api.get("/bookings/available-staff", {
        params: {
          businessId: booking.businessId,
          startTime: startISO,
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

  // ✅ Validate that the selected date/time is not in the past
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

  /* ============================================================
     Review Handlers
  ============================================================ */

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
    } catch (err: any) {
      console.error("Error submitting review", err);
      setReviewError(
        err?.response?.data?.message || "Failed to submit review."
      );
    } finally {
      setReviewSaving(false);
    }
  };

  /* ============================================================
     Render
  ============================================================ */

  return (
    <PageWrapper>
      <TabBar type="customer" />

      <ContentWrapper>
        {/* UPCOMING */}
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

        {/* PAST */}
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
                onLeaveRating={() => handleOpenReview(b)}
                onViewReceipt={() => navigate(`/bookings/${b.id}`)}
              />
            ))}
          </TilesContainer>
        </Section>

        {/* CANCELLED */}
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
                // usually just view receipt, no actions
                onViewReceipt={() => navigate(`/bookings/${b.id}`)}
              />
            ))}
          </TilesContainer>
        </Section>
      </ContentWrapper>

      {/* ===== Reschedule Popup ===== */}
      {editBooking && (
        <Overlay>
          <PopupBox>
            <PopupTitle>Edit Booking</PopupTitle>
            <PopupSubtitle>
              {editBooking.salonName} — {editBooking.services.join(", ")}
              {editBooking.totalDuration && (
                <span style={{ color: "#777", marginLeft: "8px" }}>
                  ({editBooking.totalDuration} min)
                </span>
              )}
            </PopupSubtitle>

            <PopupRow>
              <Label>New date &amp; time</Label>
              <InputRow>
                <Input
                  type="date"
                  value={editDate}
                  min={getTodayDate()}
                  onChange={(e) => handleChangeDate(e.target.value)}
                />
                <Select
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
                </Select>
              </InputRow>
            </PopupRow>

            <PopupRow>
              <Label>Staff Member</Label>
              {loadingStaff && (
                <PopupSubtitle>Checking staff availability...</PopupSubtitle>
              )}
              {!loadingStaff && availableStaff.length > 0 && (
                <Select
                  value={staffIndex !== null ? staffIndex : ""}
                  onChange={(e) => setStaffIndex(Number(e.target.value))}
                >
                  {availableStaff.map((s) => (
                    <option key={s.index} value={s.index}>
                      {s.fullName}
                      {s.role ? ` — ${s.role}` : ""}
                    </option>
                  ))}
                </Select>
              )}
              {!loadingStaff && availableStaff.length === 0 && !editTime && (
                <PopupSubtitle>
                  Select a time first to see available staff.
                </PopupSubtitle>
              )}
              {!loadingStaff && availableStaff.length === 0 && editTime && (
                <PopupSubtitle>
                  No staff available for this time. Try selecting a different
                  time slot.
                </PopupSubtitle>
              )}
            </PopupRow>

            {editError && <PopupError>{editError}</PopupError>}

            <PopupButtonsRow>
              <PopupButton
                variant="ghost"
                onClick={handleCloseEdit}
                disabled={savingEdit}
              >
                Close
              </PopupButton>
              <PopupButton
                variant="primary"
                onClick={handleSaveEdit}
                disabled={
                  savingEdit ||
                  loadingSlots ||
                  loadingStaff ||
                  !editDate ||
                  !editTime ||
                  staffIndex === null
                }
              >
                {savingEdit ? "Saving..." : "Save"}
              </PopupButton>
            </PopupButtonsRow>
          </PopupBox>
        </Overlay>
      )}

      {/* ===== Review Popup ===== */}
      {reviewBooking && (
        <Overlay>
          <PopupBox>
            <PopupTitle>Rate Your Visit</PopupTitle>
            <PopupSubtitle>
              {reviewBooking.salonName} —{" "}
              {reviewBooking.services.join(", ")}
            </PopupSubtitle>

            <PopupRow>
              <Label>Rating</Label>
              <Select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
              >
                <option value={5}>★★★★★ (5)</option>
                <option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option>
                <option value={2}>★★☆☆☆ (2)</option>
                <option value={1}>★☆☆☆☆ (1)</option>
              </Select>
            </PopupRow>

            <PopupRow>
              <Label>Comment (optional)</Label>
              <TextArea
                placeholder="Tell others about your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </PopupRow>

            {reviewError && <PopupError>{reviewError}</PopupError>}

            <PopupButtonsRow>
              <PopupButton
                variant="ghost"
                onClick={handleCloseReview}
                disabled={reviewSaving}
              >
                Close
              </PopupButton>
              <PopupButton
                variant="primary"
                onClick={handleSubmitReview}
                disabled={reviewSaving || !reviewRating}
              >
                {reviewSaving ? "Submitting..." : "Submit Review"}
              </PopupButton>
            </PopupButtonsRow>
          </PopupBox>
        </Overlay>
      )}
    </PageWrapper>
  );
};

export default BookingsPage;
