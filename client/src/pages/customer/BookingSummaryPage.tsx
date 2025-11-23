// src/pages/customer/BookingSummaryPage.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import api from "../../utils/api";
import AlertPopup from "../../components/common/AlertPopup";


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
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  isReschedule?: boolean;
  bookingId?: string;
};

const BookingSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const [submitting, setSubmitting] = useState(false);
  const [alertData, setAlertData] = useState<{
  type: "error" | "success";
  title?: string;
  message: string;
} | null>(null);


  if (!state) {
    navigate("/home");
    return null;
  }

  const {
    businessId,
    businessName,
    selectedServices,
    totalDurationMinutes,
    totalPrice,
    date,
    time,
    isReschedule,
    bookingId,
  } = state;

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      const isoStart = `${date}T${time}:00`;

      if (isReschedule && bookingId) {
        await api.patch(`/bookings/${bookingId}`, {
          action: "reschedule",
          newStartTime: isoStart,
          serviceIds: selectedServices.map((s) => s._id),
        });

        setAlertData({
  type: "success",
  message: "Booking rescheduled!",
});
setTimeout(() => navigate("/home"), 500); // optional small delay
return;

        navigate("/home");
        return;
      }

      await api.post("/bookings", {
        businessId,
        serviceIds: selectedServices.map((s) => s._id),
        startTime: isoStart,
        notes: "",
      });

      setAlertData({
  type: "success",
  message: "Booking confirmed!",
});
setTimeout(() => navigate("/home"), 500);

      navigate("/home");
    } catch (err: any) {
      console.error("Error confirming booking", err);
      setAlertData({
  type: "error",
  message: err?.response?.data?.message || "Failed to confirm booking",
});

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FAF6EA",
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
          {isReschedule ? "Review & Confirm Changes" : "Review & Confirm"}
        </h2>
        <p style={{ marginTop: 0, color: "#555", fontSize: "14px" }}>
          {businessName}
        </p>

        {/* Date & time */}
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            borderRadius: "10px",
            backgroundColor: "#f9f2f2",
          }}
        >
          <div style={{ fontSize: "14px" }}>
            <strong>Date:</strong> {date}
          </div>
          <div style={{ fontSize: "14px" }}>
            <strong>Time:</strong> {time}
          </div>
        </div>

        {/* Services */}
        <div style={{ marginTop: "24px" }}>
          <h4 style={{ marginBottom: "10px" }}>Services</h4>
          {selectedServices.map((s) => (
            <div
              key={s._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: "12px", color: "#777" }}>
                  {s.durationMinutes} min
                </div>
              </div>
              <div>{s.priceBHD.toFixed(2)} BD</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "12px",
            borderTop: "1px solid #eee",
          }}
        >
          <div style={{ fontSize: "14px" }}>
            <div>
              Total duration:{" "}
              <strong>{totalDurationMinutes} min</strong>
            </div>
            <div>
              Total price:{" "}
              <strong>{totalPrice.toFixed(2)} BD</strong>
            </div>
          </div>

          {/* Payment Note */}
          <div
            style={{
              marginTop: "26px",
              textAlign: "center",
              lineHeight: "1.5",
            }}
          >
            Payment done in-person at the appointment.<br />
            <i>
              Any offers or discounts will be calculated after the appointment
              in-person.
            </i>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            marginTop: "28px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Back
          </button>

          <button
            onClick={handleConfirm}
            disabled={submitting}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: submitting ? "#999" : "#27374d",
              color: "#fff",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            {submitting
              ? isReschedule
                ? "Saving..."
                : "Confirming..."
              : isReschedule
              ? "Confirm Changes"
              : "Confirm Booking"}
          </button>
        </div>
      </div>
      {alertData && (
  <AlertPopup
    type={alertData.type}
    title={alertData.type === "error" ? "ERROR" : ""}
    message={alertData.message}
    onClose={() => setAlertData(null)}
  />
)}

    </div>
    
  );
};

export default BookingSummaryPage;
