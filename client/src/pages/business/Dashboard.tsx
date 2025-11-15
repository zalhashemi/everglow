import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import { AiOutlineCheckSquare, AiFillStar } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { IconFix } from "../../utils/IconFix";

/* ---- Styled Components ---- */
const PageWrapper = styled.div`
  background-color: ${(p) => p.theme.colors.background || "#f2dcdc"};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ---- Offer Popup ---- */
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const PopupCard = styled.div`
  width: 420px;
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
`;

const SaveButton = styled.button`
  padding: 12px 0;
  background: #0b1c36;
  color: white;
  border: none;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
`;

interface OfferPopupProps {
  onClose: () => void;
}

const OfferPopup: React.FC<OfferPopupProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [services, setServices] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSave = () => {
    const newOffer = {
      name,
      discount: Number(discount),
      services,
      startDate: start,
      endDate: end,
      banner: "/default-image.png",
    };

    console.log("Saving Offer:", newOffer);
    onClose();
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupCard onClick={(e) => e.stopPropagation()}>
        <PopupTitle>Create New Offer</PopupTitle>

        <Input placeholder="Offer Name" value={name} onChange={(e) => setName(e.target.value)} />

        <Input placeholder="Services Applied On" value={services} onChange={(e) => setServices(e.target.value)} />

        <Input
          placeholder="Discount %"
          type="number"
          min="1"
          max="100"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>

        <SaveButton onClick={handleSave}>Save Offer</SaveButton>
      </PopupCard>
    </PopupOverlay>
  );
};

/* ---- Dashboard Layout ---- */
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
`;

const WelcomeText = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 40px;
  font-weight: 800;
  color: ${(p) => p.theme.colors.primary || "#0b1c36"};
`;

const DateAndButton = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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

const NewBookingButton = styled.button`
  background-color: ${(p) => p.theme.colors.primary || "#0b1c36"};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

/* ---- Top Stats ---- */
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

/* ---- Section Grid ---- */
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

/* ---- Popular Services ---- */
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

/* ---- Quick Stats ---- */
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

/* ---- Component ---- */
const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const appointments = [
    { time: "09:00 AM", name: "Sarah Johnson", service: "Haircut • 60 min", status: "CONFIRMED" },
    { time: "10:30 AM", name: "Mike Chen", service: "Hair Coloring • 120 min", status: "CONFIRMED" },
    { time: "01:00 PM", name: "Emily Davis", service: "Manicure • 45 min", status: "CANCELLED" },
    { time: "03:00 PM", name: "James Wilson", service: "Massage • 90 min", status: "CONFIRMED" },
  ];

  const popularServices = [
    { name: "Haircut", bookings: 45 },
    { name: "Hair Coloring", bookings: 32 },
    { name: "Manicure", bookings: 28 },
    { name: "Facial", bookings: 22 },
    { name: "Massage", bookings: 18 },
  ];

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

              <NewBookingButton onClick={() => navigate("/business/bookings")}>
                + New Booking
              </NewBookingButton>

              <NewBookingButton onClick={() => setShowOfferPopup(true)}>
                + Add Offer
              </NewBookingButton>
            </DateAndButton>
          </HeaderRow>

          {/* Top Stats */}
          <StatsRow>
            <StatCard>
              <StatTitle>TODAY'S BOOKINGS</StatTitle>
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
                {IconFix(AiOutlineCheckSquare, { color: "#3FAE57", size: 20 })}
                <StatValue>94%</StatValue>
              </div>
              <StatSubText>+3% this month</StatSubText>
            </StatCard>
          </StatsRow>

          {/* Appointments + Popular Services */}
          <SectionGrid>
            <Card>
              <SectionTitle>Upcoming Appointments</SectionTitle>
              {appointments.map((appt) => (
                <AppointmentContainer key={appt.time}>
                  <AppointmentRow status={appt.status as any}>
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

          {/* Quick Stats */}
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
                  {IconFix(AiFillStar, { color: "#FFD03F", size: 18 })}
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
        </ContentWrapper>
      </PageWrapper>

      {/* ---- OFFER POPUP ---- */}
      {showOfferPopup && (
        <OfferPopup onClose={() => setShowOfferPopup(false)} />
      )}
    </>
  );
};

export default BusinessDashboard;
