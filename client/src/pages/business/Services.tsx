import React, { useEffect, useMemo, useState } from "react";
import TabBar from "../../components/common/TabBar";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin, FiEdit2 } from "react-icons/fi";
import ServiceTile from "../../components/common/ServiceTile";
import TextBox from "../../components/common/TextBox";
import Button from "../../components/common/Button";
import errorImage from "../../images/errorLoading.png";
import oliviaSalon from "../../images/oliviaSalon.jpg";
import api from "../../utils/api";
import { FiTrash2 } from "react-icons/fi";


// --- Types that match your backend ---
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

// For the modal form
interface ServiceFormData {
  name: string;
  durationMinutes: string; // keep as string in form, convert to number on submit
  priceBHD: string;
  category: string;
  description: string;
}

const BusinessServices: React.FC = () => {
  // ------------ BUSINESS HEADER ------------
  const [business, setBusiness] = useState<BusinessHeader | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(oliviaSalon);

  // ------------ SERVICES ------------
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ------------ UI STATE ------------
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

  // --- Derive categories from services ---
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["All", ...Array.from(set)];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (activeTab === "All") return services;
    return services.filter((s) => s.category === activeTab);
  }, [services, activeTab]);

  // ------------ LOAD BUSINESS + SERVICES ------------
  useEffect(() => {
    const fetchEverything = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Try to get business profile from backend
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
          // fallback: maybe you stored business info in localStorage after registration
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

        // 2) Get services for this business
        const svcRes = await api.get<Service[]>("/services");
        setServices(svcRes.data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const durationMinutesNum = Number(formData.durationMinutes);
    const priceBHDNum = Number(formData.priceBHD);

    if (!formData.name || !durationMinutesNum || !priceBHDNum) {
      alert("Please fill at least name, duration and price.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      durationMinutes: durationMinutesNum,
      priceBHD: priceBHDNum,
      category: formData.category.trim() || undefined,
      description: formData.description.trim() || undefined,
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
      } else {
        // CREATE
        const res = await api.post<{ message: string; service: Service }>(
          "/services",
          payload
        );
        const created = res.data.service;
        setServices((prev) => [...prev, created]);
      }

      setError(null);

      if (payload.category && !categories.includes(payload.category)) {
        setActiveTab("All");
      }

      setShowModal(false);
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Failed to save service. Please try again."
      );
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
      alert(
        err?.response?.data?.message ||
          "Failed to delete service. Please try again."
      );
    }
  };

  // ------------ RENDER ------------
  const headerName = business?.businessName || "Glamour Beauty Salon";
  const headerLocation = business
    ? `${business.city || ""}`.trim()
    : "Seef, Bahrain";
  const headerDescription =
    business?.description ||
    "We offer professional hair, nail, and beauty services using premium products.";

  
  return (
    <div
      style={{
        backgroundColor: "#F1DEDE",
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

          {/* Rating – static */}
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
            <span>4.8</span>
            <span style={{ color: "#7A7A7A", marginLeft: "4px" }}>(312)</span>
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
        style={{ cursor: "pointer" }}
        onClick={() => openEditModal(service)}
      />

      {/* DELETE ICON */}
     <FiTrash2
  size={18}
  color="#b00020"
  style={{ cursor: "pointer" }}
  onClick={() => handleDelete(service._id)}
/>

    </>
  }
/>



                {/* Delete button under each service */}
                
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
              <TextBox
                placeholder="Category (e.g. Hair, Nails)"
                value={formData.category}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((p) => ({ ...p, category: e.target.value }))
                }
              />
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
    </div>
  );
};

export default BusinessServices;
