import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import logo from "../../images/everglowLogo.png";

export type TabType = "customer" | "business";

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-bottom: 1px solid #e4e4e4;
  height: 80px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const Logo = styled.img`
  
  height: 140px;
  object-fit: contain;
  cursor: pointer;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 0 12px;
  width: 700px;
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
    margin-right: 4px;
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

interface TabBarProps {
  type: TabType;
  initialSearchValue?: string;
  onSearchSubmit?: (value: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({
  type,
  initialSearchValue = "",
  onSearchSubmit,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState(initialSearchValue);

  const customerTabs = [
    { id: "home", label: "Home", path: "/home" },
    { id: "search", label: "Search", path: "/search" },
    { id: "bookings", label: "My Bookings", path: "/bookings" },
    { id: "profile", label: "My Profile", path: "/profile" },
  ];

  const businessTabs = [
    { id: "dashboard", label: "Home", path: "/business/dashboard" },
    { id: "services", label: "Services", path: "/business/services" },
    { id: "bookings", label: "Bookings", path: "/business/bookings" },
    { id: "loyalty", label: "Loyalty", path: "/business/loyalty" },
    { id: "profile", label: "Profile", path: "/business/profile" },
  ];

  const tabs = type === "customer" ? customerTabs : businessTabs;
  const activePath = location.pathname;

  const handleSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const trimmed = searchValue.trim();
      if (!trimmed) return;

      if (onSearchSubmit) {
        onSearchSubmit(trimmed);
      } else {
        navigate(`/search?query=${encodeURIComponent(trimmed)}`);
      }
    }
  };

  const handleSearchFocus = () => {
    if (type === "customer" && location.pathname !== "/search") {
      navigate("/search");
    }
  };

  return (
    <Bar>
      <LeftSection>
        <Logo
          src={logo}
          alt="Everglow Logo"
          onClick={() => navigate(type === "customer" ? "/home" : "/business/dashboard")}
        />

        {type === "customer" && (
          <SearchBox>
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Enter Salon/Barber or City Name"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={handleSearchFocus} // 👈 open map immediately
            />
          </SearchBox>
        )}
      </LeftSection>

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