import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import logo from "../../images/everglowLogo.png";

export type TabType = "customer" | "business";

// ---- Styles ----
const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-bottom: 1px solid #e4e4e4;
  height: 80px;
  width: 100%;
  padding: 0 60px;
  box-sizing: border-box;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Logo = styled.img`
  width: 285px;
  height: 70px;
  object-fit: contain;
  cursor: pointer;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 0 12px;
  width: 903px;
  height: 40px;

  input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    color: #333;
  }

  svg {
    color: #888;
    margin-right: 8px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
`;

const TabButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  font-family: "Inter", sans-serif;
  font-size: 15px;
  color: ${(p) => (p.active ? "#0B1C36" : "#333")};
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease-in-out;

  &:hover {
    color: #76949f;
  }
`;

// ---- Component ----
interface TabBarProps {
  type: TabType; // "customer" | "business"
}

const TabBar: React.FC<TabBarProps> = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const customerTabs = [
    { id: "home", label: "Home", path: "/" },
    { id: "bookings", label: "My Bookings", path: "/bookings" },
    { id: "profile", label: "My Profile", path: "/profile" },
  ];

  const businessTabs = [
    { id: "dashboard", label: "Home", path: "/business" },
    { id: "services", label: "Services", path: "/business/services" },
    { id: "bookings", label: "Bookings", path: "/business/bookings" },
    { id: "profile", label: "Profile", path: "/business/profile" },
  ];

  const tabs = type === "customer" ? customerTabs : businessTabs;
  const activePath = location.pathname;

  return (
    <Bar>
      {/* Left Section — Logo and optional Search */}
      <LeftSection>
        <Logo
          src={logo}
          alt="Everglow Logo"
          onClick={() => navigate(type === "customer" ? "/" : "/business")}
        />

        {/* ✅ Show search bar only for customer view */}
        {type === "customer" && (
          <SearchBox>
            <FiSearch size={18} />
            <input type="text" placeholder="Enter Salon/Barber or City Name" />
          </SearchBox>
        )}
      </LeftSection>

      {/* Right Section — Tabs */}
      <RightSection>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activePath === tab.path}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </TabButton>
        ))}
      </RightSection>
    </Bar>
  );
};

export default TabBar;
