import React, { useState } from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #FAF6EA;
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


const SmallLink = styled.span`
  color: #6b868f;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const BottomText = styled.div`
  margin-top: 24px;
  font-size: 14px;
  color: #333;
  text-align: left;

  span {
    color: #6b868f;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
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
  color: #b00020;
  font-size: 14px;
  margin-top: -4px;
`;

const RoleToggle = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
`;

const RoleButton = styled.button<{ active?: boolean }>`
  border-radius: 999px;
  padding: 6px 12px;
  border: 1px solid ${(p) => (p.active ? "#6b868f" : "#ccc")};
  background: ${(p) => (p.active ? "#6b868f" : "transparent")};
  color: ${(p) => (p.active ? "#fff" : "#333")};
  cursor: pointer;
  font-size: 13px;
  font-family: "Inter", sans-serif;

  &:hover {
    opacity: 0.9;
  }
`;

type LoginMode = "customer" | "business";

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<LoginMode>("customer");
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

      const endpoint =
        mode === "customer"
          ? "http://localhost:5000/api/customers/login"
          : "http://localhost:5000/api/business/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (mode === "customer") {
        // Save customer auth
        if (data.token) localStorage.setItem("customerToken", data.token);
        if (data.customer) {
          localStorage.setItem("customer", JSON.stringify(data.customer));
        }

        window.location.href = "/home";
      } else {
        // BUSINESS LOGIN
        if (data.token) localStorage.setItem("businessToken", data.token);
        if (data.business) {
          localStorage.setItem("businessInfo", JSON.stringify(data.business));
          // ✅ this is what loyalty & dashboard should use
          localStorage.setItem("businessId", data.business._id);
        }

        window.location.href = "/business";
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Title>Log In</Title>

        {/* toggle between customer / business */}
        <RoleToggle>
          <span>Login as:</span>
          <RoleButton
            type="button"
            active={mode === "customer"}
            onClick={() => setMode("customer")}
          >
            Customer
          </RoleButton>
          <RoleButton
            type="button"
            active={mode === "business"}
            onClick={() => setMode("business")}
          >
            Business
          </RoleButton>
        </RoleToggle>

        {error && <ErrorText>{error}</ErrorText>}

        <Label>Email Address</Label>
        <input
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
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
            fontSize: "16px",
          }}
          placeholder="Placeholder"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <span style={{ fontSize: "12px", color: "#666" }}>
          It must be a combination of minimum 8 letters, numbers, and symbols.
        </span>

        <Button fullWidth disabled={loading} onClick={handleLogin}>
          {loading
            ? mode === "customer"
              ? "Logging in..."
              : "Logging in as business..."
            : mode === "customer"
            ? "Log In"
            : "Log In as Business"}
        </Button>

        <BottomText>
          No account yet?{" "}
          <span
            onClick={() =>
              (window.location.href =
                mode === "customer" ? "/signup" : "/signup")
            }
          >
            {mode === "customer" ? "Sign Up" : "Register your business"}
          </span>
        </BottomText>
      </FormContainer>
    </PageWrapper>
  );
};

export default LoginPage;
