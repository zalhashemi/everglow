import React from "react";
import styled from "styled-components";
import logo from "../../images/everglowLogo.png";

const FooterWrapper = styled.div`
  width: 100%;
  border-top: 2px solid #76949F;
  padding: 20px 0;
  position: relative;
  margin-top: 40px;
`;

const Logo = styled.img`
  display: block;
  margin: 0 auto;
  width: auto;      
  height: 100px;
  object-fit: contain;
`;

const Copyright = styled.div`
  position: absolute;
  right: 20px;
  bottom: 8px;
  font-size: 12px;
  color: #555;
  font-family: "Inter", sans-serif;
`;

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <Logo src={logo} alt="Everglow Logo" />
      <Copyright>© 2025 everglow.com</Copyright>
    </FooterWrapper>
  );
};

export default Footer;
