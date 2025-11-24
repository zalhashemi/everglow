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

const EmptyText = styled.p`
  font-size: 15px;
  color: #555;
`;

const ErrorText = styled.p`
  font-size: 14px;
  color: red;
`;

/* ===== Edit Popup ===== */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
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
`;

const PopupTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #27374d;
`;

const PopupSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #555;
`;

const PopupRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #27374d;
  font-weight: 600;
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
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
`;

const PopupButtonsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 6px;
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
  background: ${(p) =>
    p.variant === "primary" ? "#4a5174" : "#ffffff"};
  color: ${(p) =>
    p.variant === "primary" ? "#ffffff" : "#27374d"};
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
`;

const PopupError = styled.p`
  margin: 0;
  font-size: 13px;
  color: red;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Edit popup state
  const [editBooking, setEditBooking] = useState<BookingCard | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [availableStaff, setAvailableStaff] = useState<AvailableStaff[]>([]);
  const [staffIndex, setStaffIndex] = useState<number | null>(null);
  const [loadingStaff, setLoadingStaff] = useState(false);

  /* ---------------- Load bookings (shared helper) ---------------- */
  const loadBookings = useCallback(
    async (withSpinner: boolean = true) => {
      try {
        if (withSpinner) setLoading(true);
        setError(null);

        const res = await api.get<BookingApi[]>("/bookings/me");
        const data = res.data || [];

        const now = new Date();

        const upcomingTmp: BookingCard[] = [];
        const pastTmp: BookingCard[] = [];

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
          };

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
      } catch (err: any) {
        console.error("Error loading bookings", err);
        setError(
          err?.response?.data?.message || "Failed to load bookings."
        );
      } finally {
        if (withSpinner) setLoading(false);
      }
    },
    []
  );

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

      // ✅ Re-sync from server instead of manually editing arrays
      await loadBookings(false);
    } catch (err: any) {
      console.error("Error cancelling booking", err);
      setError(
        err?.response?.data?.message || "Failed to cancel booking."
      );
    } finally {
      setActionLoadingId(null);
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
        setEditError("No staff available for this time. Try another time.");
      }
    } catch (err: any) {
      console.error("Error loading staff", err);
      setAvailableStaff([]);
      setStaffIndex(null);
      setEditError(
        err?.response?.data?.message || "Failed to load staff availability."
      );
    } finally {
      setLoadingStaff(false);
    }
  };

  // Open edit popup; keep original local time & load staff
  const handleOpenEdit = (booking: BookingCard) => {
    try {
      const d = new Date(booking.startTime);
      if (isNaN(d.getTime())) {
        throw new Error("Invalid date");
      }

      // Use local time components (no UTC shift)
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

      // load staff for that date/time
      fetchAvailableStaff(booking, dateStr, timeStr);
    } catch {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const min = String(now.getMinutes()).padStart(2, "0");

      const dateStr = `${yyyy}-${mm}-${dd}`;
      const timeStr = `${hh}:${min}`;

      setEditDate(dateStr);
      setEditTime(timeStr);
      setEditError(null);
      setEditBooking(booking);

      fetchAvailableStaff(booking, dateStr, timeStr);
    }
  };

  const handleCloseEdit = () => {
    if (savingEdit) return;
    setEditBooking(null);
    setEditDate("");
    setEditTime("");
    setEditError(null);
    setAvailableStaff([]);
    setStaffIndex(null);
  };

  const handleChangeDate = (value: string) => {
    setEditDate(value);
    if (editBooking && value && editTime) {
      fetchAvailableStaff(editBooking, value, editTime);
    }
  };

  const handleChangeTime = (value: string) => {
    setEditTime(value);
    if (editBooking && editDate && value) {
      fetchAvailableStaff(editBooking, editDate, value);
    }
  };

  const handleSaveEdit = async () => {
    if (!editBooking) return;
    if (!editDate || !editTime) {
      setEditError("Please select both date and time.");
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

      // ✅ Re-sync from server so business + customer see the same thing
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
                onLeaveRating={() => alert("Add rating coming soon")}
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
            </PopupSubtitle>

            <PopupRow>
              <Label>New date &amp; time</Label>
              <InputRow>
                <Input
                  type="date"
                  value={editDate}
                  onChange={(e) => handleChangeDate(e.target.value)}
                />
                <Input
                  type="time"
                  value={editTime}
                  onChange={(e) => handleChangeTime(e.target.value)}
                />
              </InputRow>
            </PopupRow>

            <PopupRow>
              <Label>Staff</Label>
              {loadingStaff && (
                <PopupSubtitle>Loading available staff...</PopupSubtitle>
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
              {!loadingStaff && availableStaff.length === 0 && (
                <PopupSubtitle>
                  No staff available for this time. Try changing the time.
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
    </PageWrapper>
  );
};

export default BookingsPage;
