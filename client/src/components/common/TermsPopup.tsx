import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Box = styled.div`
  width: 750px;
  max-height: 80vh;
  background: #ffffff;
  border-radius: 14px;
  padding: 28px;
  overflow-y: auto;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.25);

  h2 {
    margin-top: 0;
    margin-bottom: 14px;
    font-size: 26px;
    color: #4A5174;
  }
`;

const CloseButton = styled.button`
  background: #4A5174;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 18px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

interface Props {
  open: boolean;
  onClose: () => void;
  filePath: string;  
}

const TermsPopup: React.FC<Props> = ({ open, onClose, filePath }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      fetch(filePath)
        .then((res) => res.text())
        .then((data) => setText(data))
        .catch(() => setText("Failed to load Terms & Conditions."));
    }
  }, [open, filePath]);

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        <h2>Terms & Conditions</h2>

        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.45" }}>
          {text}
        </div>

        <CloseButton onClick={onClose}>Close</CloseButton>
      </Box>
    </Overlay>
  );
};

export default TermsPopup;
