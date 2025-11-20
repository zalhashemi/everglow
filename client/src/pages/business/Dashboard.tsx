import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import { AiOutlineCheckSquare, AiFillStar } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { IconFix } from "../../utils/IconFix";
import api from "../../utils/api";

/* ---------- Types ---------- */

interface Service {
  _id: string;
  name: string;
  price?: number;
  durationMinutes?: number;
}

interface Offer {
  _id: string;
  title: string;
  servicesAppliedOn: (Service | string)[];
  discountPercent: number;
  validFrom: string;
  validTo: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------- Styled Components ---------- */

const PageWrapper = styled.div`
  background-color: ${(p) => p.theme.colors.background || "#f2dcdc"};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 90%;
  max-width: 1400px;
  padding: 40px 0 60px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const WelcomeText = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 40px;
  font-weight: 800;
  color: ${(p) => p.theme.colors.primary || "#0b1c36"};

  @media (max-width: 700px) {
    font-size: 28px;
  }
`;

const DateAndButton = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const DateBox = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #333;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`;

const PrimaryButton = styled.button`
  background-color: ${(p) => p.theme.colors.primary || "#0b1c36"};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StatTitle = styled.div`
  font-weight: 700;
  color: #27374d;
  font-size: 14px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #0b1c36;
`;

const StatSubText = styled.div`
  font-size: 13px;
  color: #999;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #27374d;
  margin-bottom: 16px;
`;

const AppointmentContainer = styled.div`
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 10px;
`;

const AppointmentRow = styled.div<{ status: "CONFIRMED" | "CANCELLED" }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #333;

  span.status {
    font-weight: 600;
    color: ${(p) =>
      p.status === "CONFIRMED"
        ? "#3FAE57"
        : p.status === "CANCELLED"
        ? "#E03B3B"
        : "#888"};
  }
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
`;

const ProgressRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
`;

const ProgressBar = styled.div<{ percent: number }>`
  background-color: #eaeaea;
  border-radius: 8px;
  height: 8px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    width: ${(p) => p.percent}%;
    height: 100%;
    background-color: #76949f;
  }
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const QuickStatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const QuickStatLabel = styled.div`
  font-size: 13px;
  color: #7a7a7a;
  text-transform: uppercase;
`;

const QuickStatValue = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #0b1c36;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f5c518;
`;

/* ---------- Offers List ---------- */

const OfferList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OfferItem = styled.div`
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #fafafa;
`;

const OfferHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const OfferTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: #0b1c36;
`;

const OfferMeta = styled.div`
  font-size: 12px;
  color: #666;
`;

const Chip = styled.span<{ variant?: "active" | "past" }>`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid
    ${(p) => (p.variant === "active" ? "#3FAE57" : p.variant === "past" ? "#aaa" : "#ddd")};
  color: ${(p) => (p.variant === "active" ? "#3FAE57" : p.variant === "past" ? "#666" : "#555")};
  background: #fff;
`;

const OfferActions = styled.div`
  display: flex;
  gap: 8px;
`;

const SmallButton = styled.button`
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #f1f1f1;
  }
`;

const OfferServicesText = styled.div`
  font-size: 12px;
  color: #555;
`;

/* ---------- Popup ---------- */

const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const PopupCard = styled.div`
  width: 480px;
  max-width: 95vw;
  background: #fff;
  padding: 24px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const PopupTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #0b1c36;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #27374d;
  display: block;
  margin-bottom: 4px;
`;

const SaveButton = styled.button`
  padding: 12px 0;
  background: #0b1c36;
  color: white;
  border: none;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 6px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 10px 0;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
`;

const PopupActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const ServicesList = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background: #fafafa;
`;

const ServiceRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 4px 0;
`;

/* ---------- Offer Popup Component ---------- */

interface OfferPopupProps {
  onClose: () => void;
  onSaved: () => void;
  services: Service[];
  existingOffer?: Offer | null;
}

const OfferPopup: React.FC<OfferPopupProps> = ({
  onClose,
  onSaved,
  services,
  existingOffer,
}) => {
  const [name, setName] = useState(existingOffer?.title || "");
  const [discount, setDiscount] = useState(
    existingOffer ? String(existingOffer.discountPercent) : ""
  );
  const [start, setStart] = useState(
    existingOffer?.validFrom ? existingOffer.validFrom.slice(0, 10) : ""
  );
  const [end, setEnd] = useState(
    existingOffer?.validTo ? existingOffer.validTo.slice(0, 10) : ""
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(() => {
    if (!existingOffer || !existingOffer.servicesAppliedOn) return [];
    return existingOffer.servicesAppliedOn.map((s) =>
      typeof s === "string" ? s : s._id
    );
  });
  const [saving, setSaving] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!name.trim() || !discount || !start || !end) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      title: name.trim(),
      discountPercent: Number(discount),
      validFrom: start,
      validTo: end,
      servicesAppliedOn: selectedServiceIds,
    };

    try {
      setSaving(true);
      if (existingOffer?._id) {
        await api.put(`/business/offers/${existingOffer._id}`, payload);
      } else {
        await api.post("/business/offers", payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.error("Error saving offer:", err);
      alert(
        err?.response?.data?.message || "Something went wrong while saving the offer."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupCard onClick={(e) => e.stopPropagation()}>
        <PopupTitle>{existingOffer ? "Edit Offer" : "Create New Offer"}</PopupTitle>

        <div>
          <Label>Offer Name</Label>
          <Input
            placeholder="e.g. Summer Glow Package"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label>Discount Applied (%)</Label>
          <Input
            placeholder="e.g. 20"
            type="number"
            min={1}
            max={100}
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <Label>Begins On</Label>
            <Input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Label>Ends On</Label>
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>

        <div>
          <Label>Services Included in Offer</Label>
          {services.length === 0 ? (
            <div style={{ fontSize: 12, color: "#777" }}>
              You have no services yet. Add services first to attach them to offers.
            </div>
          ) : (
            <ServicesList>
              {services.map((service) => (
                <ServiceRow key={service._id}>
                  <input
                    type="checkbox"
                    checked={selectedServiceIds.includes(service._id)}
                    onChange={() => toggleService(service._id)}
                  />
                  <span>{service.name}</span>
                </ServiceRow>
              ))}
            </ServicesList>
          )}
        </div>

        <PopupActions>
          <CancelButton onClick={onClose} disabled={saving}>
            Cancel
          </CancelButton>
          <SaveButton onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Offer"}
          </SaveButton>
        </PopupActions>
      </PopupCard>
    </PopupOverlay>
  );
};

/* ---------- Main Dashboard ---------- */

const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // dummy data still there – same as your old dashboard
  const appointments = [
    {
      time: "09:00 AM",
      name: "Sarah Johnson",
      service: "Haircut • 60 min",
      status: "CONFIRMED",
    },
    {
      time: "10:30 AM",
      name: "Mike Chen",
      service: "Hair Coloring • 120 min",
      status: "CONFIRMED",
    },
    {
      time: "01:00 PM",
      name: "Emily Davis",
      service: "Manicure • 45 min",
      status: "CANCELLED",
    },
    {
      time: "03:00 PM",
      name: "James Wilson",
      service: "Massage • 90 min",
      status: "CONFIRMED",
    },
  ];

  const popularServices = [
    { name: "Haircut", bookings: 45 },
    { name: "Hair Coloring", bookings: 32 },
    { name: "Manicure", bookings: 28 },
    { name: "Facial", bookings: 22 },
    { name: "Massage", bookings: 18 },
  ];

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const res = await api.get("/business/me/services");
      setServices(res.data || []);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchOffers = async () => {
    try {
      setLoadingOffers(true);
      const res = await api.get("/business/offers");
      setOffers(res.data || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
    } finally {
      setLoadingOffers(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchOffers();
  }, []);

  const handleNewOffer = () => {
    setEditingOffer(null);
    setShowOfferPopup(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setShowOfferPopup(true);
  };

  const handleDeleteOffer = async (offer: Offer) => {
    const ok = window.confirm(`Delete offer "${offer.title}"?`);
    if (!ok) return;

    try {
      await api.delete(`/business/offers/${offer._id}`);
      await fetchOffers();
    } catch (err: any) {
      console.error("Error deleting offer:", err);
      alert(err?.response?.data?.message || "Could not delete offer.");
    }
  };

  const now = new Date();
  const activeOffers = offers.filter((o) => new Date(o.validTo) >= now);
  const pastOffers = offers.filter((o) => new Date(o.validTo) < now);

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getOfferServiceNames = (offer: Offer) => {
    if (!offer.servicesAppliedOn || !services.length) return "All included services";
    const ids = offer.servicesAppliedOn.map((s) =>
      typeof s === "string" ? s : s._id
    );
    const names = services
      .filter((s) => ids.includes(s._id))
      .map((s) => s.name)
      .filter(Boolean);
    if (!names.length) return "All included services";
    if (names.length <= 3) return names.join(", ");
    return `${names.slice(0, 3).join(", ")} +${names.length - 3} more`;
  };

  return (
    <>
      <PageWrapper>
        <TabBar type="business" />

        <ContentWrapper>
          {/* Header */}
          <HeaderRow>
            <WelcomeText>Welcome Back!</WelcomeText>

            <DateAndButton>
              <DateBox>
                {IconFix(FiCalendar, { size: 18 })}
                {today}
              </DateBox>

              <PrimaryButton onClick={() => navigate("/business/bookings")}>
                + New Booking
              </PrimaryButton>

              <PrimaryButton onClick={handleNewOffer}>+ Add Offer</PrimaryButton>
            </DateAndButton>
          </HeaderRow>

          {/* Top stats */}
          <StatsRow>
            <StatCard>
              <StatTitle>TODAY&apos;S BOOKINGS</StatTitle>
              <StatValue>18</StatValue>
              <StatSubText>3 pending confirmation</StatSubText>
            </StatCard>

            <StatCard>
              <StatTitle>NEW CLIENTS</StatTitle>
              <StatValue>5</StatValue>
              <StatSubText>+2 from last week</StatSubText>
            </StatCard>

            <StatCard>
              <StatTitle>COMPLETION RATE</StatTitle>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {IconFix(AiOutlineCheckSquare, { size: 20 })}
                <StatValue>94%</StatValue>
              </div>
              <StatSubText>+3% this month</StatSubText>
            </StatCard>
          </StatsRow>

          {/* Appointments + Popular services */}
          <SectionGrid>
            <Card>
              <SectionTitle>Upcoming Appointments</SectionTitle>
              {appointments.map((appt) => (
                <AppointmentContainer key={appt.time}>
                  <AppointmentRow status={appt.status as "CONFIRMED" | "CANCELLED"}>
                    <div>
                      <strong>{appt.time}</strong> — {appt.name}
                      <div style={{ fontSize: "13px", color: "#7a7a7a" }}>
                        {appt.service}
                      </div>
                    </div>
                    <span className="status">{appt.status}</span>
                  </AppointmentRow>
                </AppointmentContainer>
              ))}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "12px",
                  fontSize: "14px",
                  color: "#27374d",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/business/bookings")}
              >
                View All Appointments →
              </div>
            </Card>

            <Card>
              <SectionTitle>Popular Services</SectionTitle>
              {popularServices.map((service) => (
                <ProgressBarWrapper key={service.name}>
                  <ProgressRow>
                    <span>{service.name}</span>
                    <span style={{ color: "#7a7a7a" }}>
                      {service.bookings} bookings
                    </span>
                  </ProgressRow>
                  <ProgressBar percent={(service.bookings / 45) * 100} />
                </ProgressBarWrapper>
              ))}
            </Card>
          </SectionGrid>

          {/* Quick stats */}
          <Card>
            <SectionTitle>Quick Stats</SectionTitle>
            <QuickStatsGrid>
              <QuickStatItem>
                <QuickStatLabel>WEEKLY REVENUE</QuickStatLabel>
                <QuickStatValue>$8,045</QuickStatValue>
              </QuickStatItem>

              <QuickStatItem>
                <QuickStatLabel>AVG. RATING</QuickStatLabel>
                <RatingRow>
                  {IconFix(AiFillStar, { size: 18 })}
                  <QuickStatValue>4.8</QuickStatValue>
                </RatingRow>
              </QuickStatItem>

              <QuickStatItem>
                <QuickStatLabel>TOTAL CLIENTS</QuickStatLabel>
                <QuickStatValue>342</QuickStatValue>
              </QuickStatItem>

              <QuickStatItem>
                <QuickStatLabel>STAFF MEMBERS</QuickStatLabel>
                <QuickStatValue>8</QuickStatValue>
              </QuickStatItem>
            </QuickStatsGrid>
          </Card>

          {/* Offers management */}
          <Card>
            <SectionTitle>
              Offers{" "}
              <span style={{ fontSize: 12, color: "#777", fontWeight: 400 }}>
                (Create, edit, delete, and view past offers)
              </span>
            </SectionTitle>

            {loadingOffers ? (
              <div style={{ fontSize: 13, color: "#777" }}>Loading offers…</div>
            ) : offers.length === 0 ? (
              <div style={{ fontSize: 13, color: "#777" }}>
                You haven&apos;t created any offers yet. Click{" "}
                <strong>+ Add Offer</strong> to create your first one.
              </div>
            ) : (
              <>
                {/* Active offers */}
                {activeOffers.length > 0 && (
                  <>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#27374d",
                        marginBottom: 6,
                      }}
                    >
                      Active Offers
                    </div>
                    <OfferList>
                      {activeOffers.map((offer) => (
                        <OfferItem key={offer._id}>
                          <OfferHeaderRow>
                            <div>
                              <OfferTitle>
                                {offer.title}{" "}
                                <span style={{ fontSize: 12, fontWeight: 400 }}>
                                  · {offer.discountPercent}% off
                                </span>
                              </OfferTitle>
                              <OfferMeta>
                                {formatDate(offer.validFrom)} –{" "}
                                {formatDate(offer.validTo)}
                              </OfferMeta>
                            </div>
                            <div
                              style={{ display: "flex", gap: 8, alignItems: "center" }}
                            >
                              <Chip variant="active">Active</Chip>
                              <OfferActions>
                                <SmallButton onClick={() => handleEditOffer(offer)}>
                                  Edit
                                </SmallButton>
                                <SmallButton onClick={() => handleDeleteOffer(offer)}>
                                  Delete
                                </SmallButton>
                              </OfferActions>
                            </div>
                          </OfferHeaderRow>
                          <OfferServicesText>
                            Services: {getOfferServiceNames(offer)}
                          </OfferServicesText>
                        </OfferItem>
                      ))}
                    </OfferList>
                  </>
                )}

                {/* Past offers */}
                {pastOffers.length > 0 && (
                  <>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#27374d",
                        marginTop: 18,
                        marginBottom: 6,
                      }}
                    >
                      Past Offers
                    </div>
                    <OfferList>
                      {pastOffers.map((offer) => (
                        <OfferItem key={offer._id}>
                          <OfferHeaderRow>
                            <div>
                              <OfferTitle>
                                {offer.title}{" "}
                                <span style={{ fontSize: 12, fontWeight: 400 }}>
                                  · {offer.discountPercent}% off
                                </span>
                              </OfferTitle>
                              <OfferMeta>
                                {formatDate(offer.validFrom)} –{" "}
                                {formatDate(offer.validTo)}
                              </OfferMeta>
                            </div>
                            <div
                              style={{ display: "flex", gap: 8, alignItems: "center" }}
                            >
                              <Chip variant="past">Ended</Chip>
                              <OfferActions>
                                <SmallButton onClick={() => handleEditOffer(offer)}>
                                  Duplicate / Edit
                                </SmallButton>
                                <SmallButton onClick={() => handleDeleteOffer(offer)}>
                                  Delete
                                </SmallButton>
                              </OfferActions>
                            </div>
                          </OfferHeaderRow>
                          <OfferServicesText>
                            Services: {getOfferServiceNames(offer)}
                          </OfferServicesText>
                        </OfferItem>
                      ))}
                    </OfferList>
                  </>
                )}
              </>
            )}

            {loadingServices && (
              <div style={{ fontSize: 11, color: "#999", marginTop: 8 }}>
                Loading services for offers…
              </div>
            )}
          </Card>
        </ContentWrapper>
      </PageWrapper>

      {showOfferPopup && (
        <OfferPopup
          onClose={() => setShowOfferPopup(false)}
          onSaved={fetchOffers}
          services={services}
          existingOffer={editingOffer || undefined}
        />
      )}
    </>
  );
};

export default BusinessDashboard;
