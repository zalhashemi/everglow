import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TabBar from "../../components/common/TabBar";
import ProfileHeader from "../../components/common/ProfileHeader";
import LoyaltyTile from "../../components/common/LoyaltyTile";
import TextBox from "../../components/common/TextBox";
import Button from "../../components/common/Button";
import Popup from "../../components/common/Popup";

/* ---- Styled Wrappers ---- */
const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 1300px;
  max-width: 1300px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 60px 0;
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

/* 🔥 LOGOUT BUTTON STYLES */
const LogoutButton = styled.button`
  background: #7a0000;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 14px 18px;
  width: 200px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
  margin-top: 10px;
  transition: 0.2s ease;

  &:hover {
    background: #a30000;
  }
`;

// Helper to parse "Name::Offer" strings coming from loyalty
const parseRewardString = (value: string) => {
  if (!value) return { name: "", offer: "" };
  const parts = value.split("::");
  if (parts.length >= 2) {
    return {
      name: parts[0] || "",
      offer: parts.slice(1).join("::") || "",
    };
  }
  return { name: value, offer: "" };
};

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [customer, setCustomer] = useState<any>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // NEW — loyalty programs + stats
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [visitedSalons, setVisitedSalons] = useState(0);

  /* ---------------- Load User Data + Stats + Loyalty ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem("customer");
    if (stored) {
      const data = JSON.parse(stored);
      setCustomer(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
    }

    const token = localStorage.getItem("customerToken");
    if (!token) return;

    // Fetch profile
    fetch("http://localhost:5000/api/customers/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        localStorage.setItem("customer", JSON.stringify(data));
      });

    // Fetch bookings to calculate stats
    fetch("http://localhost:5000/api/bookings/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((bookings) => {
        setTotalBookings(bookings.length);
        const uniqueSalonIds = new Set(
          bookings.map((b: any) => b.business?._id)
        );
        setVisitedSalons(uniqueSalonIds.size);
      });

    // Fetch loyalty programs
    fetch("http://localhost:5000/api/loyalty/customer/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((entries) => {
        if (Array.isArray(entries)) {
          setLoyaltyPrograms(entries);
        }
      });
  }, []);

  if (!customer) return <div style={{ padding: 40 }}>Loading...</div>;

  /* ---------------- Save Edited Profile ---------------- */
  const handleSave = async () => {
    const token = localStorage.getItem("customerToken");
    if (!token) return;

    const updates = { firstName, lastName, email };

    const res = await fetch("http://localhost:5000/api/customers/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (res.ok) {
      setCustomer(data.customer);
      localStorage.setItem("customer", JSON.stringify(data.customer));
      setIsEditing(false);
    } else {
      alert(data.message || "Failed to update profile");
    }
  };

  /* ---------------- Logout Logic ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");
    window.location.href = "/login";
  };

  return (
    <PageWrapper>
      <TabBar type="customer" /> {/* ✔ TOP BAR remains unchanged */}

      <ContentWrapper>
        {/* ---------- Profile Header (stats now real) ---------- */}
        <ProfileHeader
          type="customer"
          name={`${firstName} ${lastName}`}
          stat1={totalBookings}
          stat2={visitedSalons}
          stat3={loyaltyPrograms.length}
        />

        {/* ---------- Personal Info ---------- */}
        <Card>
          <HeaderRow>
            <SectionTitle>Personal Information</SectionTitle>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <TextBox
              label="First Name"
              value={firstName}
              readOnly={!isEditing}
              onChange={(e: any) => setFirstName(e.target.value)}
            />

            <TextBox
              label="Last Name"
              value={lastName}
              readOnly={!isEditing}
              onChange={(e: any) => setLastName(e.target.value)}
            />

            <div style={{ gridColumn: "1 / span 2" }}>
              <TextBox
                label="Email"
                value={email}
                readOnly={!isEditing}
                onChange={(e: any) => setEmail(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </Card>

        {/* ---------- Loyalty Programs (DB-linked) ---------- */}
        <Card>
          <SectionTitle>My Loyalty Programs</SectionTitle>
          <LoyaltyList>
            {loyaltyPrograms.length === 0 ? (
              <div style={{ color: "#999" }}>No loyalty programs yet</div>
            ) : (
              loyaltyPrograms.map((entry: any) => {
                // Prefer the first reward string, then fallback to rewardDescription
                const rawReward =
                  entry.business?.loyalty?.rewards?.[0] ||
                  entry.business?.loyalty?.rewardDescription ||
                  "";

                const parsed = parseRewardString(rawReward);

                const tileName =
                  parsed.name ||
                  entry.business?.businessName ||
                  "Salon";

                const tileOffer = parsed.offer || "Reward";

                return (
                <LoyaltyTile
  salon={entry.business?.businessName}   // NEW
  name={tileName}
  offer={tileOffer}
  filledCircles={entry.points}
  totalCircles={entry.business?.loyalty?.rewardThreshold || 5}
/>

                );
              })
            )}
          </LoyaltyList>
        </Card>

        {/* ---------- Logout Button ---------- */}
        <LogoutButton onClick={() => setShowLogoutPopup(true)}>
          Log Out
        </LogoutButton>

        {/* ---------- Popup Component ---------- */}
        {showLogoutPopup && (
          <Popup
            title="Log Out?"
            description="Are you sure you want to log out of your account?"
            primaryLabel="Log Out"
            secondaryLabel="Cancel"
            onPrimary={handleLogout}
            onSecondary={() => setShowLogoutPopup(false)}
          />
        )}
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ProfilePage;
