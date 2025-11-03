import React, { useState } from 'react';
import styled from 'styled-components';
import ProfileHeader from '../../components/common/ProfileHeader';
import ServiceTile from '../../components/common/ServiceTile';
import StaffCard from '../../components/common/StaffCard';
import TimeCard from '../../components/common/TimeCard';
import TabBar from '../../components/common/TabBar';
import Button from '../../components/common/Button';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const Section = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.xlarge};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const BookingSummary = styled.div`
  border: 1px solid ${props => props.theme.colors.gray.medium};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.medium};
`;

const BusinessPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('services');

  // Mock data
  const businessData = {
    name: "Elegant Beauty Salon",
    coverImage: "https://example.com/cover.jpg",
    profileImage: "https://example.com/profile.jpg",
    stats: [
      { label: "Rating", value: "4.8" },
      { label: "Reviews", value: "256" },
      { label: "Bookings", value: "1.2k+" }
    ]
  };

  const services = [
    { id: "1", name: "Haircut", duration: "45 min", price: 50 },
    { id: "2", name: "Hair Coloring", duration: "2 hrs", price: 120 },
    { id: "3", name: "Styling", duration: "30 min", price: 40 }
  ];

  const staff = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Senior Stylist",
      image: "https://example.com/staff1.jpg",
      specialties: ["Haircut", "Coloring"],
      rating: 4.9
    },
    // Add more staff members
  ];

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM"
  ];

  const tabs = [
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'about', label: 'About' }
  ];

  return (
    <Container>
      <ProfileHeader
        name={businessData.name}
        image={businessData.profileImage}
        coverImage={businessData.coverImage}
        stats={businessData.stats}
      />

      <Content>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'services' && (
          <>
            <Section>
              <SectionTitle>Services</SectionTitle>
              <Grid>
                {services.map(service => (
                  <ServiceTile
                    key={service.id}
                    name={service.name}
                    duration={service.duration}
                    price={service.price}
                    selected={selectedService === service.id}
                    onClick={() => setSelectedService(service.id)}
                  />
                ))}
              </Grid>
            </Section>

            {selectedService && (
              <Section>
                <SectionTitle>Choose Your Stylist</SectionTitle>
                <Grid>
                  {staff.map(member => (
                    <StaffCard
                      key={member.id}
                      name={member.name}
                      role={member.role}
                      image={member.image}
                      specialties={member.specialties}
                      rating={member.rating}
                      selected={selectedStaff === member.id}
                      onClick={() => setSelectedStaff(member.id)}
                    />
                  ))}
                </Grid>
              </Section>
            )}

            {selectedStaff && (
              <Section>
                <SectionTitle>Choose Time</SectionTitle>
                <Grid>
                  {timeSlots.map(time => (
                    <TimeCard
                      key={time}
                      time={time}
                      available={true}
                      selected={selectedTime === time}
                      onClick={() => setSelectedTime(time)}
                    />
                  ))}
                </Grid>
              </Section>
            )}

            {selectedTime && (
              <BookingSummary>
                <SectionTitle>Booking Summary</SectionTitle>
                <SummaryItem>
                  <span>Service:</span>
                  <span>{services.find(s => s.id === selectedService)?.name}</span>
                </SummaryItem>
                <SummaryItem>
                  <span>Stylist:</span>
                  <span>{staff.find(s => s.id === selectedStaff)?.name}</span>
                </SummaryItem>
                <SummaryItem>
                  <span>Time:</span>
                  <span>{selectedTime}</span>
                </SummaryItem>
                <SummaryItem>
                  <span>Price:</span>
                  <span>${services.find(s => s.id === selectedService)?.price}</span>
                </SummaryItem>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {/* Handle booking confirmation */}}
                >
                  Confirm Booking
                </Button>
              </BookingSummary>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default BusinessPage;