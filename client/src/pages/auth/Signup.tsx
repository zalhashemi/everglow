import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import SecondaryButton from "../../components/common/SecondaryButton";
import TextBox from "../../components/common/TextBox";

const PageWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #f2dcdc;
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
  color: #6b868f;
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
  width: 630px;
`;

const FullWidth = styled.div`
  width: 1270px;
`;

const ErrorText = styled.div`
  color: #b00020;
  font-size: 14px;
  margin-bottom: 4px;
`;

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCustomerSignup = async () => {
    setError(null);

    if (!acceptedTerms) {
      setError("You must agree to the terms & conditions.");
      return;
    }
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/customers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        // backend sends { message: "..." }
        setError(data.message || "Failed to sign up. Please try again.");
        return;
      }

      // Save token (so you can use it for authenticated requests later)
      if (data.token) {
        localStorage.setItem("customerToken", data.token);
      }

      // Optionally store customer info
      if (data.customer) {
        localStorage.setItem("customer", JSON.stringify(data.customer));
      }

      // Go to home after successful signup
      navigate("/home");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSignup = () => {
    // still just moves to business details flow for now
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
  );
};

export default Signup;
