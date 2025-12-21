import React, { useState } from "react";
import styled from "styled-components";
import everglowLogo from "../../images/everglowLogo.png";

const PageWrapper = styled.div`
  width: 100vw;
  background: #faf6ea;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 0 16px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
  }
`;

const Header = styled.header`
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    height: 80px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    height: 70px;
    margin-bottom: 12px;
  }
`;

const Logo = styled.div`
  img {
    height: 140px;
    object-fit: contain;
    cursor: pointer;

    @media (max-width: 768px) {
      height: 100px;
    }

    @media (max-width: 480px) {
      height: 80px;
    }
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;

  @media (max-width: 768px) {
    align-items: flex-start;
    padding: 16px 0;
  }
`;

const FormContainer = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 500px;
    gap: 14px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const Title = styled.h2`
  color: #4a5174;
  font-family: "Inter", sans-serif;
  font-size: 28px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 4px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-family: "Inter", sans-serif;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const BottomText = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #faf6ea;
  border-radius: 8px;
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

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 12px;
    margin-top: 16px;
  }
`;

const Spacer = styled.div`
  height: 4px;
`;

const Button = styled.button<{ fullWidth?: boolean }>`
  background: #4a5174;
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

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 11px 14px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 12px;
  }
`;

const ErrorText = styled.div`
  color: #b00020;
  font-size: 14px;
  margin-top: -4px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }
`;

const RoleToggleButton = styled.button<{ active?: boolean; businessButton?: boolean }>`
  flex: 1;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none;
  background: ${(p) => 
    p.active
      ? p.businessButton 
        ? "#0B1C36" 
        : "#4a5174"
      : "#e5e5e5"
  };
  color: ${(p) => (p.active ? "#fff" : "#333")};
  font-family: "Inter", sans-serif;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    height: 46px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    height: 44px;
    width: 100%;
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
          ? "${API_BASE}/api/customers/login"
          : "${API_BASE}/api/business/login";

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
        if (data.token) localStorage.setItem("customerToken", data.token);
        if (data.customer) {
          localStorage.setItem("customer", JSON.stringify(data.customer));
        }

        window.location.href = "/home";
      } else {
        if (data.token) localStorage.setItem("businessToken", data.token);
        if (data.business) {
          localStorage.setItem("businessInfo", JSON.stringify(data.business));
          // used by loyalty & dashboard
          localStorage.setItem("businessId", data.business._id);
        }
        window.location.href = "/business/dashboard";
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
      <Header>
        <Logo onClick={() => (window.location.href = "/")}>
          <img src={everglowLogo} alt="EverGlow" />
        </Logo>
      </Header>

      <ContentWrapper>
        <FormContainer>
          <Title>Log In</Title>

          <ButtonRow>
            <RoleToggleButton
              type="button"
              active={mode === "customer"}
              onClick={() => setMode("customer")}
            >
              I am a Customer
            </RoleToggleButton>

            <RoleToggleButton
              type="button"
              active={mode === "business"}
              businessButton
              onClick={() => setMode("business")}
            >
              I am a Business
            </RoleToggleButton>
          </ButtonRow>

          {error && <ErrorText>{error}</ErrorText>}

          <Label>{mode === "business" ? "Business Email Address" : "Email Address"}</Label>
          <input
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
              width: "100%",
              boxSizing: "border-box",
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
              width: "100%",
              boxSizing: "border-box",
            }}
            placeholder="Placeholder"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            It must be a combination of minimum 8 letters, numbers, and symbols.
          </span>

          <Button fullWidth disabled={loading} onClick={handleLogin}>
            {loading ? "Logging in..." : "Log In"}
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
      </ContentWrapper>
    </PageWrapper>
  );
};

export default LoginPage;
