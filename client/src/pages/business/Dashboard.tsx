import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import { AiOutlineCheckSquare, AiFillStar } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { IconFix } from "../../utils/IconFix";
import api from "../../utils/api";
import AlertPopup from "../../components/common/AlertPopup";

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

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface Booking {
  _id: string;
  business?: string;
  customer?: {
    _id?: string;
    fullName?: string;
    name?: string;
    email?: string;
  };
  services?: Array<
    | string
    | {
        _id: string;
        name?: string;
        durationMinutes?: number;
      }
  >;
  startTime: string;
  endTime?: string;
  status: BookingStatus;
  notes?: string;
}

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
  };
}

/* ---------- Styled Components ---------- */

const PageWrapper = styled.div`
  background-color: ${(p) => p.theme.colors.background || "#FAF6EA"};
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

const AppointmentRow = styled.div<{ status: BookingStatus }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #333;

  span.status {
    font-weight: 600;
    text-transform: capitalize;
    color: ${(p) =>
      p.status === "confirmed"
        ? "#3FAE57"
        : p.status === "completed"
        ? "#4b78db"
        : p.status === "cancelled"
        ? "#E03B3B"
        : "#E0A800"};
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
    ${(p) =>
      p.variant === "active" ? "#3FAE57" : p.variant === "past" ? "#aaa" : "#ddd"};
  color: ${(p) =>
    p.variant === "active" ? "#3FAE57" : p.variant === "past" ? "#666" : "#555"};
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

const InlineError = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #d10000;
  font-weight: 600;
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

/* ---------- Reviews ---------- */

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReviewItem = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ReviewAuthor = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #27374d;
`;

const ReviewDate = styled.div`
  font-size: 12px;
  color: #999;
`;

const ReviewComment = styled.div`
  font-size: 13px;
  color: #555;
  margin-top: 4px;
  white-space: pre-wrap;
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

  // inline validation error under title
  const [validationError, setValidationError] = useState("");
  // popup for API error
  const [popup, setPopup] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!name.trim() || !discount || !start || !end) {
      setValidationError("Please fill all required fields.");
      return;
    }

    setValidationError("");

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
      setPopup({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Something went wrong while saving the offer.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PopupOverlay onClick={onClose}>
        <PopupCard onClick={(e) => e.stopPropagation()}>
          <PopupTitle>
            {existingOffer ? "Edit Offer" : "Create New Offer"}
          </PopupTitle>

          {validationError && <InlineError>{validationError}</InlineError>}

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
              <Input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Services Included in Offer</Label>
            {services.length === 0 ? (
              <div style={{ fontSize: 12, color: "#777" }}>
                You have no services yet. Add services first to attach them to
                offers.
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

      {popup && (
        <AlertPopup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    </>
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

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Quick stats (from /business/dashboard-stats)
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [totalClients, setTotalClients] = useState<number | null>(null);
  const [staffMembers, setStaffMembers] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Global popup for this dashboard
  const [popup, setPopup] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const todayString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // 1) BOOKINGS
  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await api.get("/bookings/business");
      const data: Booking[] = res.data || [];
      setBookings(data);
      console.log("Dashboard bookings from DB:", data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const todaysBookings = useMemo(() => {
    if (!bookings.length) return [];

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return bookings.filter((b) => {
      const d = new Date(b.startTime);
      return d >= start && d <= end;
    });
  }, [bookings]);

  const popularServices = useMemo(() => {
    const counts: Record<string, number> = {};
    todaysBookings.forEach((b) => {
      const firstService = Array.isArray(b.services) ? b.services[0] : null;

      let name = "Service";
      if (firstService && typeof firstService === "object" && firstService.name) {
        name = firstService.name;
      }

      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, bookings]) => ({ name, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [todaysBookings]);

  const maxPopularBookings =
    popularServices.reduce((max, s) => Math.max(max, s.bookings), 0) || 1;

  const todaysBookingsCount = todaysBookings.length;
  const pendingBookingsCount = todaysBookings.filter(
    (b) => b.status === "pending"
  ).length;
  const completedBookingsCount = todaysBookings.filter(
    (b) => b.status === "completed"
  ).length;
  const cancelledBookingsCount = todaysBookings.filter(
    (b) => b.status === "cancelled"
  ).length;
  const completionRate =
    todaysBookingsCount > 0
      ? (completedBookingsCount / todaysBookingsCount) * 100
      : 0;

  // 2) SERVICES
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

  // 3) OFFERS
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

  // 4) QUICK STATS
  const fetchQuickStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get("/business/dashboard-stats");
      const data = res.data || {};

      setAvgRating(typeof data.avgRating === "number" ? data.avgRating : 0);
      setTotalClients(
        typeof data.totalClients === "number" ? data.totalClients : 0
      );
      setStaffMembers(
        typeof data.staffMembers === "number" ? data.staffMembers : 0
      );

      console.log("Dashboard quick stats from DB:", data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  // 5) REVIEWS
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await api.get("/business/reviews");
      const data: Review[] = res.data || [];
      setReviews(data);
      console.log("Dashboard reviews from DB:", data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchOffers();
    fetchBookings();
    fetchQuickStats();
    fetchReviews();
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
      setPopup({
        type: "success",
        message: "Offer deleted successfully.",
      });
    } catch (err: any) {
      console.error("Error deleting offer:", err);
      setPopup({
        type: "error",
        message: err?.response?.data?.message || "Could not delete offer.",
      });
    }
  };

  const now = new Date();
  const activeOffers = offers.filter((o) => new Date(o.validTo) >= now);
  const pastOffers = offers.filter((o) => new Date(o.validTo) < now);

  const formatDate = (iso?: string) => {
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
    if (!offer.servicesAppliedOn || !services.length)
      return "All included services";
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

  const getCustomerName = (b: Booking) => {
    const c = b.customer;
    if (!c) return "Customer";
    return c.fullName || c.name || c.email || "Customer";
  };

  const getServiceLabel = (b: Booking) => {
    const firstService = Array.isArray(b.services) ? b.services[0] : null;
    if (!firstService) return "Service";

    if (typeof firstService === "string") {
      return "Service";
    }

    const name = firstService.name || "Service";
    const duration =
      typeof firstService.durationMinutes === "number"
        ? `${firstService.durationMinutes} min`
        : "";
    return duration ? `${name} • ${duration}` : name;
  };

  const getReviewAuthor = (r: Review) => {
    if (!r.customer) return "Anonymous";
    const { firstName, lastName } = r.customer;
    const full = [firstName, lastName].filter(Boolean).join(" ");
    return full || "Anonymous";
  };

  const limitedReviews = reviews.slice(0, 4);

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
                {todayString}
              </DateBox>

              <PrimaryButton onClick={handleNewOffer}>
                + Add Offer
              </PrimaryButton>
            </DateAndButton>
          </HeaderRow>

          {/* Top stats */}
          <StatsRow>
            <StatCard>
              <StatTitle>TODAY&apos;S BOOKINGS</StatTitle>
              <StatValue>{todaysBookingsCount}</StatValue>
              <StatSubText>
                {pendingBookingsCount} pending confirmation
              </StatSubText>
            </StatCard>

            <StatCard>
              <StatTitle>COMPLETED TODAY</StatTitle>
              <StatValue>{completedBookingsCount}</StatValue>
              <StatSubText>{cancelledBookingsCount} cancelled</StatSubText>
            </StatCard>

            <StatCard>
              <StatTitle>COMPLETION RATE</StatTitle>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {IconFix(AiOutlineCheckSquare, { size: 20 })}
                <StatValue>{completionRate.toFixed(0)}%</StatValue>
              </div>
              <StatSubText>Based on today&apos;s bookings</StatSubText>
            </StatCard>
          </StatsRow>

          {/* Appointments + Popular services */}
          <SectionGrid>
            <Card>
              <SectionTitle>Today&apos;s Appointments</SectionTitle>

              {loadingBookings ? (
                <div style={{ fontSize: 13, color: "#777" }}>
                  Loading today&apos;s appointments…
                </div>
              ) : todaysBookings.length === 0 ? (
                <div style={{ fontSize: 13, color: "#777" }}>
                  No appointments for today yet.
                </div>
              ) : (
                todaysBookings.map((appt) => {
                  const d = new Date(appt.startTime);
                  const timeString = d.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <AppointmentContainer key={appt._id}>
                      <AppointmentRow status={appt.status}>
                        <div>
                          <strong>{timeString}</strong> —{" "}
                          {getCustomerName(appt)}
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#7a7a7a",
                            }}
                          >
                            {getServiceLabel(appt)}
                          </div>
                        </div>
                        <span className="status">{appt.status}</span>
                      </AppointmentRow>
                    </AppointmentContainer>
                  );
                })
              )}

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
              <SectionTitle>Popular Services (today)</SectionTitle>
              {popularServices.length === 0 ? (
                <div style={{ fontSize: 13, color: "#777" }}>
                  No bookings data yet.
                </div>
              ) : (
                popularServices.map((service) => (
                  <ProgressBarWrapper key={service.name}>
                    <ProgressRow>
                      <span>{service.name}</span>
                      <span style={{ color: "#7a7a7a" }}>
                        {service.bookings} bookings
                      </span>
                    </ProgressRow>
                    <ProgressBar
                      percent={(service.bookings / maxPopularBookings) * 100}
                    />
                  </ProgressBarWrapper>
                ))
              )}
            </Card>
          </SectionGrid>

          {/* Quick stats */}
          <Card>
            <SectionTitle>Quick Stats</SectionTitle>

            {loadingStats ? (
              <div style={{ fontSize: 13, color: "#777" }}>
                Loading quick stats…
              </div>
            ) : (
              <QuickStatsGrid>
                <QuickStatItem>
                  <QuickStatLabel>AVG. RATING</QuickStatLabel>
                  <RatingRow>
                    {IconFix(AiFillStar, { size: 18 })}
                    <QuickStatValue>
                      {avgRating !== null ? avgRating.toFixed(1) : "--"}
                    </QuickStatValue>
                  </RatingRow>
                </QuickStatItem>

                <QuickStatItem>
                  <QuickStatLabel>TOTAL CLIENTS</QuickStatLabel>
                  <QuickStatValue>
                    {totalClients !== null ? totalClients : "--"}
                  </QuickStatValue>
                </QuickStatItem>

                <QuickStatItem>
                  <QuickStatLabel>STAFF MEMBERS</QuickStatLabel>
                  <QuickStatValue>
                    {staffMembers !== null ? staffMembers : "--"}
                  </QuickStatValue>
                </QuickStatItem>
              </QuickStatsGrid>
            )}
          </Card>

          {/* Recent Reviews */}
          <Card>
            <SectionTitle>Recent Reviews</SectionTitle>

            {loadingReviews ? (
              <div style={{ fontSize: 13, color: "#777" }}>
                Loading reviews…
              </div>
            ) : limitedReviews.length === 0 ? (
              <div style={{ fontSize: 13, color: "#777" }}>
                You don&apos;t have any reviews yet.
              </div>
            ) : (
              <ReviewList>
                {limitedReviews.map((review) => (
                  <ReviewItem key={review._id}>
                    <ReviewHeader>
                      <ReviewAuthor>{getReviewAuthor(review)}</ReviewAuthor>
                      <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
                    </ReviewHeader>
                    <RatingRow>
                      {IconFix(AiFillStar, { size: 14 })}
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {review.rating.toFixed(1)} / 5
                      </span>
                    </RatingRow>
                    {review.comment && (
                      <ReviewComment>{review.comment}</ReviewComment>
                    )}
                  </ReviewItem>
                ))}
              </ReviewList>
            )}
          </Card>

          {/* Offers management */}
          <Card>
            <SectionTitle>
              Offers{" "}
              <span
                style={{ fontSize: 12, color: "#777", fontWeight: 400 }}
              >
                (Create, edit, delete, and view past offers)
              </span>
            </SectionTitle>

            {loadingOffers ? (
              <div style={{ fontSize: 13, color: "#777" }}>
                Loading offers…
              </div>
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
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 400,
                                  }}
                                >
                                  · {offer.discountPercent}% off
                                </span>
                              </OfferTitle>
                              <OfferMeta>
                                {formatDate(offer.validFrom)} –{" "}
                                {formatDate(offer.validTo)}
                              </OfferMeta>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                              }}
                            >
                              <Chip variant="active">Active</Chip>
                              <OfferActions>
                                <SmallButton
                                  onClick={() => handleEditOffer(offer)}
                                >
                                  Edit
                                </SmallButton>
                                <SmallButton
                                  onClick={() => handleDeleteOffer(offer)}
                                >
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
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 400,
                                  }}
                                >
                                  · {offer.discountPercent}% off
                                </span>
                              </OfferTitle>
                              <OfferMeta>
                                {formatDate(offer.validFrom)} –{" "}
                                {formatDate(offer.validTo)}
                              </OfferMeta>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                              }}
                            >
                              <Chip variant="past">Ended</Chip>
                              <OfferActions>
                                <SmallButton
                                  onClick={() => handleEditOffer(offer)}
                                >
                                  Duplicate / Edit
                                </SmallButton>
                                <SmallButton
                                  onClick={() => handleDeleteOffer(offer)}
                                >
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

      {popup && (
        <AlertPopup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    </>
  );
};

export default BusinessDashboard;
