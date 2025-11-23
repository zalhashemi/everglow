import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { Star } from "react-feather";
import TabBar from "../../components/common/TabBar";
import ServiceTile from "../../components/common/ServiceTile";
import axios from "../../utils/api";
import errorImage from "../../images/errorLoading.png";
import AlertPopup from "../../components/common/AlertPopup";


/* ---------- TYPES ---------- */

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
  // 👇 match backend field name: discountPercent
  discountPercent: number;
  validFrom?: string;
  validTo?: string;
};

type Review = {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: {
    firstName?: string;
    lastName?: string;
  };
};

/* ---------- COMPONENT ---------- */

const BusinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>(errorImage);

  const [activeTab, setActiveTab] = useState<"Services" | "Offers" | "Reviews">(
    "Services"
  );

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const [alertData, setAlertData] = useState<{
  type: "error" | "success";
  title?: string;
  message: string;
} | null>(null);


  /* ---------- FETCH BUSINESS + SERVICES + OFFERS ---------- */

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

  /* ---------- FETCH REVIEWS ---------- */

  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/reviews/business/${id}`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Error loading reviews:", err);
      }
    };

    fetchReviews();
  }, [id]);

  /* ---------- SELECTED SERVICES ---------- */

  const selectedServices = useMemo(
    () => services.filter((s) => selectedServiceIds.includes(s._id)),
    [services, selectedServiceIds]
  );

  const totalDurationMinutes = selectedServices.reduce(
    (sum, s) => sum + (s.durationMinutes || 0),
    0
  );

  const totalPrice = selectedServices.reduce(
    (sum, s) => sum + (s.priceBHD || 0),
    0
  );

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (!business || selectedServices.length === 0) {
      setAlertData({
  type: "error",
  message: "Please select at least one service to continue.",
});

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

  /* ---------- LOADING / NOT FOUND ---------- */

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!business) {
    return <div style={{ padding: 20 }}>Salon not found.</div>;
  }

  /* ---------- RENDER ---------- */

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
          maxWidth: "900px",
          margin: "40px auto 0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* ---------- Cover Image ---------- */}
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
          <h2 style={{ fontSize: "24px", fontWeight: 700 }}>
            {business.businessName}
          </h2>

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

          {/* ---------- Tabs ---------- */}

          <div
            style={{
              display: "flex",
              gap: "20px",
              borderBottom: "1px solid #e5e5e5",
              marginTop: "20px",
            }}
          >
            {["Services", "Offers", "Reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "Services" | "Offers" | "Reviews")
                }
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

          {/* ---------- TAB CONTENT ---------- */}

          <div style={{ marginTop: "20px" }}>
            {/* SERVICES */}
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

            {/* OFFERS */}
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
                    <h4 style={{ margin: 0, fontWeight: 600 }}>
                      {offer.title}
                    </h4>
                    <p style={{ margin: "6px 0", color: "#666" }}>
                      Discount: {offer.discountPercent}%
                    </p>
                  </div>
                ))}
              </>
            )}

            {/* ⭐ REVIEWS TAB */}
            {activeTab === "Reviews" && (
              <>
                {reviews.length === 0 && (
                  <p style={{ color: "#777" }}>No reviews yet.</p>
                )}

                {reviews.map((review) => (
                  <div
                    key={review._id}
                    style={{
                      padding: "16px",
                      borderRadius: "10px",
                      border: "1px solid #eee",
                      marginBottom: "16px",
                      backgroundColor: "#faf7f7",
                    }}
                  >
                    {/* Date */}
                    <div style={{ fontSize: "13px", color: "#777" }}>
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    {/* Stars */}
                    <div style={{ display: "flex", marginTop: "6px" }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={20}
                          color={i <= review.rating ? "#FFD700" : "#ccc"}
                          fill={i <= review.rating ? "#FFD700" : "none"}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p style={{ marginTop: "8px", color: "#444" }}>
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* FOOTER: Selected Services */}
          {activeTab === "Services" && (
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
                  cursor:
                    selectedServices.length === 0 ? "not-allowed" : "pointer",
                  backgroundColor:
                    selectedServices.length === 0 ? "#ccc" : "#27374d",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Next: Select Time
              </button>
            </div>
          )}
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

export default BusinessPage;
