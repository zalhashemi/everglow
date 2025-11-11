import React from "react";
import styled from "styled-components";
import SecondaryButton from "../../components/common/SecondaryButton";
import Button from "../../components/common/Button";

const Container = styled.div`
  background-color: #f9ecec;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
`;

const Logo = styled.h2`
  font-weight: 700;
  color: #5a5a5a;
`;

const Nav = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  a {
    color: #444;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;

    &:hover {
      color: #ff69b4;
    }
  }
`;

const Main = styled.div`
  padding: 40px 48px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #444;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const StatTitle = styled.p`
  font-size: 14px;
  color: #777;
  margin-bottom: 8px;
`;

const StatValue = styled.h3`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

const SubText = styled.p`
  font-size: 13px;
  color: #777;
  margin-top: 4px;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const AppointmentRow = styled.div<{ status?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  span {
    font-size: 14px;
    color: #555;
  }

  .status {
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 13px;
    color: ${(p) =>
      p.status === "confirmed"
        ? "#155724"
        : p.status === "cancelled"
        ? "#721c24"
        : "#555"};
    background-color: ${(p) =>
      p.status === "confirmed"
        ? "#d4edda"
        : p.status === "cancelled"
        ? "#f8d7da"
        : "#eee"};
  }
`;

const ProgressBarContainer = styled.div`
  background-color: #f0f0f0;
  height: 6px;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 4px;
`;

const ProgressBarFill = styled.div<{ width: number }>`
  height: 100%;
  background-color: #5a6acf;
  width: ${(p) => p.width}%;
  border-radius: 4px;
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  gap: 16px;
  margin-top: 24px;
`;

const QuickStatItem = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const Dashboard: React.FC = () => {
  const appointments = [
    { time: "09:00 AM", name: "Sarah Johnson", service: "Haircut • 60 min", status: "confirmed" },
    { time: "10:30 AM", name: "Mike Chen", service: "Hair Coloring • 120 min", status: "confirmed" },
    { time: "01:00 PM", name: "Emily Davis", service: "Manicure • 45 min", status: "cancelled" },
    { time: "03:00 PM", name: "James Wilson", service: "Massage • 90 min", status: "confirmed" },
  ];

  const popularServices = [
    { name: "Haircut", bookings: 45 },
    { name: "Hair Coloring", bookings: 32 },
    { name: "Manicure", bookings: 28 },
    { name: "Facial", bookings: 22 },
    { name: "Massage", bookings: 18 },
  ];

  return (
    <Container>
      <Header>
        <Logo>EVERGLOW</Logo>
        <Nav>
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">Bookings</a>
          <a href="#">Profile</a>
          <Button width="130px">+ New Booking</Button>
        </Nav>
      </Header>

      <Main>
        <Title>Welcome Back!</Title>

        {/* Top Stats */}
        <StatGrid>
          <StatCard>
            <StatTitle>TODAY’S BOOKINGS</StatTitle>
            <StatValue>18</StatValue>
            <SubText>3 pending confirmation</SubText>
          </StatCard>

          <StatCard>
            <StatTitle>NEW CLIENTS</StatTitle>
            <StatValue>5</StatValue>
            <SubText>+2 from last week</SubText>
          </StatCard>

          <StatCard>
            <StatTitle>COMPLETION RATE</StatTitle>
            <StatValue>94%</StatValue>
            <SubText>+3% this month</SubText>
          </StatCard>
        </StatGrid>

        {/* Main Two Columns */}
        <SectionGrid>
          {/* Upcoming Appointments */}
          <Card>
            <CardTitle>Upcoming Appointments</CardTitle>
            {appointments.map((appt, idx) => (
              <AppointmentRow key={idx} status={appt.status}>
                <span>
                  <strong>{appt.time}</strong> — {appt.name} ({appt.service})
                </span>
                <span className="status">{appt.status.toUpperCase()}</span>
              </AppointmentRow>
            ))}
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <SecondaryButton width="fit-content">
                View All Appointments →
              </SecondaryButton>
            </div>
          </Card>

          {/* Popular Services */}
          <Card>
            <CardTitle>Popular Services</CardTitle>
            {popularServices.map((s, i) => (
              <div key={i} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    color: "#555",
                    fontWeight: 500,
                  }}
                >
                  <span>{s.name}</span>
                  <span>{s.bookings} bookings</span>
                </div>
                <ProgressBarContainer>
                  <ProgressBarFill width={(s.bookings / 45) * 100} />
                </ProgressBarContainer>
              </div>
            ))}
          </Card>
        </SectionGrid>

        {/* Quick Stats */}
        <Card style={{ marginTop: "40px" }}>
          <CardTitle>Quick Stats</CardTitle>
          <QuickStatsGrid>
            <QuickStatItem>
              <p className="text-sm text-gray-500">WEEKLY REVENUE</p>
              <h3>$8,045</h3>
            </QuickStatItem>
            <QuickStatItem>
              <p className="text-sm text-gray-500">AVG. RATING</p>
              <h3>⭐ 4.8</h3>
            </QuickStatItem>
            <QuickStatItem>
              <p className="text-sm text-gray-500">TOTAL CLIENTS</p>
              <h3>342</h3>
            </QuickStatItem>
            <QuickStatItem>
              <p className="text-sm text-gray-500">STAFF MEMBERS</p>
              <h3>8</h3>
            </QuickStatItem>
          </QuickStatsGrid>
        </Card>
      </Main>
    </Container>
  );
};

export default Dashboard;
