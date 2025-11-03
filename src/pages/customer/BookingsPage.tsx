import React, { useState } from 'react';
import styled from 'styled-components';
import TabBar from '../../components/common/TabBar';
import BookingTile from '../../components/common/BookingTile';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl};
`;

const Content = styled.div`
  max-width: 800px;
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

const NoBookings = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.large};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-top: ${props => props.theme.spacing.xl};
`;

const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data
  const upcomingBookings = [
    {
      id: 1,
      businessName: "Elegant Beauty Salon",
      serviceName: "Haircut & Styling",
      date: new Date("2025-11-10T10:00:00"),
      time: "10:00 AM",
      duration: "45 min",
      status: "upcoming",
      price: 50,
    },
    {
      id: 2,
      businessName: "Wellness Spa Center",
      serviceName: "Full Body Massage",
      date: new Date("2025-11-15T14:00:00"),
      time: "2:00 PM",
      duration: "60 min",
      status: "upcoming",
      price: 80,
    }
  ];

  const pastBookings = [
    {
      id: 3,
      businessName: "Elegant Beauty Salon",
      serviceName: "Hair Coloring",
      date: new Date("2025-10-20T11:00:00"),
      time: "11:00 AM",
      duration: "2 hrs",
      status: "completed",
      price: 120,
    },
    {
      id: 4,
      businessName: "Nail Art Studio",
      serviceName: "Manicure & Pedicure",
      date: new Date("2025-10-15T15:00:00"),
      time: "3:00 PM",
      duration: "90 min",
      status: "completed",
      price: 65,
    }
  ];

  const handleReschedule = (bookingId: number) => {
    // Handle reschedule logic
    console.log('Reschedule booking:', bookingId);
  };

  const handleCancel = (bookingId: number) => {
    // Handle cancel logic
    console.log('Cancel booking:', bookingId);
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Bookings' },
    { id: 'past', label: 'Past Bookings' }
  ];

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <Container>
      <Content>
        <Header>
          <Title>My Bookings</Title>
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Header>

        {currentBookings.length > 0 ? (
          currentBookings.map((booking: any) => (
            <BookingTile
              key={booking.id}
              businessName={booking.businessName}
              serviceName={booking.serviceName}
              date={booking.date}
              time={booking.time}
              duration={booking.duration}
              status={booking.status}
              price={booking.price}
              onReschedule={
                booking.status === 'upcoming' 
                  ? () => handleReschedule(booking.id)
                  : undefined
              }
              onCancel={
                booking.status === 'upcoming'
                  ? () => handleCancel(booking.id)
                  : undefined
              }
            />
          ))
        ) : (
          <NoBookings>
            {activeTab === 'upcoming' 
              ? "You don't have any upcoming bookings."
              : "You don't have any past bookings."
            }
          </NoBookings>
        )}
      </Content>
    </Container>
  );
};

export default BookingsPage;