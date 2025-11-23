import React, { useEffect } from "react";
import styled from "styled-components";

interface AlertPopupProps {
  type?: "error" | "success"; // NEW
  title?: string;             // optional now
  message: string;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

const Modal = styled.div<{ isError: boolean }>`
  background: #ffffff;
  width: 380px;
  padding: 26px;
  border-radius: 16px;
  text-align: center;
  animation: fadeIn 0.25s ease-out;
  border-top: ${(p) => (p.isError ? "6px solid #d10000" : "6px solid #4a5174")};

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0px); }
  }
`;

const Title = styled.h3<{ isError: boolean }>`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 12px;
  color: ${(p) => (p.isError ? "#d10000" : "#4a5074")};
`;

const Message = styled.p`
  font-size: 15px;
  color: #333;
  margin-bottom: 22px;
`;

const OkButton = styled.button<{ isError: boolean }>`
  background: ${(p) => (p.isError ? "#d10000" : "#4a5174")};
  color: white;
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${(p) => (p.isError ? "#b30000" : "#3d4464")};
  }
`;

const AlertPopup: React.FC<AlertPopupProps> = ({
  type = "success",
  title,
  message,
  onClose,
}) => {

  const isError = type === "error";

  // Auto-close in 5 sec
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Overlay>
      <Modal isError={isError}>
        {/* Title only shown for errors or if explicitly passed */}
        {isError || title ? (
          <Title isError={isError}>{title || "ERROR"}</Title>
        ) : null}

        <Message>{message}</Message>

        <OkButton isError={isError} onClick={onClose}>
          OK
        </OkButton>
      </Modal>
    </Overlay>
  );
};

export default AlertPopup;
