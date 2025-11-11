import React, { useState } from "react";
import TabBar from "../../components/common/TabBar";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin, FiEdit2 } from "react-icons/fi";
import ServiceTile from "../../components/common/ServiceTile";
import TextBox from "../../components/common/TextBox";
import Button from "../../components/common/Button";
import errorImage from "../../images/errorLoading.png";
import oliviaSalon from "../../images/oliviaSalon.jpg";

const BusinessServices: React.FC = () => {
  const salon = {
    name: "Glamour Beauty Salon",
    image: oliviaSalon,
    location: "Seef, Bahrain",
    hours: "9AM - 10PM, Mon - Sun",
    rating: 4.8,
    reviews: 312,
    description:
      "We offer professional hair, nail, and beauty services using premium products.",
    categories: ["Hair", "Coloring", "Styling", "Nails", "Spa"],
  };

  const [activeTab, setActiveTab] = useState(salon.categories[0]);
  const [imgSrc, setImgSrc] = useState(salon.image || errorImage);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [services, setServices] = useState([
    {
      id: "1",
      name: "Haircut",
      duration: "45 min",
      price: "22 BD",
      description: "Professional haircut service including wash and style",
    },
    {
      id: "2",
      name: "Hair Coloring",
      duration: "2 hrs",
      price: "30 BD",
      description: "Full hair coloring service with premium products",
    },
  ]);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    description: "",
  });

  const handleAddService = () => {
    setSelectedService(null);
    setFormData({ name: "", duration: "", price: "", description: "" });
    setShowModal(true);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price,
      description: service.description,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService) {
      setServices(
        services.map((s) =>
          s.id === selectedService.id ? { ...s, ...formData } : s
        )
      );
    } else {
      setServices([
        ...services,
        {
          id: (services.length + 1).toString(),
          ...formData,
        },
      ]);
    }
    setShowModal(false);
  };

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
            {React.createElement(FiMapPin as any, {
              size: 16,
              style: { marginRight: "4px" },
            })}
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
            {React.createElement(AiFillStar as any, {
              color: "#FFD03F",
              size: 16,
              style: { marginRight: "4px" },
            })}
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
            {services.map((service) => (
              <div
                key={service.id}
                style={{
                  position: "relative",
                  marginBottom: "12px",
                }}
              >
                <ServiceTile
                  name="Haircut"
                  price={22}
                  duration="45 min"
                  icon={<FiEdit2 size={16} />} 
                  onClick={() => handleEditService(service)}
                />
              </div>
            ))}

            {/* ✅ Add New Service Button (fits container width) */}
            <div
              style={{
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              <Button
                onClick={handleAddService}
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

      {/* ✅ Modal for Edit/Add */}
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
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
              />
              <TextBox
                placeholder="Duration (e.g., 45 min)"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, duration: e.target.value }))
                }
              />
              <TextBox
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, price: e.target.value }))
                }
              />
              <TextBox
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
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

                {/* ✅ Pencil icon inside button */}
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
