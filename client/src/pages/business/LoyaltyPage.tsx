import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TabBar from "../../components/common/TabBar";
import TextBox from "../../components/common/TextBox";
import Button from "../../components/common/Button";
import api from "../../utils/api";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f7f7fb;
`;

const Content = styled.div`
  max-width: 960px;
  margin: 32px auto;
  padding: 0 24px 48px;
`;

const HeaderRow = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 4px;
  color: #1f1f2b;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b6b7a;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  padding: 24px 28px 28px;
`;

const FormSection = styled.div`
  & + & {
    margin-top: 20px;
  }
`;

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #2f3142;

  input {
    width: 16px;
    height: 16px;
  }
`;

const SectionLabel = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px;
  color: #1f1f2b;
`;

const HelperText = styled.p`
  font-size: 12px;
  color: #8b8ba0;
  margin: 0 0 12px;
`;

const RewardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RewardRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 12px;
  align-items: flex-end;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

const FooterRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

const Message = styled.p<{ $type: "error" | "success" }>`
  font-size: 13px;
  margin-top: 12px;
  color: ${(props) => (props.$type === "error" ? "#d14b4b" : "#1f8f5f")};
`;

interface RewardFormRow {
  name: string;
  offer: string;
}

interface LoyaltyFormState {
  enabled: boolean;
  rewards: RewardFormRow[]; // we'll only ever use index 0
}

const parseRewardString = (value: string): RewardFormRow => {
  if (!value) return { name: "", offer: "" };
  const parts = value.split("::");
  if (parts.length >= 2) {
    return {
      name: parts[0] || "",
      offer: parts.slice(1).join("::") || "",
    };
  }
  return { name: value, offer: "" };
};

const LoyaltyPage: React.FC = () => {
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<LoyaltyFormState>({
    enabled: false,
    rewards: [{ name: "", offer: "" }], // single program
  });

  // 🔹 On mount: ask backend "who am I?" then load that business's loyalty
  useEffect(() => {
    const fetchBusinessAndLoyalty = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        // 1) get current logged-in business from token
        const meRes = await api.get("/business/me");
        const biz = meRes.data;
        if (!biz || !biz._id) {
          setError("Could not identify business. Please log in again.");
          setLoading(false);
          return;
        }

        const id = biz._id as string;
        setBusinessId(id);

        // 2) get loyalty for THIS business only
        const res = await api.get(`/loyalty/${id}`);

        if (res.data) {
          const rawRewards =
            Array.isArray(res.data.rewards) && res.data.rewards.length > 0
              ? res.data.rewards
              : [res.data.rewardDescription || ""];

          const parsedList = rawRewards
            .map((r: string) => parseRewardString(r))
            .filter((row: RewardFormRow) => row.name || row.offer);

          // ✅ only one program allowed → keep just the first one
          const firstRow =
            parsedList[0] || ({ name: "", offer: "" } as RewardFormRow);

          setForm({
            enabled: !!res.data.enabled,
            rewards: [firstRow],
          });
        }
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.status === 401 || err?.response?.status === 403
            ? "Please log in as a business to manage loyalty."
            : "Failed to load loyalty settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessAndLoyalty();
  }, []);

  const updateRewardField = (
    index: number,
    field: keyof RewardFormRow,
    value: string
  ) => {
    // We only care about index 0, but keep signature
    setForm((prev) => {
      const rewards = [...prev.rewards];
      const safeIndex = 0;
      rewards[safeIndex] = {
        ...rewards[safeIndex],
        [field]: value,
      };
      return { ...prev, rewards };
    });
    setError("");
    setSuccess("");
  };

  const handleToggleEnabled = (checked: boolean) => {
    setForm((prev) => ({ ...prev, enabled: checked }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!businessId) {
      setError("Business is not loaded. Please refresh and try again.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const singleRow = form.rewards[0] || { name: "", offer: "" };

      const cleaned = {
        name: singleRow.name.trim(),
        offer: singleRow.offer.trim(),
      };

      // Ensure there is at least something if enabled
      const hasContent = cleaned.name || cleaned.offer;

      const cleanedRewardString = hasContent
        ? `${cleaned.name}::${cleaned.offer}`
        : "";

      const payload = {
        enabled: form.enabled,
        type: "points",
        pointsPerBooking: 1,
        rewardThreshold: 5,
        rewardDescription: cleanedRewardString,
        expiryMonths: 0,
        rewards: cleanedRewardString ? [cleanedRewardString] : [],
      };

      const res = await api.put(`/loyalty/${businessId}`, payload);

      const returnedRewards =
        Array.isArray(res.data.rewards) && res.data.rewards.length > 0
          ? res.data.rewards
          : [res.data.rewardDescription || ""];

      const parsedList = returnedRewards
        .map((r: string) => parseRewardString(r))
        .filter((row: RewardFormRow) => row.name || row.offer);

      const firstRow =
        parsedList[0] || ({ name: "", offer: "" } as RewardFormRow);

      setForm({
        enabled: !!res.data.enabled,
        rewards: [firstRow],
      });

      setSuccess("Loyalty settings saved.");
    } catch (err) {
      console.error(err);
      setError("Failed to save loyalty settings.");
    } finally {
      setSaving(false);
    }
  };

  const singleReward = form.rewards[0] || { name: "", offer: "" };

  return (
    <PageWrapper>
      <TabBar type="business" />
      <Content>
        <HeaderRow>
          <Title>Loyalty Program</Title>
          <Subtitle>
            Set up a single points-based reward your customers see in the app.
            One loyalty program per salon.
          </Subtitle>
        </HeaderRow>

        <Card>
          {loading ? (
            <p>Loading...</p>
          ) : error && !businessId ? (
            <p style={{ color: "#d14b4b", fontSize: 14 }}>{error}</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormSection>
                <ToggleRow>
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={(e) => handleToggleEnabled(e.target.checked)}
                  />
                  <span>Enable loyalty program for this business</span>
                </ToggleRow>
                <HelperText>
                  When disabled, customers won&apos;t see a loyalty tile for
                  your salon.
                </HelperText>
              </FormSection>

              <FormSection>
                <SectionLabel>Loyalty reward</SectionLabel>
                <HelperText>
                  You can only have one loyalty reward active at a time. Name is
                  what the tile is called. Offer is what the customer gets (for
                  example “20% off” or “Free blow-dry”).
                </HelperText>

                <RewardsList>
                  <RewardRow>
                    <TextBox
                      label="Reward name"
                      placeholder="e.g. Glow-up Blow-dry"
                      value={singleReward.name}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        updateRewardField(0, "name", e.target.value)
                      }
                    />
                    <TextBox
                      label="Offer"
                      placeholder="e.g. 20% off, free treatment"
                      value={singleReward.offer}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        updateRewardField(0, "offer", e.target.value)
                      }
                    />
                  </RewardRow>
                </RewardsList>
              </FormSection>

              {error && businessId && (
                <Message $type="error">{error}</Message>
              )}
              {success && <Message $type="success">{success}</Message>}

              <FooterRow>
                <Button type="submit" disabled={saving || !businessId}>
                  {saving ? "Saving..." : "Save loyalty settings"}
                </Button>
              </FooterRow>
            </form>
          )}
        </Card>
      </Content>
    </PageWrapper>
  );
};

export default LoyaltyPage;
