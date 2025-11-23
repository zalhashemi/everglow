import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TabBar from "../../components/common/TabBar";
import Button from "../../components/common/Button";
import api from "../../utils/api";
import AlertPopup from "../../components/common/AlertPopup"; // ✅ NEW

type CalendarValue = Date | Date[] | [Date | null, Date | null] | null;

/* ---------------------- Styled Components ---------------------- */
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #fFAF6EA;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;

  .react-calendar {
    width: 100%;
    border: none;
    font-family: "Inter", sans-serif;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    margin-bottom: 12px;
    padding: 6px 12px;
  }

  .react-calendar__navigation button {
    color: #0c1b33;
    min-width: 28px;
    background: none;
    font-size: 18px;
    border: none;
    cursor: pointer;
    transition: 0.2s;
  }

  .react-calendar__navigation button:hover {
    color: #4a5174;
  }

  .react-calendar__tile {
    border-radius: 12px;
    height: 70px;
    padding: 8px;
    transition: 0.3s;
  }

  .react-calendar__tile--active {
    background: #4a5174;
    color: #fff;
  }

  .react-calendar__tile--now {
    background: #fff6c3;
    border: 1px solid #d2c66e;
  }

  .booking-count {
    display: block;
    font-size: 11px;
    color: #4a5174;
    margin-top: 4px;
  }
`;

const Layout = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 60px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CalendarContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 700px;
`;

const Sidebar = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 340px;
  height: fit-content;
  align-self: flex-start;
`;

const SidebarTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0c1b33;
  margin-bottom: 16px;
`;

const BookingCard = styled.div<{ status: string }>`
  background: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  border-left: 5px solid
    ${(p) =>
      p.status === "confirmed" || p.status === "completed"
        ? "#4CAF50"
        : p.status === "pending"
        ? "#FFD700"
        : "#E57373"};
  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
    background-color: #fff;
  }

  h4 {
    color: #0c1b33;
    margin-bottom: 4px;
  }

  .status {
    font-weight: 600;
    font-size: 13px;
    color: ${(p) =>
      p.status === "confirmed" || p.status === "completed"
        ? "#4CAF50"
        : p.status === "pending"
        ? "#FFD700"
        : "#E57373"};
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 16px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const CancelButton = styled(Button)`
  background: #ccc;
  color: #000;
`;

const SaveButton = styled(Button)`
  background: #4a5174;
  color: #fff;
`;

/* ---------------------- Types ---------------------- */

type RawBookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

type RawBooking = {
  _id: string;
  startTime: string;
  endTime: string;
  status: RawBookingStatus;
  notes?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
  };
  services?: {
    _id: string;
    name: string;
    durationMinutes?: number;
  }[];
};

type UiBooking = {
  id: string;
  dateKey: string;
  timeLabel: string;
  client: string;
  service: string;
  status: RawBookingStatus;
  notes?: string;
};

/* ---------------------- Helpers ---------------------- */

const formatDateKey = (d: Date) =>
  d.toLocaleDateString("en-CA");

const statusLabel: Record<RawBookingStatus, string> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  cancelled: "CANCELLED",
  completed: "COMPLETED",
};

/* ================================================================
                            MAIN COMPONENT
   ================================================================ */

const BusinessBookings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<UiBooking | null>(null);

  const [bookings, setBookings] = useState<UiBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [popup, setPopup] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  /* ------- Load bookings from API ------- */
  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get<RawBooking[]>("/bookings/business");

      const mapped: UiBooking[] = res.data.map((b) => {
        const start = new Date(b.startTime);
        const dateKey = formatDateKey(start);
        const timeLabel = start.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });

        const clientName =
          (b.customer
            ? `${b.customer.firstName || ""} ${b.customer.lastName || ""}`.trim()
            : "") || "Client";

        const services = Array.isArray(b.services) ? b.services : [];
        const serviceLabel =
          services.length > 0
            ? services.map((s) => s.name).join(", ")
            : "Services";

        return {
          id: b._id,
          dateKey,
          timeLabel,
          client: clientName,
          service: serviceLabel,
          status: b.status,
          notes: b.notes,
        };
      });

      setBookings(mapped);
    } catch (err: any) {
      setPopup({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Failed to load bookings for business.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* ------- Calendar handler ------- */
  const handleDateChange = (value: CalendarValue) => {
    if (!value) return;
    if (value instanceof Date) setSelectedDate(value);
    else if (Array.isArray(value)) {
      const d = value.find((x) => x instanceof Date) as Date | undefined;
      if (d) setSelectedDate(d);
    }
  };

  const selectedKey = formatDateKey(selectedDate);
  const selectedDayBookings = bookings.filter((b) => b.dateKey === selectedKey);

  /* ------- Edit / Cancel Modal ------- */

  const handleEditClick = (booking: UiBooking) => {
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    if (!editingBooking) return;

    try {
      await api.patch(`/bookings/business/${editingBooking.id}/status`, {
        status: editingBooking.status,
      });

      setPopup({
        type: "success",
        message: "Booking updated successfully!",
      });

      setShowModal(false);
      setEditingBooking(null);
      loadBookings();
    } catch (err: any) {
      setPopup({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Failed to update booking status.",
      });
    }
  };

  const handleCancelBooking = async () => {
    if (!editingBooking) return;

    try {
      await api.patch(`/bookings/business/${editingBooking.id}/status`, {
        status: "cancelled",
      });

      setPopup({
        type: "success",
        message: "Booking cancelled successfully!",
      });

      setShowModal(false);
      setEditingBooking(null);
      loadBookings();
    } catch (err: any) {
      setPopup({
        type: "error",
        message:
          err?.response?.data?.message || "Failed to cancel booking.",
      });
    }
  };

  /* ------- Render ------- */

  return (
    <PageContainer>
      <TabBar type="business" />

      <Layout>
        {/* LEFT: Calendar */}
        <CalendarContainer>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#0C1B33",
              marginBottom: "12px",
            }}
          >
            Booking Calendar
          </h2>

          {loading ? (
            <p>Loading bookings…</p>
          ) : (
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={({ date, view }: any) => {
                if (view === "month") {
                  const key = formatDateKey(date);
                  const count = bookings.filter((b) => b.dateKey === key).length;
                  return count > 0 ? (
                    <span className="booking-count">
                      {count} booking{count > 1 ? "s" : ""}
                    </span>
                  ) : null;
                }
                return null;
              }}
            />
          )}
        </CalendarContainer>

        {/* RIGHT: List of Bookings */}
        <Sidebar>
          <SidebarTitle>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </SidebarTitle>

          {loading ? (
            <p>Loading…</p>
          ) : selectedDayBookings.length > 0 ? (
            selectedDayBookings.map((b) => (
              <BookingCard key={b.id} status={b.status}>
                <h4>{b.timeLabel}</h4>
                <p>
                  <strong>{b.client}</strong>
                </p>
                <p>{b.service}</p>
                {b.notes && <p>📝 {b.notes}</p>}
                <p className="status">{statusLabel[b.status]}</p>

                <div style={{ textAlign: "right", marginTop: "10px" }}>
                  <Button
                    variant="primary"
                    style={{
                      width: "auto",
                      padding: "6px 14px",
                      fontSize: "14px",
                      borderRadius: "6px",
                      backgroundColor: "#4A5174",
                      color: "#fff",
                    }}
                    onClick={() => handleEditClick(b)}
                  >
                    Edit / Cancel
                  </Button>
                </div>
              </BookingCard>
            ))
          ) : (
            <p>No bookings for this date.</p>
          )}
        </Sidebar>
      </Layout>

      {/* MODAL */}
      {showModal && editingBooking && (
        <Overlay>
          <Modal>
            <h3 style={{ color: "#0C1B33" }}>Edit Booking</h3>

            <label>Client Name</label>
            <Input value={editingBooking.client} disabled />

            <label>Service(s)</label>
            <Input value={editingBooking.service} disabled />

            <label>Time</label>
            <Input value={editingBooking.timeLabel} disabled />

            <label>Status</label>
            <Select
              value={editingBooking.status}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  status: e.target.value as RawBookingStatus,
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </Select>

            <ModalButtons>
              <CancelButton onClick={handleCancelBooking}>
                Cancel Booking
              </CancelButton>
              <SaveButton onClick={handleSaveChanges}>
                Save Changes
              </SaveButton>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}

      {/* POPUP */}
      {popup && (
        <AlertPopup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    </PageContainer>
  );
};

export default BusinessBookings;
