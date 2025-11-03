import React from 'react';
import styled from 'styled-components';
import BookingTile from '../../components/common/BookingTile';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: ${props => props.theme.spacing.xl};
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const SideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const Card = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.md};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xxlarge};
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.small};
  color: ${props => props.theme.colors.gray.dark};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.xlarge};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Chart = styled.div`
  width: 100%;
  height: 300px;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-top: ${props => props.theme.spacing.md};
  // Add actual chart implementation
`;

const BusinessDashboard: React.FC = () => {
  // Mock data
  const todayBookings = [
    {
      id: 1,
      businessName: "Elegant Beauty Salon",
      serviceName: "Haircut & Styling",
      date: new Date(),
      time: "10:00 AM",
      duration: "45 min",
      status: "upcoming" as "upcoming" | "completed" | "cancelled",
      price: 50,
    },
    // Add more bookings
  ];

  return (
    <Container>
      <Content>
        <MainSection>
          <Card>
            <StatsGrid>
              <StatCard>
                <StatValue>24</StatValue>
                <StatLabel>Today's Bookings</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>$1,250</StatValue>
                <StatLabel>Today's Revenue</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>89%</StatValue>
                <StatLabel>Occupancy Rate</StatLabel>
              </StatCard>
            </StatsGrid>
          </Card>

          <Card>
            <SectionTitle>Revenue Overview</SectionTitle>
            <Chart />
          </Card>

          <Card>
            <SectionTitle>Today's Schedule</SectionTitle>
            {todayBookings.map(booking => (
              <BookingTile
                key={booking.id}
                {...booking}
              />
            ))}
          </Card>
        </MainSection>

        <SideSection>
          <Card>
            <SectionTitle>Quick Actions</SectionTitle>
            {/* Add quick action buttons */}
          </Card>

          <Card>
            <SectionTitle>Popular Services</SectionTitle>
            {/* Add popular services list */}
          </Card>

          <Card>
            <SectionTitle>Recent Reviews</SectionTitle>
            {/* Add recent reviews list */}
          </Card>
        </SideSection>
      </Content>
    </Container>
  );
};

export default BusinessDashboard;