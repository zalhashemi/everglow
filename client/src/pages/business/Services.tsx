// src/pages/business/Services.tsx
import React, { useEffect, useMemo, useState } from "react";
import TabBar from "../../components/common/TabBar";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin, FiEdit2, FiTrash2 } from "react-icons/fi";
import ServiceTile from "../../components/common/ServiceTile";
import TextBox from "../../components/common/TextBox";
import Button from "../../components/common/Button";
import errorImage from "../../images/errorLoading.png";
import oliviaSalon from "../../images/oliviaSalon.jpg";
import api from "../../utils/api";
import AlertPopup from "../../components/common/AlertPopup";

/* ------------ Types that match your backend ------------ */
interface Service {
  _id: string;
  name: string;
  durationMinutes: number;
  priceBHD: number;
  category?: string;
  description?: string;
}

interface BusinessHeader {
  businessName: string;
  city: string;
  address: string;
  description?: string;
  imageUrl?: string | null;
}

interface ServiceFormData {
  name: string;
  durationMinutes: string;
  priceBHD: string;
  category: string;
  description: string;
}

interface DashboardStats {
  staffMembers: number;
  totalClients: number;
  avgRating: number;
  reviewCount: number;
}

const BusinessServices: React.FC = () => {
  // ------------ BUSINESS HEADER ------------
  const [business, setBusiness] = useState<BusinessHeader | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(oliviaSalon);

  // Ratings / reviews
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);

  // ------------ SERVICES ------------
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ------------ UI STATE ------------
  const [alertData, setAlertData] = useState<{
    type: "error" | "success";
    title?: string;
    message: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    durationMinutes: "",
    priceBHD: "",
    category: "",
    description: "",
  });

  // --- Derive categories from services (for tabs + quick-select) ---
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["All", ...Array.from(set)];
  }, [services]);

  const categoryOptions = useMemo(
    () => categories.filter((c) => c !== "All"),
    [categories]
  );

  const filteredServices = useMemo(() => {
    if (activeTab === "All") return services;
    return services.filter((s) => s.category === activeTab);
  }, [services, activeTab]);

  // ------------ LOAD BUSINESS + SERVICES + STATS ------------
  useEffect(() => {
    const fetchEverything = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Business profile
        try {
          const res = await api.get<BusinessHeader>("/business/me");
          const b = res.data;
          setBusiness(b);

          if (b.imageUrl) {
            const fullUrl = `http://localhost:5000${b.imageUrl}`;
            setImgSrc(fullUrl);
          } else {
            setImgSrc(oliviaSalon);
          }
        } catch (e) {
          // fallback: maybe stored in localStorage after registration
          const stored = localStorage.getItem("business");
          if (stored) {
            const b = JSON.parse(stored);
            setBusiness({
              businessName: b.businessName || "My Business",
              city: b.city || "",
              address: b.address || "",
              description: b.description || "",
              imageUrl: b.imageUrl,
            });

            if (b.imageUrl) {
              const fullUrl = `http://localhost:5000${b.imageUrl}`;
              setImgSrc(fullUrl);
            } else {
              setImgSrc(oliviaSalon);
            }
          } else {
            setBusiness({
              businessName: "My Business",
              city: "",
              address: "",
              description: "",
              imageUrl: undefined,
            });
            setImgSrc(oliviaSalon);
          }
        }

        // 2) Services for this business
        const svcRes = await api.get<Service[]>("/services");
        setServices(svcRes.data);

        // 3) Dashboard stats -> ratings & reviews
        try {
          const statsRes = await api.get<DashboardStats>(
            "/business/dashboard/stats"
          );
          const stats = statsRes.data;
          setAvgRating(
            typeof stats.avgRating === "number" ? stats.avgRating : 0
          );
          setReviewCount(
            typeof stats.reviewCount === "number" ? stats.reviewCount : 0
          );
        } catch (statsErr) {
          console.error("Failed to load dashboard stats", statsErr);
          // don't block page if stats fail
        }

        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Failed to load services. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, []);

  // ------------ MODAL HANDLERS ------------
  const openAddModal = () => {
    setSelectedService(null);
    setFormData({
      name: "",
      durationMinutes: "",
      priceBHD: "",
      category: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      durationMinutes: service.durationMinutes.toString(),
      priceBHD: service.priceBHD.toString(),
      category: service.category || "",
      description: service.description || "",
    });
    setShowModal(true);
  };

  // ------------ VALIDATION + SUBMIT ------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const durationMinutesNum = Number(formData.durationMinutes);
    const priceBHDNum = Number(formData.priceBHD);
    const trimmedCategory = formData.category.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedName) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "Service name is required.",
      });
      return;
    }

    if (!formData.durationMinutes.trim()) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "Duration (in minutes) is required.",
      });
      return;
    }

    if (Number.isNaN(durationMinutesNum) || durationMinutesNum <= 0) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "Duration must be a positive number of minutes.",
      });
      return;
    }

    if (!formData.priceBHD.trim()) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "Price (BHD) is required.",
      });
      return;
    }

    if (Number.isNaN(priceBHDNum) || priceBHDNum <= 0) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "Price must be a positive number.",
      });
      return;
    }

    const payload = {
      name: trimmedName,
      durationMinutes: durationMinutesNum,
      priceBHD: priceBHDNum,
      category: trimmedCategory || undefined,
      description: trimmedDescription || undefined,
    };

    try {
      if (selectedService) {
        // UPDATE
        const res = await api.put<{ message: string; service: Service }>(
          `/services/${selectedService._id}`,
          payload
        );
        const updated = res.data.service;

        setServices((prev) =>
          prev.map((s) => (s._id === updated._id ? updated : s))
        );

        if (payload.category) {
          setActiveTab(payload.category);
        }
      } else {
        // CREATE
        const res = await api.post<{ message: string; service: Service }>(
          "/services",
          payload
        );
        const created = res.data.service;
        setServices((prev) => [...prev, created]);

        if (payload.category) {
          setActiveTab(payload.category);
        }
      }

      setError(null);
      setShowModal(false);
    } catch (err: any) {
      console.error(err);
      setAlertData({
        type: "error",
        title: "ERROR",
        message:
          err?.response?.data?.message ||
          "Failed to save service. Please try again.",
      });
    }
  };

  // ------------ DELETE HANDLER ------------
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
      setError(null);
    } catch (err: any) {
      console.error(err);
      setAlertData({
        type: "error",
        title: "ERROR",
        message:
          err?.response?.data?.message ||
          "Failed to delete service. Please try again.",
      });
    }
  };

  // ------------ HEADER TEXT FROM BUSINESS ------------
  const headerName = business?.businessName || "Glamour Beauty Salon";
  const headerLocation = business
    ? [business.address, business.city].filter(Boolean).join(", ") ||
      "Location not set"
    : "Seef, Bahrain";
  const headerDescription =
    business?.description ||
    "We offer professional hair, nail, and beauty services using premium products.";

  const hasRating = avgRating !== null && avgRating > 0;

  // ------------ RENDER ------------
  return (
    <div
      style={{
        backgroundColor: "#FAF6EA",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      <TabBar type="business" />

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
          src={imgSrc || errorImage}
          alt={headerName}
          onError={() => setImgSrc(errorImage)}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
          }}
        />

        <div style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700 }}>{headerName}</h2>

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
            {React.createElement(FiMapPin as any, {
              size: 16,
              style: { marginRight: "4px" },
            })}
            {headerLocation || "Location not set"}
          </div>

          {/* Hours – placeholder */}
          <div
            style={{
              color: "#7A7A7A",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            Opening hours not set
          </div>

          {/* Rating – dynamic */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "6px",
              fontSize: "14px",
            }}
          >
            {React.createElement(AiFillStar as any, {
              color: "#FFD03F",
              size: 16,
              style: { marginRight: "4px" },
            })}

            {hasRating ? (
              <>
                <span>{avgRating!.toFixed(1)}</span>
                <span
                  style={{
                    color: "#7A7A7A",
                    marginLeft: "4px",
                  }}
                >
                  ({reviewCount})
                </span>
              </>
            ) : (
              <span style={{ color: "#7A7A7A" }}>No reviews yet</span>
            )}
          </div>

          {/* Description */}
          <p style={{ marginTop: "12px", color: "#555", fontSize: "14px" }}>
            {headerDescription}
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
            {categories.map((tab) => (
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
            {loading && <p>Loading services...</p>}

            {error && !services.length && (
              <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
            )}

            {!loading && !filteredServices.length && !error && (
              <p style={{ fontSize: "14px", color: "#777" }}>
                No services yet. Click &quot;Add New Service&quot; to create
                one.
              </p>
            )}

            {filteredServices.map((service) => (
              <div
                key={service._id}
                style={{
                  position: "relative",
                  marginBottom: "12px",
                }}
              >
                <ServiceTile
                  name={service.name}
                  price={service.priceBHD}
                  duration={`${service.durationMinutes} min`}
                  description={service.description}
                  actions={
                    <>
                      <FiEdit2
                        size={18}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() => openEditModal(service)}
                      />
                      <FiTrash2
                        size={18}
                        color="#b00020"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(service._id)}
                      />
                    </>
                  }
                />
              </div>
            ))}

            {/* Add New Service Button */}
            <div
              style={{
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              <Button
                onClick={openAddModal}
                style={{
                  width: "100%",
                  maxWidth: "850px",
                  height: "46px",
                  fontWeight: 600,
                  fontSize: "14px",
                  backgroundColor: "#4A5074",
                }}
              >
                + Add New Service
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(241, 222, 222, 0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "32px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              {selectedService ? "Edit Service" : "Add New Service"}
            </h3>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <TextBox
                placeholder="Service Name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
              />
              <TextBox
                placeholder="Duration (minutes, e.g. 45)"
                value={formData.durationMinutes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((p) => ({
                    ...p,
                    durationMinutes: e.target.value,
                  }))
                }
              />
              <TextBox
                placeholder="Price (BHD)"
                value={formData.priceBHD}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((p) => ({ ...p, priceBHD: e.target.value }))
                }
              />
              <div>
                <TextBox
                  placeholder="Category (e.g. Hair, Nails)"
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((p) => ({ ...p, category: e.target.value }))
                  }
                />
                {categoryOptions.length > 0 && (
                  <div style={{ marginTop: "6px" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#777",
                        marginBottom: "4px",
                      }}
                    >
                      Quick select category:
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {categoryOptions.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setFormData((p) => ({ ...p, category: cat }))
                          }
                          style={{
                            borderRadius: "999px",
                            border: "1px solid #ddd",
                            padding: "4px 10px",
                            fontSize: "12px",
                            cursor: "pointer",
                            background:
                              formData.category === cat
                                ? "#4A5074"
                                : "#f7f7f7",
                            color:
                              formData.category === cat ? "#fff" : "#333",
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <TextBox
                placeholder="Description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>

                <Button type="submit">
                  <FiEdit2
                    size={16}
                    style={{ marginRight: "8px", verticalAlign: "middle" }}
                  />
                  {selectedService ? "Update Service" : "Add Service"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default BusinessServices;