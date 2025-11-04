import React from "react";
import styled from "styled-components";

// ---- Props ----
export interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// ---- Styles ----
const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing.lg};
  background: ${(p) => p.theme.colors.white};
  border-bottom: 2px solid ${(p) => p.theme.colors.background};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.lg};
`;

const TabButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  color: ${(p) =>
    p.active ? p.theme.colors.secondary : p.theme.colors.gray.dark};
  font-weight: ${(p) => (p.active ? 600 : 400)};
  border-bottom: 2px solid
    ${(p) => (p.active ? p.theme.colors.primary : "transparent")};
  padding-bottom: 6px;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

// ---- Component ----
const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <Bar>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          active={tab.id === activeTab}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </TabButton>
      ))}
    </Bar>
  );
};

export default TabBar;
