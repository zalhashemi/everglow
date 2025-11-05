import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from '../../components/common/Button';
import SecondaryButton from '../../components/common/SecondaryButton';
import TextBox from '../../components/common/TextBox';

const PageWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #F2DCDC;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
`;

const FormContainer = styled.div`
  width: 1270px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Title = styled.h2`
  color: #6B868F;
  font-family: "Inter", sans-serif;
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const TermsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0 8px;
  font-size: 14px;
`;

const BottomText = styled.div`
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,0.08);
  font-size: 14px;
  color: #333;

  span {
    color: #6B868F;
    cursor: pointer;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const HalfWidth = styled.div`
  width: 630px;
`;

const FullWidth = styled.div`
  width: 1270px;
`;

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleCustomerSignup = () => {
    if (!acceptedTerms) {
      alert("You must agree to the terms & conditions.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    navigate("/homepage");
  };

  const handleBusinessSignup = () => {
    if (!acceptedTerms) {
      alert("You must agree to the terms & conditions.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    navigate("/register/business-details");
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Title>Sign Up</Title>

        <Row>
          <HalfWidth>
            <Label>First Name</Label>
            <TextBox
              placeholder="Placeholder"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </HalfWidth>

          <HalfWidth>
            <Label>Last Name</Label>
            <TextBox
              placeholder="Placeholder"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </HalfWidth>
        </Row>

        <FullWidth>
          <Label>Email</Label>
          <TextBox
            placeholder="Placeholder"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FullWidth>

        <FullWidth>
          <Label>Password</Label>
          <TextBox
            type="password"
            placeholder="Placeholder"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FullWidth>

        <FullWidth>
          <Label>Confirm Password</Label>
          <TextBox
            type="password"
            placeholder="Placeholder"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FullWidth>

        <TermsRow>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          Agree to terms & conditions
        </TermsRow>

        <Button fullWidth onClick={handleCustomerSignup}>
          I am a Customer
        </Button>

        <Button
          fullWidth
          backgroundColor="#0B1C36"
          onClick={handleBusinessSignup}
        >
          I am a Business
        </Button>

        <BottomText>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </BottomText>
      </FormContainer>
    </PageWrapper>
  );
};

export default Signup;
