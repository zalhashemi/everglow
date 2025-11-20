import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TextBox from "../../components/common/TextBox";
import TabBar from "../../components/common/TabBar";
import ProfileHeader from "../../components/common/ProfileHeader";
import Button from "../../components/common/Button";
import Popup from "../../components/common/Popup";
import { FiEdit2 } from "react-icons/fi";
import placeholderImage from "../../images/errorLoading.png";

/* ---- Styled Components ---- */
const PageContainer = styled.div`
  background: ${(p) => p.theme.colors.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 90%;
  max-width: 1300px;
  padding: 40px 0 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 800;
  color: ${(p) => p.theme.colors.primary};
  margin-bottom: 10px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
`;

const Wrapper = styled.div`
  background: ${(p) => p.theme.colors.white};
  border-radius: ${(p) => p.theme.borderRadius.large};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  padding: ${(p) => p.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.lg};
`;

const Section = styled.div`
  background: ${(p) => p.theme.colors.white};
  border-radius: ${(p) => p.theme.borderRadius.medium};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: ${(p) => p.theme.spacing.lg};
  position: relative;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #444;
`;

const EditButton = styled.button`
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 6px 14px;
  color: #555;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f9d2e2;
    color: #c84679;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
`;

const HalfWidthBox = styled.div`
  width: 48%;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  border: 1px solid ${(p) => p.theme.colors.gray.medium};
  border-radius: ${(p) => p.theme.borderRadius.small};
  padding: ${(p) => p.theme.spacing.md};
  resize: none;
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSizes.medium};
  color: ${(p) => p.theme.colors.secondary};

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    background-color: ${(p) => p.theme.colors.white};
  }
`;

/* STAFF LIST */
const StaffList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const StaffHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) auto;
  gap: 10px;
  align-items: center;
`;

const StaffDeleteButton = styled.button`
  border: none;
  background: #ffe5e5;
  color: #c20000;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
`;

const StaffTextRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.5fr;
  gap: 10px;
  align-items: flex-start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StaffText = styled.span`
  font-size: 14px;
  color: #444;
`;

/* SOCIAL */
const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 8px;
`;

/* Logout button */
const LogoutButton = styled.button`
  background: #7a0000;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 14px 18px;
  width: 200px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
  margin-top: 10px;
  transition: 0.2s ease;

  &:hover {
    background: #a30000;
  }
`;

/* Working hours UI (for business + staff, same style as registration) */
const HoursGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DayRow = styled.div`
  display: grid;
  grid-template-columns: 110px repeat(2, minmax(0, 1fr)) auto;
  gap: 10px;
  align-items: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
`;

const DayLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
`;

const HoursRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const HoursSelect = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
  background: #fff;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }

  &:disabled {
    background: #f5f5f5;
    color: #777;
  }
`;

const ClosedCheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #555;
  cursor: pointer;

  input {
    cursor: pointer;
  }
`;

/* Picture upload */
const ImageControlsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const ChangeImageButton = styled.button`
  border: none;
  background: #f9d2e2;
  color: #c84679;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.15s ease;

  &:hover {
    background: #f4c0d6;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

/* ---------- Types copied to match registration ---------- */

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type DayHours = {
  open: string;
  close: string;
  closed: boolean;
};

const DAY_KEYS: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const TIME_OPTIONS = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

const createEmptySchedule = (): Record<DayKey, DayHours> => ({
  monday: { open: "", close: "", closed: false },
  tuesday: { open: "", close: "", closed: false },
  wednesday: { open: "", close: "", closed: false },
  thursday: { open: "", close: "", closed: false },
  friday: { open: "", close: "", closed: false },
  saturday: { open: "", close: "", closed: false },
  sunday: { open: "", close: "", closed: false },
});

type StaffMember = {
  name: string;
  role: string;
  schedule: Record<DayKey, DayHours>;
};

/* -------- Component -------- */
const BusinessProfile: React.FC = () => {
  const [business, setBusiness] = useState<any>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [about, setAbout] = useState("");

  // business operating hours are stored in DB as string map (same as registration payload)
  const [operatingHours, setOperatingHours] = useState<{ [key: string]: string }>(
    {}
  );

  const [socialLinks, setSocialLinks] = useState<{
    instagram?: string;
    other?: string;
  }>({});

  const [staff, setStaff] = useState<StaffMember[]>([]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* -------- helper to hydrate from backend/local -------- */
  const hydrateFromBusiness = (raw: any) => {
    const b = raw.business || raw;
    const info = b.businessInfo || b;

    setBusiness(b);

    setName(info?.name || info?.businessName || "");
    setType(info?.type || info?.businessType || "Salon");
    setEmail(info?.email || b.email || "");
    setPhone(info?.phone || b.phone || "");
    setAddress(info?.address || b.address || "");
    setCity(info?.city || b.city || "");
    setAbout(info?.about || b.description || "");

    setOperatingHours(b.operatingHours || {});
    setSocialLinks(b.socialLinks || {});

    const rawStaff: any[] = b.staff || [];
    const normalizedStaff: StaffMember[] =
      rawStaff.length > 0
        ? rawStaff.map((s) => ({
            name: s.name || s.fullName || "",
            role: s.role || "",
            schedule: s.schedule || createEmptySchedule(),
          }))
        : [];

    setStaff(normalizedStaff);

    const img =
      b.imageUrl ||
      b.image ||
      b.logo ||
      b.photo ||
      info?.imageUrl ||
      info?.image ||
      info?.logo ||
      info?.photo ||
      null;
    if (img) {
      setImagePreview(img);
    }
  };

  /* ---------------- Load Business Data ---------------- */
  useEffect(() => {
    const storedStr =
      localStorage.getItem("business") ||
      localStorage.getItem("businessInfo");
    if (storedStr) {
      try {
        const data = JSON.parse(storedStr);
        hydrateFromBusiness(data);
      } catch (e) {
        console.error("Failed to parse stored business", e);
      }
    }

    const token =
      localStorage.getItem("businessToken") ||
      localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/business/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          hydrateFromBusiness(data);
          const payloadToStore = data.business || data;
          localStorage.setItem("business", JSON.stringify(payloadToStore));
          localStorage.setItem("businessInfo", JSON.stringify(payloadToStore));
        })
        .catch((err) => {
          console.error("Failed to fetch business /me", err);
        });
    }
  }, []);

  if (!business) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  /* ---------------- Business hours helpers ---------------- */
  const parseHours = (value?: string) => {
    if (!value) return { open: "", close: "", closed: false };
    if (value === "Closed") return { open: "", close: "", closed: true };
    const [open, close] = value.split("-").map((s) => s.trim());
    return { open: open || "", close: close || "", closed: false };
  };

  const buildHours = (open: string, close: string, closed: boolean) => {
    if (closed) return "Closed";
    if (!open || !close) return "";
    return `${open} - ${close}`;
  };

  const handleBusinessDayChange = (
    dayKey: DayKey,
    field: "open" | "close" | "closed",
    value: string | boolean
  ) => {
    setOperatingHours((prev) => {
      const current = parseHours(prev[dayKey]);
      const updated: DayHours = {
        open: current.open,
        close: current.close,
        closed: current.closed,
      };

      if (field === "open") updated.open = value as string;
      if (field === "close") updated.close = value as string;
      if (field === "closed") updated.closed = value as boolean;

      return {
        ...prev,
        [dayKey]: buildHours(updated.open, updated.close, updated.closed),
      };
    });
  };

  const displayHours = (value?: string) => {
    if (!value) return "";
    if (value === "Closed") return "Closed";
    return value;
  };

  /* ---------------- Staff helpers ---------------- */
  const handleStaffFieldChange = (
    index: number,
    field: keyof StaffMember,
    value: any
  ) => {
    setStaff((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateStaffDayHours = (
    staffIndex: number,
    day: DayKey,
    changes: Partial<DayHours>
  ) => {
    setStaff((prev) => {
      const updated = [...prev];
      const staffMember = { ...updated[staffIndex] };
      const schedule = { ...staffMember.schedule };
      schedule[day] = { ...schedule[day], ...changes };
      staffMember.schedule = schedule;
      updated[staffIndex] = staffMember;
      return updated;
    });
  };

  const handleRemoveStaff = (index: number) => {
    setStaff((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddStaff = () => {
    setStaff((prev) => [
      ...prev,
      { name: "", role: "", schedule: createEmptySchedule() },
    ]);
  };

  /* ---------------- Save Edited Profile ---------------- */
  const handleSave = async () => {
    const token =
      localStorage.getItem("businessToken") ||
      localStorage.getItem("token");
    if (!token) {
      alert("Not logged in as business.");
      return;
    }

    // Shape payload like registration wizard
    const payload = {
      businessInfo: {
        name,
        type,
        email,
        phone,
        address,
        city,
        about,
        imageUrl: imagePreview || business?.imageUrl || null,
      },
      operatingHours,
      socialLinks,
      staff: staff.map((m) => ({
        name: m.name,
        role: m.role,
        schedule: m.schedule,
      })),
      imageUrl: imagePreview || business?.imageUrl || null,
    };

    try {
      const res = await fetch("http://localhost:5000/api/business/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedBusiness = data.business || data;
        setBusiness(updatedBusiness);
        hydrateFromBusiness(updatedBusiness);
        localStorage.setItem("business", JSON.stringify(updatedBusiness));
        localStorage.setItem("businessInfo", JSON.stringify(updatedBusiness));
        setIsEditing(false);
      } else {
        console.error("Update failed:", data);
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  /* ---------------- Picture upload ---------------- */
  const handleChangeImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token =
      localStorage.getItem("businessToken") ||
      localStorage.getItem("token");

    // local preview first
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    if (!token) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        "http://localhost:5000/api/business/profile-image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      const finalUrl = data.imageUrl || data.url || localUrl;
      setImagePreview(finalUrl);

      const updatedBusiness = {
        ...(business || {}),
        imageUrl: finalUrl,
        businessInfo: {
          ...(business?.businessInfo || {}),
          imageUrl: finalUrl,
        },
      };

      setBusiness(updatedBusiness);
      localStorage.setItem("business", JSON.stringify(updatedBusiness));
      localStorage.setItem("businessInfo", JSON.stringify(updatedBusiness));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Logout Logic ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("business");
    localStorage.removeItem("businessInfo");
    localStorage.removeItem("businessToken");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const displayName =
    name ||
    business?.businessName ||
    business?.businessInfo?.name ||
    business?.name ||
    "Your Business";

  const profileImage =
    imagePreview ||
    business?.imageUrl ||
    business?.image ||
    business?.businessInfo?.imageUrl ||
    business?.businessInfo?.image ||
    placeholderImage;

  return (
    <PageContainer>
      <TabBar type="business" />

      <ContentWrapper>
        <TitleRow>
          <Title>Your Profile</Title>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              borderRadius: "8px",
              width: "auto",
            }}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </TitleRow>

        <HeaderWrapper>
          <ProfileHeader
            type="business"
            name={displayName}
            image={profileImage}
            stat1={0}
            stat2={0}
            stat3={0}
          />
          <ImageControlsWrapper>
            <ChangeImageButton
              type="button"
              onClick={handleChangeImageClick}
            >
              {imagePreview ? "Change picture" : "Upload picture"}
            </ChangeImageButton>
            <HiddenFileInput
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageSelected}
            />
          </ImageControlsWrapper>
        </HeaderWrapper>

        <Wrapper>
          {/* BUSINESS INFO */}
          <Section>
            <SectionHeader>
              <SectionTitle>Business Information</SectionTitle>
              <EditButton
                type="button"
                onClick={() => {
                  if (!isEditing) setIsEditing(true);
                }}
              >
                <FiEdit2 size={14} /> Edit
              </EditButton>
            </SectionHeader>

            <Row>
              <HalfWidthBox>
                <TextBox
                  placeholder="Business Name"
                  value={name}
                  readOnly={!isEditing}
                  onChange={(e: any) => setName(e.target.value)}
                />
              </HalfWidthBox>
              <HalfWidthBox>
                <TextBox
                  placeholder="Business Type"
                  value={type}
                  readOnly={!isEditing}
                  onChange={(e: any) => setType(e.target.value)}
                />
              </HalfWidthBox>
            </Row>

            <Row>
              <HalfWidthBox>
                <TextBox
                  placeholder="Email"
                  value={email}
                  readOnly={!isEditing}
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </HalfWidthBox>
              <HalfWidthBox>
                <TextBox
                  placeholder="Phone Number"
                  value={phone}
                  readOnly={!isEditing}
                  onChange={(e: any) => setPhone(e.target.value)}
                />
              </HalfWidthBox>
            </Row>

            <Row>
              <HalfWidthBox>
                <TextBox
                  placeholder="Address"
                  value={address}
                  readOnly={!isEditing}
                  onChange={(e: any) => setAddress(e.target.value)}
                />
              </HalfWidthBox>
              <HalfWidthBox>
                <TextBox
                  placeholder="City"
                  value={city}
                  readOnly={!isEditing}
                  onChange={(e: any) => setCity(e.target.value)}
                />
              </HalfWidthBox>
            </Row>

            <TextArea
              placeholder="Description"
              value={about}
              readOnly={!isEditing}
              onChange={(e: any) => setAbout(e.target.value)}
            />
          </Section>

          {/* OPERATING HOURS (same pattern as registration) */}
          <Section>
            <SectionHeader>
              <SectionTitle>Operating Hours</SectionTitle>
              <EditButton
                type="button"
                onClick={() => {
                  if (!isEditing) setIsEditing(true);
                }}
              >
                <FiEdit2 size={14} /> Edit
              </EditButton>
            </SectionHeader>

            <HoursGrid>
              {DAY_KEYS.map((dayKey) => {
                const raw = operatingHours[dayKey];
                const parsed = parseHours(raw);

                if (!isEditing) {
                  return (
                    <TextBox
                      key={dayKey}
                      label={DAY_LABELS[dayKey]}
                      value={displayHours(raw)}
                      readOnly
                    />
                  );
                }

                return (
                  <DayRow key={dayKey}>
                    <DayLabel>{DAY_LABELS[dayKey]}</DayLabel>
                    <HoursSelect
                      value={parsed.open}
                      disabled={parsed.closed}
                      onChange={(e) =>
                        handleBusinessDayChange(
                          dayKey,
                          "open",
                          e.target.value
                        )
                      }
                    >
                      <option value="">From</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </HoursSelect>
                    <HoursSelect
                      value={parsed.close}
                      disabled={parsed.closed}
                      onChange={(e) =>
                        handleBusinessDayChange(
                          dayKey,
                          "close",
                          e.target.value
                        )
                      }
                    >
                      <option value="">To</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </HoursSelect>
                    <ClosedCheckboxRow>
                      <input
                        type="checkbox"
                        checked={parsed.closed}
                        onChange={(e) =>
                          handleBusinessDayChange(
                            dayKey,
                            "closed",
                            e.target.checked
                          )
                        }
                      />
                      Closed
                    </ClosedCheckboxRow>
                  </DayRow>
                );
              })}
            </HoursGrid>
          </Section>

          {/* STAFF MEMBERS – same schedule style as registration */}
          <Section>
            <SectionHeader>
              <SectionTitle>Staff Members</SectionTitle>
              <EditButton
                type="button"
                onClick={() => {
                  if (!isEditing) setIsEditing(true);
                }}
              >
                <FiEdit2 size={14} /> Manage
              </EditButton>
            </SectionHeader>

            {staff && staff.length > 0 ? (
              <StaffList>
                {staff.map((member, staffIndex) => (
                  <div key={staffIndex}>
                    {isEditing ? (
                      <StaffHeaderRow>
                        <TextBox
                          placeholder="Name"
                          value={member.name}
                          onChange={(e: any) =>
                            handleStaffFieldChange(
                              staffIndex,
                              "name",
                              e.target.value
                            )
                          }
                        />
                        <TextBox
                          placeholder="Role / Title"
                          value={member.role}
                          onChange={(e: any) =>
                            handleStaffFieldChange(
                              staffIndex,
                              "role",
                              e.target.value
                            )
                          }
                        />
                        {staff.length > 1 && (
                          <StaffDeleteButton
                            type="button"
                            onClick={() => handleRemoveStaff(staffIndex)}
                          >
                            Delete
                          </StaffDeleteButton>
                        )}
                      </StaffHeaderRow>
                    ) : (
                      <StaffTextRow>
                        <StaffText>{member.name || "-"}</StaffText>
                        <StaffText>{member.role || "-"}</StaffText>
                        <StaffText>
                          {Object.entries(member.schedule)
                            .map(([dayKey, dayValue]) => {
                              const d = dayValue as DayHours;
                              if (d.closed) {
                                return `${DAY_LABELS[dayKey as DayKey]}: Off`;
                              }
                              if (!d.open || !d.close) return null;
                              return `${DAY_LABELS[dayKey as DayKey]}: ${
                                d.open
                              }–${d.close}`;
                            })
                            .filter(Boolean)
                            .join(" · ") || "No schedule set"}
                        </StaffText>
                      </StaffTextRow>
                    )}

                    {isEditing && (
                      <>
                        <div
                          style={{
                            marginTop: "10px",
                            fontSize: "0.85rem",
                            color: "#666",
                            marginBottom: "4px",
                          }}
                        >
                          Work schedule
                        </div>
                        <HoursGrid>
                          {DAY_KEYS.map((dayKey) => {
                            const day = member.schedule[dayKey] || {
                              open: "",
                              close: "",
                              closed: false,
                            };
                            return (
                              <DayRow key={dayKey}>
                                <DayLabel>{DAY_LABELS[dayKey]}</DayLabel>
                                <HoursSelect
                                  value={day.open}
                                  disabled={day.closed}
                                  onChange={(e) =>
                                    updateStaffDayHours(staffIndex, dayKey, {
                                      open: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">From</option>
                                  {TIME_OPTIONS.map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </HoursSelect>
                                <HoursSelect
                                  value={day.close}
                                  disabled={day.closed}
                                  onChange={(e) =>
                                    updateStaffDayHours(staffIndex, dayKey, {
                                      close: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">To</option>
                                  {TIME_OPTIONS.map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </HoursSelect>
                                <ClosedCheckboxRow>
                                  <input
                                    type="checkbox"
                                    checked={day.closed}
                                    onChange={(e) =>
                                      updateStaffDayHours(staffIndex, dayKey, {
                                        closed: e.target.checked,
                                      })
                                    }
                                  />
                                  Off
                                </ClosedCheckboxRow>
                              </DayRow>
                            );
                          })}
                        </HoursGrid>
                      </>
                    )}
                  </div>
                ))}
              </StaffList>
            ) : (
              <div style={{ color: "#777" }}>No staff added yet</div>
            )}

            {isEditing && (
              <div style={{ marginTop: 16 }}>
                <Button
                  onClick={handleAddStaff}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    borderRadius: "8px",
                    width: "auto",
                  }}
                >
                  + Add Staff Member
                </Button>
              </div>
            )}
          </Section>

          {/* SOCIAL MEDIA */}
          <Section>
            <SectionHeader>
              <SectionTitle>Social Media & Website</SectionTitle>
              <EditButton
                type="button"
                onClick={() => {
                  if (!isEditing) setIsEditing(true);
                }}
              >
                <FiEdit2 size={14} /> Edit
              </EditButton>
            </SectionHeader>

            <SocialGrid>
              <TextBox
                placeholder="Instagram"
                value={socialLinks.instagram || ""}
                readOnly={!isEditing}
                onChange={(e: any) =>
                  setSocialLinks((prev) => ({
                    ...prev,
                    instagram: e.target.value,
                  }))
                }
              />
              <TextBox
                placeholder="Other Link"
                value={socialLinks.other || ""}
                readOnly={!isEditing}
                onChange={(e: any) =>
                  setSocialLinks((prev) => ({
                    ...prev,
                    other: e.target.value,
                  }))
                }
              />
            </SocialGrid>
          </Section>
        </Wrapper>

        {/* Logout button + popup */}
        <LogoutButton onClick={() => setShowLogoutPopup(true)}>
          Log Out
        </LogoutButton>

        {showLogoutPopup && (
          <Popup
            title="Log Out?"
            description="Are you sure you want to log out of your business account?"
            primaryLabel="Log Out"
            secondaryLabel="Cancel"
            onPrimary={handleLogout}
            onSecondary={() => setShowLogoutPopup(false)}
          />
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default BusinessProfile;
