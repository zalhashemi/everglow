import React from "react";
import styled from "styled-components";
import TabBar from "../../components/common/TabBar";
import ProfileHeader from "../../components/common/ProfileHeader";
import LoyaltyTile from "../../components/common/LoyaltyTile";
import TextBox from "../../components/common/TextBox";
import Button from "../../components/common/Button";

/* ---- Styled Wrappers ---- */
const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background}; /* ✅ Theme background */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 60px 0; /* ✅ top + bottom padding */
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const LoyaltyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* ---- Component ---- */
const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);

  // 🧍 Mock user data
  const user = {
    name: "Enid Sinclair",
    bookings: 32,
    visited: 9,
    loyaltyPrograms: 3,
    salonName: "Glamour Beauty Salon",
    email: "contact@glamoursalon.com",
    phone: "+1 (555) 123-4567",
    loyalty: [
      {
        id: 1,
        name: "Hair Avenue",
        location: "Lakewood, California",
        rating: 4.7,
        reviews: 312,
        offer: "FREE BLOWDRY",
        filledCircles: 2,
        totalCircles: 5,
        distance: "2 wk",
      },
      {
        id: 2,
        name: "Hair Avenue",
        location: "Lakewood, California",
        rating: 4.7,
        reviews: 312,
        offer: "25% OFF HAIR TREATMENT",
        filledCircles: 3,
        totalCircles: 5,
        distance: "3 wk",
      },
      {
        id: 3,
        name: "Hair Avenue",
        location: "Lakewood, California",
        rating: 4.7,
        reviews: 312,
        offer: "ONE NAIL SERVICE FREE",
        filledCircles: 4,
        totalCircles: 5,
        distance: "4 wk",
      },
    ],
  };

  return (
    <PageWrapper>
      {/* ✅ Add the customer tab bar */}
      <TabBar type="customer" />

      <ContentWrapper>
        {/* ---------- Profile Header ---------- */}
        <ProfileHeader
          type="customer"
          name={user.name}
          stat1={user.bookings}
          stat2={user.visited}
          stat3={user.loyaltyPrograms}
        />

        {/* ---------- Personal Information ---------- */}
        <Card>
          <HeaderRow>
            <SectionTitle>Personal Information</SectionTitle>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                borderRadius: "8px",
                width: "auto",
              }}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </HeaderRow>

          {/* Input fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <TextBox
              label="Name"
              value={user.salonName}
              readOnly={!isEditing}
              onChange={() => {}}
            />
            <TextBox
              label="Phone"
              value={user.phone}
              readOnly={!isEditing}
              onChange={() => {}}
            />
            <div style={{ gridColumn: "1 / span 2" }}>
              <TextBox
                label="Email"
                value={user.email}
                readOnly={!isEditing}
                onChange={() => {}}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </Card>

        {/* ---------- Loyalty Programs ---------- */}
        <Card>
          <SectionTitle>My Loyalty Programs</SectionTitle>
          <LoyaltyList>
            {user.loyalty.map((item) => (
              <LoyaltyTile
                key={item.id}
                name={item.name}
                location={item.location}
                rating={item.rating}
                reviews={item.reviews}
                offer={item.offer}
                filledCircles={item.filledCircles}
                totalCircles={item.totalCircles}
                distance={item.distance}
              />
            ))}
          </LoyaltyList>
        </Card>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ProfilePage;
