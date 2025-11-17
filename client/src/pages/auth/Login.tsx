import React, { useState } from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f2dcdc;
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
  width: ${(p) => (p.fullWidth ? "100%" : "auto")};

  &:hover {
    opacity: 0.95;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: #B00020;
  font-size: 14px;
  margin-top: -4px;
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // Save authentication details
      if (data.token) localStorage.setItem("customerToken", data.token);
      if (data.customer)
        localStorage.setItem("customer", JSON.stringify(data.customer));

      // Redirect user
      window.location.href = "/home";

    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Title>Log In</Title>

        {error && <ErrorText>{error}</ErrorText>}

        <Label>Email Address</Label>
        <input
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px"
          }}
          placeholder="Placeholder"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Spacer />
        <Label>Password</Label>
        <input
          type="password"
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px"
          }}
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

        <Button fullWidth disabled={loading} onClick={handleLogin}>
          {loading ? "Logging in..." : "Log In"}
        </Button>

        <BottomText>
          No account yet? <span onClick={() => (window.location.href = "/signup")}>Sign Up</span>
        </BottomText>
      </FormContainer>
    </PageWrapper>
  );
};

export default LoginPage;
