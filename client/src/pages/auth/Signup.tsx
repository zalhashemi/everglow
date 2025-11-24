import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import SecondaryButton from "../../components/common/SecondaryButton";
import TextBox from "../../components/common/TextBox";
import TermsPopup from "../../components/common/TermsPopup";

const PageWrapper = styled.div`
  width: 100vw;
  min-height: 125vh;
  background: #faf6ea;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
`;

const FormContainer = styled.div`
  width: 990px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Title = styled.h2`
  color: #4a5174;
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

  span {
    color: #6b868f;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BottomText = styled.div`
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 14px;
  color: #333;

  span {
    color: #6b868f;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const HalfWidth = styled.div`
  width: 495px;
`;

const FullWidth = styled.div`
  width: 990px;
`;

const ErrorText = styled.div`
  color: #b00020;
  font-size: 14px;
  margin-bottom: 4px;
`;

const Subtitle = styled.div`
  font-size: 12px;
  margin-top: 4px;
  color: #555;
`;

const TogglePassword = styled.span`
  cursor: pointer;
  font-size: 13px;
  color: #4a5174;
  display: inline-block;
  margin-top: 4px;
`;

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===================== VALIDATION =======================
  const validateFields = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!nameRegex.test(firstName)) {
      setError(
        "First name must contain only letters with no spaces or special characters."
      );
      return false;
    }

    if (!nameRegex.test(lastName)) {
      setError(
        "Last name must contain only letters with no spaces or special characters."
      );
      return false;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, and 1 number."
      );
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (!acceptedTerms) {
      setError("You must agree to the terms & conditions.");
      return false;
    }

    return true;
  };

  // ===================== CUSTOMER SIGNUP =======================
  const handleCustomerSignup = async () => {
    setError(null);

    if (!validateFields()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/customers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to sign up. Please try again.");
        return;
      }

      if (data.token) {
        localStorage.setItem("customerToken", data.token);
      }

      if (data.customer) {
        localStorage.setItem("customer", JSON.stringify(data.customer));
      }

      navigate("/home");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ===================== BUSINESS SIGNUP =======================
  const handleBusinessSignup = () => {
    // For businesses we don't reuse these customer fields anymore,
    // so no need to validate them here. They will enter their
    // business email + password directly in the business registration form.
    setError(null);
    navigate("/register/business-details");
  };

  return (
    <>
      <PageWrapper>
        <FormContainer>
          <Title>Sign Up</Title>

          {error && <ErrorText>{error}</ErrorText>}

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
              type={showPassword ? "text" : "password"}
              placeholder="Placeholder"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Subtitle>
              • At least 8 characters • 1 uppercase • 1 lowercase • 1 number
            </Subtitle>

            <TogglePassword
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </TogglePassword>
          </FullWidth>

          <FullWidth>
            <Label>Confirm Password</Label>
            <TextBox
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Placeholder"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <TogglePassword
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? "Hide Password" : "Show Password"}
            </TogglePassword>
          </FullWidth>

          <TermsRow>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            Agree to{" "}
            <span onClick={() => setShowTerms(true)}>terms & conditions</span>
          </TermsRow>

          <Button fullWidth onClick={handleCustomerSignup} disabled={loading}>
            {loading ? "Signing you up..." : "I am a Customer"}
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

      <TermsPopup
        open={showTerms}
        onClose={() => setShowTerms(false)}
        filePath="/terms_and_conditions.txt"
      />
    </>
  );
};

export default Signup;
