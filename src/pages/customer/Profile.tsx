// import React, { useState } from 'react';
// import styled from 'styled-components';
// import ProfileHeader from '../../components/common/ProfileHeader';
// import TabBar from '../../components/common/TabBar';
// import TextBox from '../../components/common/TextBox';
// import Button from '../../components/common/Button';
// import LoyaltyTile from '../../components/common/LoyaltyTile';

// const Container = styled.div`
//   min-height: 100vh;
//   background-color: ${props => props.theme.colors.background};
// `;

// const Content = styled.div`
//   max-width: 800px;
//   margin: 0 auto;
//   padding: ${props => props.theme.spacing.xl};
// `;

// const Section = styled.div`
//   background: ${props => props.theme.colors.white};
//   border-radius: ${props => props.theme.borderRadius.medium};
//   padding: ${props => props.theme.spacing.xl};
//   margin-bottom: ${props => props.theme.spacing.xl};
// `;

// const SectionTitle = styled.h2`
//   color: ${props => props.theme.colors.secondary};
//   font-size: ${props => props.theme.typography.fontSizes.xlarge};
//   margin-bottom: ${props => props.theme.spacing.lg};
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: ${props => props.theme.spacing.md};
// `;

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: ${props => props.theme.spacing.md};
// `;

// const CustomerProfile: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('profile');
//   const [profileData, setProfileData] = useState({
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'john.doe@example.com',
//     phone: '+1 234 567 8900',
//     address: '123 Main St',
//     city: 'New York',
//     state: 'NY',
//     zipCode: '10001',
//   });

//   const loyaltyData = {
//     points: 450,
//     level: 'Gold Member',
//     nextLevel: 'Platinum',
//     pointsToNext: 550,
//     rewards: [
//       'Free service after 10 bookings',
//       '10% off on all spa services',
//       'Priority booking',
//       'Special birthday rewards'
//     ]
//   };

//   const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // TODO: Implement profile update logic
//     console.log('Profile update submitted:', profileData);
//   };

//   const tabs = [
//     { id: 'profile', label: 'Profile Details' },
//     { id: 'loyalty', label: 'Loyalty & Rewards' },
//     { id: 'preferences', label: 'Preferences' }
//   ];

//   return (
//     <Container>
//       <ProfileHeader
//         name={`${profileData.firstName} ${profileData.lastName}`}
//         image="https://example.com/profile.jpg"
//         stats={[
//           { label: 'Bookings', value: '24' },
//           { label: 'Reviews', value: '12' },
//           { label: 'Points', value: loyaltyData.points.toString() }
//         ]}
//       />

//       <Content>
//         <TabBar
//           tabs={tabs}
//           activeTab={activeTab}
//           onTabChange={setActiveTab}
//         />

//         {activeTab === 'profile' && (
//           <Section>
//             <SectionTitle>Personal Information</SectionTitle>
//             <Form onSubmit={handleProfileUpdate}>
//               <Grid>
//                 <TextBox
//                   placeholder="First Name"
//                   value={profileData.firstName}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
//                 />
//                 <TextBox
//                   placeholder="Last Name"
//                   value={profileData.lastName}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
//                 />
//               </Grid>

//               <TextBox
//                 type="email"
//                 placeholder="Email"
//                 value={profileData.email}
//                 onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
//               />

//               <TextBox
//                 placeholder="Phone Number"
//                 value={profileData.phone}
//                 onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
//               />

//               <TextBox
//                 placeholder="Address"
//                 value={profileData.address}
//                 onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
//               />

//               <Grid>
//                 <TextBox
//                   placeholder="City"
//                   value={profileData.city}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
//                 />
//                 <TextBox
//                   placeholder="State"
//                   value={profileData.state}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
//                 />
//               </Grid>

//               <TextBox
//                 placeholder="ZIP Code"
//                 value={profileData.zipCode}
//                 onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
//               />

//               <Button variant="primary" type="submit">
//                 Save Changes
//               </Button>
//             </Form>
//           </Section>
//         )}

//         {activeTab === 'loyalty' && (
//           <Section>
//             <SectionTitle>Loyalty Program</SectionTitle>
//             <LoyaltyTile
//               points={loyaltyData.points}
//               level={loyaltyData.level}
//               nextLevel={loyaltyData.nextLevel}
//               pointsToNext={loyaltyData.pointsToNext}
//               rewards={loyaltyData.rewards}
//             />
//           </Section>
//         )}

//         {activeTab === 'preferences' && (
//           <Section>
//             <SectionTitle>Notification Preferences</SectionTitle>
//             {/* Add notification preferences UI here */}
//           </Section>
//         )}
//       </Content>
//     </Container>
//   );
// };

// export default CustomerProfile;