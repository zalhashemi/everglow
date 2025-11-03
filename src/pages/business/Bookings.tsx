import React, { useState } from 'react';
import styled from 'styled-components';
import TabBar from '../../components/common/TabBar';
import BookingTile from '../../components/common/BookingTile';
import Button from '../../components/common/Button';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl};
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.xxlarge};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FilterBar = styled.div`
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.xl};
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const DateFilter = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const NoBookings = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.large};
`;

const BusinessBookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data
  const upcomingBookings = [
    {
      id: 1,
      businessName: "Elegant Beauty Salon",
      serviceName: "Haircut & Styling",
      date: new Date("2025-11-10T10:00:00"),
      time: "10:00 AM",
      duration: "45 min",
      status: "upcoming" as const,
      price: 50,
    },
    {
      id: 2,
      businessName: "Elegant Beauty Salon",
      serviceName: "Hair Coloring",
      date: new Date("2025-11-10T14:00:00"),
      time: "2:00 PM",
      duration: "2 hrs",
      status: "upcoming" as const,
      price: 120,
    }
  ];

  const completedBookings = [
    {
      id: 3,
      businessName: "Elegant Beauty Salon",
      serviceName: "Manicure",
      date: new Date("2025-11-03T11:00:00"),
      time: "11:00 AM",
      duration: "1 hr",
      status: "completed" as const,
      price: 35,
    }
  ];

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Bookings' },
    { id: 'completed', label: 'Completed Bookings' },
    { id: 'cancelled', label: 'Cancelled Bookings' }
  ];

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentBookings = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingBookings;
      case 'completed':
        return completedBookings;
      case 'cancelled':
        return [];
      default:
        return [];
    }
  };

  const handleStatusUpdate = (bookingId: number, newStatus: string) => {
    // Handle booking status update logic
    console.log('Update booking status:', bookingId, newStatus);
  };

  return (
    <Container>
      <Content>
        <Header>
          <Title>Bookings</Title>
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Header>

        <FilterBar>
          <DateFilter>
            <Button
              variant="outline"
              onClick={() => handleDateChange(-1)}
            >
              Previous Day
            </Button>
            <Button variant="primary">
              {formatDate(selectedDate)}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDateChange(1)}
            >
              Next Day
            </Button>
          </DateFilter>
        </FilterBar>

        {getCurrentBookings().length > 0 ? (
          getCurrentBookings().map(booking => (
            <BookingTile
              key={booking.id}
              {...booking}
              onReschedule={
                booking.status === 'upcoming'
                  ? () => handleStatusUpdate(booking.id, 'rescheduled')
                  : undefined
              }
              onCancel={
                booking.status === 'upcoming'
                  ? () => handleStatusUpdate(booking.id, 'cancelled')
                  : undefined
              }
            />
          ))
        ) : (
          <NoBookings>
            No {activeTab} bookings found for this date.
          </NoBookings>
        )}
      </Content>
    </Container>
  );
};

export default BusinessBookings;