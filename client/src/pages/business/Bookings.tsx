import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TabBar from "../../components/common/TabBar";
import Button from "../../components/common/Button";

type CalendarValue = Date | Date[] | [Date | null, Date | null] | null;

/* ---------------------- Styled Components ---------------------- */
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f1dede;
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
      p.status === "CONFIRMED"
        ? "#4CAF50"
        : p.status === "PENDING"
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
      p.status === "CONFIRMED"
        ? "#4CAF50"
        : p.status === "PENDING"
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

/* ---------------------- Component ---------------------- */
const BusinessBookings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);

  const bookings = [
    {
      id: "b1",
      date: "2025-10-28",
      time: "10:00 AM",
      client: "Emily Davis",
      service: "Manicure (45 min)",
      status: "PENDING",
      notes: "Prefers gel polish",
    },
    {
      id: "b2",
      date: "2025-10-28",
      time: "2:00 PM",
      client: "James Wilson",
      service: "Massage (90 min)",
      status: "CONFIRMED",
    },
    {
      id: "b3",
      date: "2025-10-29",
      time: "1:00 PM",
      client: "Sofia Lopez",
      service: "Facial (60 min)",
      status: "CONFIRMED",
    },
  ];

  // ✅ Calendar handler updated to accept react-calendar's Value shape (single date, array, or nullable range)
    const handleDateChange = (
      value: CalendarValue,
      _event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      if (!value) return;

      if (value instanceof Date) {
        setSelectedDate(value);
      } else if (Array.isArray(value)) {
        // value may be Date[] or [Date | null, Date | null]; pick the first Date we can find
        const firstDate = (value as Array<Date | null>).find((v) => v instanceof Date) as
          | Date
          | undefined;
        if (firstDate) setSelectedDate(firstDate);
      }
    };

  const selectedDayBookings = bookings.filter(
    (b) =>
      new Date(b.date).toDateString() === selectedDate.toDateString()
  );

  const handleEditClick = (booking: any) => {
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    alert("✅ Booking updated!");
    setShowModal(false);
  };

  const handleCancelBooking = () => {
    alert("❌ Booking cancelled!");
    setShowModal(false);
  };

  const getTileContent = ({ date, view }: any) => {
    if (view === "month") {
      const count = bookings.filter(
        (b) => new Date(b.date).toDateString() === date.toDateString()
      ).length;
      return count > 0 ? (
        <span className="booking-count">
          {count} booking{count > 1 ? "s" : ""}
        </span>
      ) : null;
    }
  };

  return (
    <PageContainer>
      <TabBar type="business" />

      <Layout>
        {/* ----- LEFT: Calendar ----- */}
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

          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={getTileContent}
          />
        </CalendarContainer>

        {/* ----- RIGHT: Bookings ----- */}
        <Sidebar>
          <SidebarTitle>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </SidebarTitle>

          {selectedDayBookings.length > 0 ? (
            selectedDayBookings.map((b) => (
              <BookingCard key={b.id} status={b.status}>
                <h4>{b.time}</h4>
                <p>
                  <strong>{b.client}</strong>
                </p>
                <p>{b.service}</p>
                {b.notes && <p>📝 {b.notes}</p>}
                <p className="status">{b.status}</p>

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

      {/* ----- Modal for Edit / Cancel ----- */}
      {showModal && editingBooking && (
        <Overlay>
          <Modal>
            <h3 style={{ color: "#0C1B33" }}>Edit Booking</h3>

            <label>Client Name</label>
            <Input
              value={editingBooking.client}
              onChange={(e) =>
                setEditingBooking({ ...editingBooking, client: e.target.value })
              }
            />

            <label>Service</label>
            <Input
              value={editingBooking.service}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  service: e.target.value,
                })
              }
            />

            <label>Time</label>
            <Input
              type="time"
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  time: e.target.value,
                })
              }
            />

            <label>Status</label>
            <Select
              value={editingBooking.status}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  status: e.target.value,
                })
              }
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>

            <ModalButtons>
              <CancelButton onClick={handleCancelBooking}>
                Cancel Booking
              </CancelButton>
              <SaveButton onClick={handleSaveChanges}>Save Changes</SaveButton>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}
    </PageContainer>
  );
};

export default BusinessBookings;
