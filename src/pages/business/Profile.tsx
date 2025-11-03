import React, { useState } from 'react';
import styled from 'styled-components';
import ProfileHeader from '../../components/common/ProfileHeader';
import TabBar from '../../components/common/TabBar';
import TextBox from '../../components/common/TextBox';
import Button from '../../components/common/Button';
import StaffCard from '../../components/common/StaffCard';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.div`
  max-width: 1000px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
`;

const StaffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.medium};
  width: 100%;
  max-width: 500px;
`;

const BusinessProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [businessData, setBusinessData] = useState({
    name: 'Elegant Beauty Salon',
    description: 'Premier beauty salon offering top-quality services',
    phone: '+1 234 567 8900',
    email: 'contact@elegantbeauty.com',
    website: 'www.elegantbeauty.com',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    openingHours: '9:00 AM',
    closingHours: '8:00 PM'
  });

  const [staff, setStaff] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Senior Stylist',
      image: 'https://example.com/staff1.jpg',
      specialties: ['Haircut', 'Coloring'],
      rating: 4.9
    },
    // Add more staff members
  ]);

  const [newStaffData, setNewStaffData] = useState({
    name: '',
    role: '',
    image: '',
    specialties: '',
    rating: ''
  });

  const handleBusinessUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle business update logic
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff = {
      id: (staff.length + 1).toString(),
      name: newStaffData.name,
      role: newStaffData.role,
      image: newStaffData.image,
      specialties: newStaffData.specialties.split(',').map(s => s.trim()),
      rating: parseFloat(newStaffData.rating)
    };
    setStaff([...staff, newStaff]);
    setShowStaffModal(false);
  };

  const tabs = [
    { id: 'profile', label: 'Business Profile' },
    { id: 'staff', label: 'Staff Management' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <Container>
      <ProfileHeader
        name={businessData.name}
        image="https://example.com/business-logo.jpg"
        coverImage="https://example.com/business-cover.jpg"
        stats={[
          { label: 'Bookings', value: '1.2k+' },
          { label: 'Reviews', value: '4.8★' },
          { label: 'Services', value: '15+' }
        ]}
      />

      <Content>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'profile' && (
          <Section>
            <SectionTitle>Business Information</SectionTitle>
            <Form onSubmit={handleBusinessUpdate}>
              <TextBox
                placeholder="Business Name"
                value={businessData.name}
                onChange={(e) => setBusinessData(prev => ({ ...prev, name: e.target.value }))}
              />
              
              <TextBox
                placeholder="Description"
                value={businessData.description}
                onChange={(e) => setBusinessData(prev => ({ ...prev, description: e.target.value }))}
              />

              <Grid>
                <TextBox
                  placeholder="Phone"
                  value={businessData.phone}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, phone: e.target.value }))}
                />
                <TextBox
                  placeholder="Email"
                  value={businessData.email}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, email: e.target.value }))}
                />
              </Grid>

              <TextBox
                placeholder="Website"
                value={businessData.website}
                onChange={(e) => setBusinessData(prev => ({ ...prev, website: e.target.value }))}
              />

              <TextBox
                placeholder="Address"
                value={businessData.address}
                onChange={(e) => setBusinessData(prev => ({ ...prev, address: e.target.value }))}
              />

              <Grid>
                <TextBox
                  placeholder="City"
                  value={businessData.city}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, city: e.target.value }))}
                />
                <TextBox
                  placeholder="State"
                  value={businessData.state}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, state: e.target.value }))}
                />
              </Grid>

              <TextBox
                placeholder="ZIP Code"
                value={businessData.zipCode}
                onChange={(e) => setBusinessData(prev => ({ ...prev, zipCode: e.target.value }))}
              />

              <Grid>
                <TextBox
                  placeholder="Opening Hours"
                  value={businessData.openingHours}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, openingHours: e.target.value }))}
                />
                <TextBox
                  placeholder="Closing Hours"
                  value={businessData.closingHours}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, closingHours: e.target.value }))}
                />
              </Grid>

              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </Section>
        )}

        {activeTab === 'staff' && (
          <Section>
            <SectionTitle>
              Staff Members
              <Button onClick={() => setShowStaffModal(true)}>
                Add Staff Member
              </Button>
            </SectionTitle>
            
            <StaffGrid>
              {staff.map(member => (
                <StaffCard
                  key={member.id}
                  {...member}
                />
              ))}
            </StaffGrid>
          </Section>
        )}

        {showStaffModal && (
          <Modal>
            <ModalContent>
              <SectionTitle>Add Staff Member</SectionTitle>
              <Form onSubmit={handleAddStaff}>
                <TextBox
                  placeholder="Name"
                  value={newStaffData.name}
                  onChange={(e) => setNewStaffData(prev => ({ ...prev, name: e.target.value }))}
                />
                <TextBox
                  placeholder="Role"
                  value={newStaffData.role}
                  onChange={(e) => setNewStaffData(prev => ({ ...prev, role: e.target.value }))}
                />
                <TextBox
                  placeholder="Image URL"
                  value={newStaffData.image}
                  onChange={(e) => setNewStaffData(prev => ({ ...prev, image: e.target.value }))}
                />
                <TextBox
                  placeholder="Specialties (comma-separated)"
                  value={newStaffData.specialties}
                  onChange={(e) => setNewStaffData(prev => ({ ...prev, specialties: e.target.value }))}
                />
                <TextBox
                  placeholder="Rating"
                  type="number"
                  value={newStaffData.rating}
                  onChange={(e) => setNewStaffData(prev => ({ ...prev, rating: e.target.value }))}
                />
                <Button variant="primary" type="submit">
                  Add Staff Member
                </Button>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </Content>
    </Container>
  );
};

export default BusinessProfile;