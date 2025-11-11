import React from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  width?: string;
  backgroundColor?: string;
  onClick?: () => void;
}

const StyledSecondaryButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: ${(props) => props.width || "fit-content"};
  padding: 0 24px;
  border-radius: 10px;
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
  background-color: transparent;
  border: 2px solid ${(props) => props.theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}15;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton: React.FC<ButtonProps> = ({
  width,
  backgroundColor,
  children,
  onClick,
  ...props
}) => {
  return (
    <StyledSecondaryButton
      width={width}
      backgroundColor={backgroundColor}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledSecondaryButton>
  );
};

export default SecondaryButton;
