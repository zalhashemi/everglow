import React from "react";
import styled from "styled-components";

interface PopupProps {
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Modal = styled.div`
  background: #ffffff;
  width: 420px;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.2s ease-out;
  text-align: center;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0px); }
  }
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #4a5074;   /* theme secondary color */
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 15px;
  color: #333;
  margin-bottom: 24px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
`;

const SecondaryButton = styled.button`
  background: #e6e6e6;
  color: #444;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #d9d9d9;
  }
`;

const PrimaryButton = styled.button`
  background: #7a0000; /* dark theme red */
  color: #fff;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #a30000;
  }
`;

const Popup: React.FC<PopupProps> = ({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}) => {
  return (
    <Overlay>
      <Modal>
        <Title>{title}</Title>
        <Description>{description}</Description>

        <ButtonRow>
          <SecondaryButton onClick={onSecondary}>
            {secondaryLabel}
          </SecondaryButton>

          <PrimaryButton onClick={onPrimary}>
            {primaryLabel}
          </PrimaryButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

export default Popup;
