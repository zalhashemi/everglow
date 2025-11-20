// src/pages/customer/SelectDatePage.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import api from "../../utils/api";

type SelectedService = {
  _id: string;
  name: string;
  durationMinutes: number;
  priceBHD: number;
  description?: string;
};

type LocationState = {
  businessId: string;
  businessName: string;
  selectedServices: SelectedService[];
  totalDurationMinutes: number;
  totalPrice: number;
  isReschedule?: boolean;
  bookingId?: string;
};

const SelectDatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // redirect if no state (user hit URL directly)
  useEffect(() => {
    if (!state) {
      navigate("/home");
    }
  }, [state, navigate]);

  if (!state) return null;

  const {
    businessId,
    businessName,
    selectedServices,
    totalDurationMinutes,
    totalPrice,
    isReschedule,
    bookingId,
  } = state;

  const today = new Date().toISOString().split("T")[0];

  const fetchSlots = async (selectedDate: string) => {
    if (!selectedDate) return;
    try {
      setLoadingSlots(true);
      setSlots([]);
      setSelectedTime("");

      const res = await api.get<string[]>(
        `/bookings/available-slots/${businessId}`,
        {
          params: {
            date: selectedDate,
            duration: totalDurationMinutes,
          },
        }
      );

      setSlots(res.data || []);
    } catch (err: any) {
      console.error("Error fetching slots", err);
      alert(err?.response?.data?.message || "Failed to load time slots.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
    fetchSlots(value);
  };

  const handleNext = () => {
    if (!date || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }

    navigate("/book/summary", {
      state: {
        businessId,
        businessName,
        selectedServices,
        totalDurationMinutes,
        totalPrice,
        date,
        time: selectedTime,
        isReschedule: !!isReschedule,
        bookingId,
      },
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#F1DEDE",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      <TabBar type="customer" />

      <div
        style={{
          width: "90%",
          maxWidth: "700px",
          margin: "40px auto 0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
          padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "10px" }}>
          {isReschedule ? "Reschedule Booking" : "Choose Date & Time"}
        </h2>
        <p style={{ marginTop: 0, color: "#555", fontSize: "14px" }}>
          {businessName}
        </p>

        {/* Date input (can be replaced with calendar lib later) */}
        <div style={{ marginTop: "20px" }}>
          <label
            htmlFor="date"
            style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}
          >
            Select a date:
          </label>
          <input
            id="date"
            type="date"
            value={date}
            min={today}
            onChange={onDateChange}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Slots */}
        <div style={{ marginTop: "24px" }}>
          <h4 style={{ marginBottom: "10px" }}>Available time slots</h4>

          {loadingSlots && <p>Loading slots...</p>}

          {!loadingSlots && date && slots.length === 0 && (
            <p style={{ color: "#777" }}>No available slots for this date.</p>
          )}

          {!loadingSlots && slots.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border:
                      selectedTime === slot
                        ? "2px solid #27374d"
                        : "1px solid #ddd",
                    backgroundColor:
                      selectedTime === slot ? "#27374d" : "#f9f9f9",
                    color: selectedTime === slot ? "#fff" : "#333",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Summary + Next */}
        <div
          style={{
            marginTop: "30px",
            paddingTop: "14px",
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "14px" }}>
            <div>
              {selectedServices.length} service
              {selectedServices.length > 1 ? "s" : ""} ·{" "}
              {totalDurationMinutes} min
            </div>
            <div>
              Total: <strong>{totalPrice.toFixed(2)} BD</strong>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!date || !selectedTime}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              cursor: !date || !selectedTime ? "not-allowed" : "pointer",
              backgroundColor:
                !date || !selectedTime ? "#ccc" : "#27374d",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Next: Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectDatePage;
