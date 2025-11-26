import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
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

  @media (max-width: 1024px) {
    height: 70px;
    padding: 0 16px;
  }

  @media (max-width: 768px) {
    height: 85px;
    padding: 8px 12px;
    flex-wrap: wrap;
    align-items: center;
  }

  @media (max-width: 480px) {
    height: 80px;
    padding: 8px 10px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;

  @media (max-width: 768px) {
    gap: 8px;
    flex: 1;
    align-items: center;
  }
`;

const Logo = styled.img`
  height: 140px;
  object-fit: contain;
  cursor: pointer;

  @media (max-width: 1024px) {
    height: 120px;
  }

  @media (max-width: 768px) {
    height: 90px;
  }

  @media (max-width: 480px) {
    height: 70px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 0 12px;
  width: 580px;
  height: 40px;

  @media (max-width: 1200px) {
    width: 500px;
  }

  @media (max-width: 1024px) {
    width: 400px;
    height: 36px;
  }

  @media (max-width: 768px) {
    width: calc(100% - 24px);
    order: 3;
    margin-top: 6px;
    height: 36px;
  }

  @media (max-width: 480px) {
    height: 34px;
  }

  input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    color: #333;

    @media (max-width: 768px) {
      font-size: 13px;
    }
  }

  svg {
    color: #888;
    margin-right: 4px;

    @media (max-width: 768px) {
      margin-right: 6px;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;

  @media (max-width: 1024px) {
    gap: 24px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;

  @media (max-width: 1024px) {
    gap: 24px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #333;

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;

  @media (max-width: 900px) {
    display: ${(p) => (p.isOpen ? "flex" : "none")};
    position: fixed;
    top: 85px;
    right: 0;
    background: white;
    box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    padding: 16px 0;
    min-width: 200px;
    z-index: 1000;
    border-left: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
  }

  @media (max-width: 480px) {
    top: 80px;
  }
`;

const MobileTabButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  font-family: "Inter", sans-serif;
  font-size: 15px;
  color: ${(p) => (p.active ? "#0B1C36" : "#333")};
  font-weight: ${(p) => (p.active ? "700" : "500")};
  cursor: pointer;
  padding: 12px 24px;
  text-align: left;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #f5f5f5;
    color: #76949f;
  }
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
  white-space: nowrap;

  &:hover {
    color: #76949f;
  }

  @media (max-width: 1024px) {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleTabClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
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
              onFocus={handleSearchFocus}
            />
          </SearchBox>
        )}
      </LeftSection>

      <RightSection>
        <TabsContainer>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activePath === tab.path}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabsContainer>

        <HamburgerButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </HamburgerButton>
      </RightSection>

      <MobileMenu isOpen={isMobileMenuOpen}>
        {tabs.map((tab) => (
          <MobileTabButton
            key={tab.id}
            active={activePath === tab.path}
            onClick={() => handleTabClick(tab.path)}
          >
            {tab.label}
          </MobileTabButton>
        ))}
      </MobileMenu>
    </Bar>
  );
};

export default TabBar;