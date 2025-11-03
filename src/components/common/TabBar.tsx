import styled from 'styled-components';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.xs};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.gray.dark};
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes.medium};

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray.light};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <TabContainer>
      {tabs.map(tab => (
        <Tab
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </Tab>
      ))}
    </TabContainer>
  );
};

export default TabBar;