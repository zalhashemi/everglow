import React from "react";
import ProfileHeader from "../../components/common/ProfileHeader";
import LoyaltyTile from "../../components/common/LoyaltyTile";
import TextBox from "../../components/common/TextBox";
import Button from "../../components/common/Button";

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
    <div
      style={{
        width: "90%",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* ---------- Profile Header ---------- */}
      <ProfileHeader
        type="customer"
        name={user.name}
        stat1={user.bookings}
        stat2={user.visited}
        stat3={user.loyaltyPrograms}
      />

      {/* ---------- Personal Information ---------- */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#2D2D2D",
              margin: 0,
            }}
          >
            Personal Information
          </h2>

          {/* ✅ Button uses children instead of label */}
          <Button
  onClick={() => setIsEditing(!isEditing)}
  style={{
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "8px",
    width: "auto",
    alignSelf: "flex-start",
  }}
>
  {isEditing ? "Save" : "Edit"}
</Button>
        </div>

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
      </div>

      {/* ---------- Loyalty Programs ---------- */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#2D2D2D",
            marginBottom: "20px",
          }}
        >
          My Loyalty Programs
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
