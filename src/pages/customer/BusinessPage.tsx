import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import TabBar from "../../components/common/TabBar";
import ServiceTile from "../../components/common/ServiceTile";
import errorImage from "../../images/errorLoading.png";

const BusinessPage: React.FC = () => {
  const location = useLocation();
  const salon = location.state as any;

  const [activeTab, setActiveTab] = useState(salon?.categories?.[0] || "");
  const [imgSrc, setImgSrc] = useState(salon?.image || errorImage);

  // --- Popup states ---
  const [showPopup, setShowPopup] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");

  if (!salon) {
    return <div style={{ padding: "20px" }}>Salon not found.</div>;
  }

  // --- Handlers ---
  const openPopup = (service: any) => {
    setSelectedService(service);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedService(null);
    setSelectedDate("");
  };

  const handleConfirmBooking = () => {
    if (!selectedDate) {
      alert("Please choose a date and time before confirming!");
      return;
    }
    alert(
      `✅ Appointment booked for "${selectedService.name}" on ${selectedDate}`
    );
    closePopup();
  };

  return (
    <div
      style={{
        backgroundColor: "#F1DEDE",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      {/* Top Navigation */}
      <TabBar type="customer" />

      <div
        style={{
          width: "90%",
          maxWidth: "900px",
          margin: "40px auto 0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Salon Header */}
        <img
          src={imgSrc}
          alt={salon.name}
          onError={() => setImgSrc(errorImage)}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
          }}
        />

        <div style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700 }}>{salon.name}</h2>

          {/* Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "6px",
              color: "#7A7A7A",
              fontSize: "14px",
            }}
          >
            <FiMapPin size={16} style={{ marginRight: "4px" }} />
            {salon.location}
          </div>

          {/* Hours */}
          <div
            style={{
              color: "#7A7A7A",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            {salon.hours}
          </div>

          {/* Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "6px",
              fontSize: "14px",
            }}
          >
            <AiFillStar color="#FFD03F" size={16} style={{ marginRight: "4px" }} />
            <span>{salon.rating}</span>
            <span style={{ color: "#7A7A7A", marginLeft: "4px" }}>
              ({salon.reviews})
            </span>
          </div>

          {/* Description */}
          <p style={{ marginTop: "12px", color: "#555", fontSize: "14px" }}>
            {salon.description}
          </p>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              borderBottom: "1px solid #e5e5e5",
              marginTop: "20px",
            }}
          >
            {salon.categories.map((tab: string) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  border: "none",
                  background: "none",
                  fontWeight: 500,
                  color: activeTab === tab ? "#000" : "#7A7A7A",
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #000"
                      : "2px solid transparent",
                  padding: "10px 0",
                  cursor: "pointer",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Services List */}
          <div style={{ marginTop: "20px" }}>
            {salon.services.map((service: any) => (
              <ServiceTile
                key={service.id}
                name={service.name}
                price={service.price}
                duration={service.duration}
                description={service.description}
                onClick={() => openPopup(service)} // 👈 When clicked, open booking popup
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- Popup --- */}
      {showPopup && (
        <div
          onClick={closePopup}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "30px",
              width: "380px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Book Appointment</h3>

            <p>
              <strong>Service:</strong> {selectedService?.name}
            </p>
            <p>
              <strong>Price:</strong> {selectedService?.price} BD
            </p>
            <p>
              <strong>Duration:</strong> {selectedService?.duration}
            </p>

            <label style={{ display: "block", marginTop: "15px" }}>
              Choose Date & Time:
            </label>
            <input
              type="datetime-local"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={closePopup}
                style={{
                  background: "transparent",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBooking}
                style={{
                  background: "#27374d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPage;
