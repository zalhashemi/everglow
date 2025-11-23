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

  staffIndex: number;
  staffName?: string;
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
    staffIndex,
    staffName,
  } = state;

  const mainService = selectedServices[0];

  const handleConfirm = async () => {
    if (!mainService) {
      setAlertData({
        type: "error",
        message: "No service selected.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const isoStart = `${date}T${time}:00`;

      // If you later add reschedule PATCH, you can handle it here.
      // For now we always create a new booking.
      await api.post("/bookings", {
        businessId,
        serviceId: mainService._id,
        startTime: isoStart,
        notes: "",
        staffIndex,
      });

      setAlertData({
        type: "success",
        message: "Booking confirmed!",
      });
    } catch (err: any) {
      console.error("Error confirming booking", err);
      setAlertData({
        type: "error",
        message:
          err?.response?.data?.message || "Failed to confirm booking",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePopupClose = () => {
    if (alertData?.type === "success") {
      navigate("/bookings");
    }
    setAlertData(null);
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

        {/* Date, Time & Staff */}
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
          {staffName && (
            <div style={{ fontSize: "14px", marginTop: "4px" }}>
              <strong>Staff:</strong> {staffName}
            </div>
          )}
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
              Total duration: <strong>{totalDurationMinutes} min</strong>
            </div>
            <div>
              Total price: <strong>{totalPrice.toFixed(2)} BD</strong>
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
            Payment done in-person at the appointment.
            <br />
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
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default BookingSummaryPage;
