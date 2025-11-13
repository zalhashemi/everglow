import React, { useState } from "react";
import styled from "styled-components";// your main button

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f2dcdc; /* pink background like your mockup */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  color: #6b868f;
  font-family: "Inter", sans-serif;
  font-size: 28px;
  margin-bottom: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: -8px;
`;

const RememberSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  margin-top: 6px;
`;

const SmallLink = styled.span`
  color: #6b868f;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const BottomText = styled.div`
  margin-top: 24px;
  font-size: 14px;
  color: #333;
  text-align: left;

  span {
    color: #6b868f;
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
`;

const Spacer = styled.div`
  height: 4px;
`;

const Button = styled.button<{ fullWidth?: boolean }>`
  background: #6b868f;
  color: #fff;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => (props.fullWidth ? "100%" : "auto")};

  &:hover {
    opacity: 0.95;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <PageWrapper>
      <FormContainer>
        <Title>Log In</Title>

        <Label>Email Address</Label>
        <input
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
          placeholder="Placeholder"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Spacer />
        <Label>Password</Label>
        <input
          type="password"
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
          placeholder="Placeholder"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span style={{ fontSize: "12px", color: "#666" }}>
          It must be a combination of minimum 8 letters, numbers, and symbols.
        </span>

        <RememberSection>
          <input type="checkbox" />
          Remember me
          <div style={{ flex: 1 }} />
          <SmallLink>Forgot Password?</SmallLink>
        </RememberSection>

        <Button fullWidth>Log In</Button>

        <BottomText>
          No account yet? <span>Sign Up</span>
        </BottomText>
      </FormContainer>
    </PageWrapper>
  );
};

export default LoginPage;
