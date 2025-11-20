// src/pages/customer/BusinessPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import TabBar from "../../components/common/TabBar";
import ServiceTile from "../../components/common/ServiceTile";
import axios from "../../utils/api"; // axios instance
import errorImage from "../../images/errorLoading.png";

type Business = {
  _id: string;
  businessName: string;
  businessType: string;
  address: string;
  city: string;
  description?: string;
  operatingHours?: any;
  socialLinks?: any;
  imageUrl?: string | null;
};

type Service = {
  _id: string;
  name: string;
  durationMinutes: number;
  priceBHD: number;
  category?: string;
  description?: string;
};

type Offer = {
  _id: string;
  title: string;
  discountPercentage: number;
  validFrom?: string;
  validTo?: string;
};

const BusinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>(errorImage);
  const [activeTab, setActiveTab] = useState<"Services" | "Offers">("Services");

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // ---------- FETCH BUSINESS DETAILS FROM API ----------
  useEffect(() => {
    if (!id) return;
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`/public/businesses/${id}`);
        const { business, services, offers } = res.data;
        setBusiness(business || null);
        setServices(services || []);
        setOffers(offers || []);
        setImgSrc(
          business?.imageUrl
            ? `http://localhost:5000${business.imageUrl}`
            : errorImage
        );
      } catch (err) {
        console.error("Error loading business details:", err);
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  // ---------- DERIVED TOTALS ----------
  const selectedServices = useMemo(
    () => services.filter((s) => selectedServiceIds.includes(s._id)),
    [services, selectedServiceIds]
  );

  const totalDurationMinutes = useMemo(
    () =>
      selectedServices.reduce(
        (sum, s) => sum + (s.durationMinutes || 0),
        0
      ),
    [selectedServices]
  );

  const totalPrice = useMemo(
    () =>
      selectedServices.reduce(
        (sum, s) => sum + (s.priceBHD || 0),
        0
      ),
    [selectedServices]
  );

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (!business || selectedServices.length === 0) {
      alert("Please select at least one service to continue.");
      return;
    }

    navigate("/book/select-date", {
      state: {
        businessId: business._id,
        businessName: business.businessName,
        selectedServices,
        totalDurationMinutes,
        totalPrice,
      },
    });
  };

  // ---------- LOADING / NOT FOUND ----------
  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!business) {
    return <div style={{ padding: 20 }}>Salon not found.</div>;
  }

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
          maxWidth: "900px",
          margin: "40px auto 0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Cover Image */}
        <img
          src={imgSrc}
          alt={business.businessName}
          onError={() => setImgSrc(errorImage)}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
          }}
        />

        <div style={{ padding: "24px" }}>
          {/* Name */}
          <h2 style={{ fontSize: "24px", fontWeight: 700 }}>
            {business.businessName}
          </h2>

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
            <FiMapPin size={16} style={{ marginRight: 4 }} />
            {business.city}
          </div>

          {/* Basic Hours */}
          <div
            style={{
              color: "#7A7A7A",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            {business.operatingHours?.monday
              ? `Mon: ${business.operatingHours.monday}`
              : "Operating hours not available"}
          </div>

          {/* Description */}
          <p style={{ marginTop: "12px", color: "#555", fontSize: "14px" }}>
            {business.description}
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
            <button
              onClick={() => setActiveTab("Services")}
              style={{
                border: "none",
                background: "none",
                fontWeight: 500,
                color: activeTab === "Services" ? "#000" : "#7A7A7A",
                borderBottom:
                  activeTab === "Services"
                    ? "2px solid #000"
                    : "2px solid transparent",
                padding: "10px 0",
                cursor: "pointer",
              }}
            >
              Services
            </button>

            <button
              onClick={() => setActiveTab("Offers")}
              style={{
                border: "none",
                background: "none",
                fontWeight: 500,
                color: activeTab === "Offers" ? "#000" : "#7A7A7A",
                borderBottom:
                  activeTab === "Offers"
                    ? "2px solid #000"
                    : "2px solid transparent",
                padding: "10px 0",
                cursor: "pointer",
              }}
            >
              Offers
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ marginTop: "20px" }}>
            {activeTab === "Services" && (
              <>
                {services.length === 0 && (
                  <p style={{ color: "#777" }}>No services available.</p>
                )}

                {services.map((service) => {
                  const isSelected = selectedServiceIds.includes(service._id);
                  return (
                    <ServiceTile
                      key={service._id}
                      name={service.name}
                      price={service.priceBHD}
                      duration={`${service.durationMinutes} min`}
                      description={service.description}
                      selected={isSelected}
                      actions={
                        <button
                          onClick={() => toggleService(service._id)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 500,
                            backgroundColor: isSelected ? "#27374d" : "#f2dcdc",
                            color: isSelected ? "#ffffff" : "#27374d",
                          }}
                        >
                          {isSelected ? "Remove" : "Add"}
                        </button>
                      }
                    />
                  );
                })}
              </>
            )}

            {activeTab === "Offers" && (
              <>
                {offers.length === 0 && (
                  <p style={{ color: "#777" }}>No active offers.</p>
                )}

                {offers.map((offer) => (
                  <div
                    key={offer._id}
                    style={{
                      padding: "16px",
                      backgroundColor: "#F9F2F2",
                      borderRadius: "10px",
                      marginBottom: "12px",
                      border: "1px solid #eee",
                    }}
                  >
                    <h4 style={{ margin: 0, fontWeight: 600 }}>{offer.title}</h4>
                    <p style={{ margin: "6px 0", color: "#666" }}>
                      Discount: {offer.discountPercentage}%
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Selected services summary + NEXT button */}
          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#333" }}>
              {selectedServices.length === 0 ? (
                <span>No services selected.</span>
              ) : (
                <>
                  <div>
                    <strong>{selectedServices.length}</strong> service
                    {selectedServices.length > 1 ? "s" : ""} selected
                  </div>
                  <div>
                    Total: <strong>{totalPrice.toFixed(2)} BD</strong> ·{" "}
                    <strong>{totalDurationMinutes}</strong> min
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedServices.length === 0}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                cursor: selectedServices.length === 0 ? "not-allowed" : "pointer",
                backgroundColor:
                  selectedServices.length === 0 ? "#ccc" : "#27374d",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Next: Select Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
