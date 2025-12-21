import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TabBar from "../../components/common/TabBar";
import ProfileHeader from "../../components/common/ProfileHeader";
import LoyaltyTile from "../../components/common/LoyaltyTile";
import TextBox from "../../components/common/TextBox";
import Button from "../../components/common/Button";
import Popup from "../../components/common/Popup";
import AlertPopup from "../../components/common/AlertPopup";
import { API_BASE } from "../../utils/config";

//styled wrappers
const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1300px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 60px 3%;

  @media (max-width: 1024px) {
    padding: 48px 4%;
    gap: 20px;
  }

  @media (max-width: 768px) {
    padding: 40px 5%;
    gap: 18px;
  }

  @media (max-width: 480px) {
    padding: 32px 5%;
    gap: 16px;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 10px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 14px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 14px;
    gap: 12px;
  }
`;

const LoyaltyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 14px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

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

  @media (max-width: 768px) {
    width: 180px;
    padding: 12px 16px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 14px;
    font-size: 14px;
    align-self: stretch;
  }
`;

const PersonalInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / span 2;

  @media (max-width: 640px) {
    grid-column: 1;
  }
`;

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

  const [loyaltyPrograms, setLoyaltyPrograms] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [visitedSalons, setVisitedSalons] = useState(0);

  const [alertData, setAlertData] = useState<{
    type: "error" | "success";
    title?: string;
    message: string;
  } | null>(null);

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

    fetch(`${API_BASE}/api/customers/me`, {
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

    fetch(`${API_BASE}/api/bookings/me`, {
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

    fetch(`${API_BASE}/api/loyalty/customer/me`, {
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

  const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return name.trim().length > 0 && nameRegex.test(name.trim());
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim().length > 0 && emailRegex.test(email.trim());
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "First name cannot be empty.",
      });
      return;
    }

    if (!validateName(firstName)) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "First name can only contain letters and spaces.",
      });
      return;
    }

    if (!lastName.trim()) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "Last name cannot be empty.",
      });
      return;
    }

    if (!validateName(lastName)) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "Last name can only contain letters and spaces.",
      });
      return;
    }

    if (!email.trim()) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "Email cannot be empty.",
      });
      return;
    }

    if (!validateEmail(email)) {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: "Please enter a valid email address.",
      });
      return;
    }

    const token = localStorage.getItem("customerToken");
    if (!token) return;

    const updates = { 
      firstName: firstName.trim(), 
      lastName: lastName.trim(), 
      email: email.trim() 
    };

    const res = await fetch(`${API_BASE}/api/customers/me`, {
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
      setAlertData({
        type: "success",
        message: "Profile updated successfully.",
      });
    } else {
      setAlertData({
        type: "error",
        title: "ERROR",
        message: data.message || "Failed to update profile",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");
    window.location.href = "/login";
  };

  return (
    <PageWrapper>
      <TabBar type="customer" /> 

      <ContentWrapper>
        <ProfileHeader
          type="customer"
          name={`${firstName} ${lastName}`}
          stat1={totalBookings}
          stat2={visitedSalons}
          stat3={loyaltyPrograms.length}
        />

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

          <PersonalInfoGrid>
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

            <FullWidthField>
              <TextBox
                label="Email"
                value={email}
                readOnly={!isEditing}
                onChange={(e: any) => setEmail(e.target.value)}
                style={{ width: "100%" }}
              />
            </FullWidthField>
          </PersonalInfoGrid>
        </Card>

        <Card>
          <SectionTitle>My Loyalty Programs</SectionTitle>
          <LoyaltyList>
            {loyaltyPrograms.length === 0 ? (
              <div style={{ color: "#999" }}>No loyalty programs yet</div>
            ) : (
              loyaltyPrograms.map((entry: any) => {
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
                    salon={entry.business?.businessName}
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

        <LogoutButton onClick={() => setShowLogoutPopup(true)}>
          Log Out
        </LogoutButton>

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
        {alertData && (
  <AlertPopup
    type={alertData.type}
    title={alertData.type === "error" ? "ERROR" : ""}
    message={alertData.message}
    onClose={() => setAlertData(null)}
  />
)}

      </ContentWrapper>
    </PageWrapper>
  );
};

export default ProfilePage;
