// src/pages/customer/BookingReceiptPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import api from "../../utils/api";
import errorImage from "../../images/errorLoading.png";

const BookingReceiptPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        console.error("Error loading booking:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  if (loading)
    return <div style={{ padding: 20 }}>Loading receipt…</div>;

  if (!booking)
    return <div style={{ padding: 20 }}>Booking not found.</div>;

  const start = new Date(booking.startTime);
  const dateStr = start.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const totalPrice = booking.services.reduce(
    (sum: number, s: any) => sum + s.priceBHD,
    0
  );

  const totalMinutes = booking.services.reduce(
    (sum: number, s: any) => sum + s.durationMinutes,
    0
  );

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
        <h2 style={{ fontSize: "24px", fontWeight: 700 }}>
          Booking Receipt
        </h2>

        <p style={{ marginTop: 4, color: "#555", fontSize: "14px" }}>
          {booking.business.businessName}
        </p>

        {/* Image */}
        <img
          src={
            booking.business.imageUrl
              ? `http://localhost:5000${booking.business.imageUrl}`
              : errorImage
          }
          alt="Business"
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            borderRadius: "12px",
            marginTop: "12px",
          }}
        />

        {/* Date/time */}
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            borderRadius: "10px",
            backgroundColor: "#f9f2f2",
          }}
        >
          <div>
            <strong>Date:</strong> {dateStr}
          </div>
          <div>
            <strong>Time:</strong> {timeStr}
          </div>
        </div>

        {/* Services */}
        <div style={{ marginTop: "24px" }}>
          <h4 style={{ marginBottom: "10px" }}>Services</h4>
          {booking.services.map((s: any) => (
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

        {/* Totals + Payment Note */}
        <div
          style={{
            marginTop: "28px",
            paddingTop: "12px",
            borderTop: "1px solid #eee",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div>
                Total duration: <strong>{totalMinutes} min</strong>
              </div>
              <div>
                Total price: <strong>{totalPrice.toFixed(2)} BD</strong>
              </div>
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

        {/* Back button */}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => navigate("/bookings")}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Back to Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingReceiptPage;
