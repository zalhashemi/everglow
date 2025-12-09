// src/pages/business/Profile.tsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TextBox from "../../components/common/TextBox";
import TabBar from "../../components/common/TabBar";
import ProfileHeader from "../../components/common/ProfileHeader";
import Button from "../../components/common/Button";
import Popup from "../../components/common/Popup";
import { FiEdit2 } from "react-icons/fi";
import placeholderImage from "../../images/errorLoading.png";
import AlertPopup from "../../components/common/AlertPopup";
import api from "../../utils/api";

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

/* Working hours UI */
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

const HiddenFileInput = styled.input`
  display: none;
`;

/* ---------- Types ---------- */

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
  const [business, setBusiness] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [about, setAbout] = useState("");

  const [operatingHours, setOperatingHours] = useState<{
    [key: string]: string;
  }>({});

  const [socialLinks, setSocialLinks] = useState<{
    instagram?: string;
    other?: string;
  }>({});

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  // ✅ NEW: Individual section editing states
  const [editingBusinessInfo, setEditingBusinessInfo] = useState(false);
  const [editingOperatingHours, setEditingOperatingHours] = useState(false);
  const [editingStaff, setEditingStaff] = useState(false);
  const [editingSocial, setEditingSocial] = useState(false);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const [alertData, setAlertData] = useState<{
    type: "error" | "success";
    title?: string;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* -------- helper to hydrate from backend/local -------- */
  const hydrateFromBusiness = (raw: any) => {
    const b = raw.business || raw;
    const info = b.businessInfo || b;

    setBusiness(b);

    setName(info?.name || info?.businessName || "");
    setEmail(info?.email || b.email || "");
    setPhone(info?.phone || b.phone || "");
    setAddress(info?.address || b.address || "");
    setCity(info?.city || b.city || "");
    setAbout(info?.about || b.description || "");

    const dbHours = b.operatingHours || {};
    const initialHours: { [key in DayKey]: string } = {} as any;
    DAY_KEYS.forEach((dayKey) => {
      const rawDay = (dbHours as any)[dayKey];
      initialHours[dayKey] = typeof rawDay === "string" ? rawDay : "";
    });
    setOperatingHours(initialHours);

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
    const loadBusiness = async () => {
      try {
        // 1) Try localStorage first
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

        // 2) Then try real API (protected: /api/business/me)
        try {
          const res = await api.get("/business/me");
          hydrateFromBusiness(res.data);
          const payloadToStore = res.data.business || res.data;
          localStorage.setItem("business", JSON.stringify(payloadToStore));
          localStorage.setItem("businessInfo", JSON.stringify(payloadToStore));
        } catch (err) {
          console.error("Failed to fetch /business/me", err);
          // don't block UI on error
        }
      } finally {
        setLoading(false);
      }
    };

    loadBusiness();
  }, []);

  /* ---------------- Business hours helpers ---------------- */
  const parseHours = (value?: string): DayHours => {
    if (!value) return { open: "", close: "", closed: false };

    const normalized = value.trim();

    if (normalized.toLowerCase() === "closed") {
      return { open: "", close: "", closed: true };
    }

    if (normalized.includes("-")) {
      const [openPart, closePart] = normalized.split("-").map((s) => s.trim());
      return {
        open: openPart || "",
        close: closePart || "",
        closed: false,
      };
    }

    return {
      open: normalized,
      close: "",
      closed: false,
    };
  };

  const buildHours = (open: string, close: string, closed: boolean): string => {
    if (closed) return "Closed";
    if (open && close) return `${open} - ${close}`;
    if (open) return open;
    if (close) return close;
    return "";
  };

  // ✅ Helper to get filtered closing time options based on opening time
  const getValidClosingTimes = (openTime: string): string[] => {
    if (!openTime) return TIME_OPTIONS;
    const openIndex = TIME_OPTIONS.indexOf(openTime);
    if (openIndex === -1) return TIME_OPTIONS;
    return TIME_OPTIONS.slice(openIndex + 1);
  };

  // ✅ ADD THIS FUNCTION
  const getValidStaffTimes = (dayKey: DayKey, isClosing: boolean, staffOpenTime?: string): string[] => {
    const businessDay = parseHours(operatingHours[dayKey]);
    
    // If business is closed, staff can't work
    if (businessDay.closed || !businessDay.open || !businessDay.close) {
      return [];
    }

    const businessOpenIndex = TIME_OPTIONS.indexOf(businessDay.open);
    const businessCloseIndex = TIME_OPTIONS.indexOf(businessDay.close);

    if (businessOpenIndex === -1 || businessCloseIndex === -1) {
      return TIME_OPTIONS;
    }

    if (isClosing) {
      // For closing time: must be after staff opening time and not after business closing
      if (!staffOpenTime) return TIME_OPTIONS.slice(businessOpenIndex + 1, businessCloseIndex + 1);
      
      const staffOpenIndex = TIME_OPTIONS.indexOf(staffOpenTime);
      const startIndex = Math.max(staffOpenIndex + 1, businessOpenIndex);
      return TIME_OPTIONS.slice(startIndex, businessCloseIndex + 1);
    } else {
      // For opening time: must be within business hours
      return TIME_OPTIONS.slice(businessOpenIndex, businessCloseIndex);
    }
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

      if (field === "open") {
        updated.open = value as string;
        // ✅ Reset close time if it's now before the new open time
        if (updated.close && updated.open) {
          const openIndex = TIME_OPTIONS.indexOf(updated.open);
          const closeIndex = TIME_OPTIONS.indexOf(updated.close);
          if (closeIndex <= openIndex) {
            updated.close = "";
          }
        }
      }
      if (field === "close") updated.close = value as string;
      if (field === "closed") {
        updated.closed = value as boolean;
        if (updated.closed) {
          updated.open = "";
          updated.close = "";
        }
      }

      return {
        ...prev,
        [dayKey]: buildHours(updated.open, updated.close, updated.closed),
      };
    });
  };

  const displayHours = (value?: string) => {
    if (!value) return "";
    if (value.toLowerCase() === "closed") return "Closed";
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
      const currentDay = { ...schedule[day] };

      // ✅ CHECK: If business is closed on this day, staff must be off
      const businessDay = parseHours(operatingHours[day]);
      if (businessDay.closed) {
        currentDay.closed = true;
        currentDay.open = "";
        currentDay.close = "";
        schedule[day] = currentDay;
        staffMember.schedule = schedule;
        updated[staffIndex] = staffMember;
        return updated;
      }

      // ✅ If changing open time, reset close if it's now invalid
      if (changes.open !== undefined) {
        currentDay.open = changes.open;
        if (currentDay.close && currentDay.open) {
          const openIndex = TIME_OPTIONS.indexOf(currentDay.open);
          const closeIndex = TIME_OPTIONS.indexOf(currentDay.close);
          if (closeIndex <= openIndex) {
            currentDay.close = "";
          }
        }
      }

      if (changes.close !== undefined) {
        currentDay.close = changes.close;
      }

      if (changes.closed !== undefined) {
        currentDay.closed = changes.closed;
        if (currentDay.closed) {
          currentDay.open = "";
          currentDay.close = "";
        }
      }

      schedule[day] = currentDay;
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

  /* ---------------- Validation Functions ---------------- */
  const validateBusinessInfo = (): string | null => {
    // Business name - required, letters and spaces only
    if (!name.trim()) {
      return "Business name cannot be empty.";
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return "Business name can only contain letters and spaces.";
    }

   

    // Email - required and valid format
    if (!email.trim()) {
      return "Email cannot be empty.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address.";
    }

    // Phone - required, numbers only (with optional spaces, dashes, parentheses)
    if (!phone.trim()) {
      return "Phone number cannot be empty.";
    }
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone.trim())) {
      return "Phone number can only contain numbers, spaces, dashes, and parentheses.";
    }

    // Address - required
    if (!address.trim()) {
      return "Address cannot be empty.";
    }

    // City - required, letters and spaces only
    if (!city.trim()) {
      return "City cannot be empty.";
    }
    const cityRegex = /^[A-Za-z\s]+$/;
    if (!cityRegex.test(city.trim())) {
      return "City can only contain letters and spaces.";
    }

    // Description is optional, no validation needed

    return null; // All valid
  };

  const validateOperatingHours = (): string | null => {
    for (const dayKey of DAY_KEYS) {
      const raw = operatingHours[dayKey];
      const parsed = parseHours(raw);

      // Each day must either be closed or have both open and close times
      if (!parsed.closed) {
        if (!parsed.open || !parsed.close) {
          return `${DAY_LABELS[dayKey]}: Please set both opening and closing times, or mark as closed.`;
        }
      }
    }
    return null;
  };

  const validateStaff = (): string | null => {
    if (staff.length === 0) {
      return "Please add at least one staff member.";
    }

    for (let i = 0; i < staff.length; i++) {
      const member = staff[i];

      // Name - required, letters and spaces only
      if (!member.name.trim()) {
        return `Staff member ${i + 1}: Name cannot be empty.`;
      }
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(member.name.trim())) {
        return `Staff member ${i + 1}: Name can only contain letters and spaces.`;
      }

      // Role - required
      if (!member.role.trim()) {
        return `Staff member ${i + 1}: Role cannot be empty.`;
      }

      // Schedule - at least one working day required
      const hasWorkingDay = DAY_KEYS.some((dayKey) => {
        const businessDay = parseHours(operatingHours[dayKey]);
        // Skip if business is closed on this day
        if (businessDay.closed) return false;
        
        const day = member.schedule[dayKey];
        return !day.closed && day.open && day.close;
      });

      if (!hasWorkingDay) {
        return `Staff member ${i + 1} (${member.name}): Must have at least one working day with hours set.`;
      }

      // Validate each working day has both times (only for days the business is open)
      for (const dayKey of DAY_KEYS) {
        const businessDay = parseHours(operatingHours[dayKey]);
        // Skip validation if business is closed on this day
        if (businessDay.closed) continue;
        
        const day = member.schedule[dayKey];
        if (!day.closed) {
          if (!day.open || !day.close) {
            return `Staff member ${i + 1} (${member.name}), ${DAY_LABELS[dayKey]}: Please set both opening and closing times, or mark as off.`;
          }
        }
      }
    }

    return null;
  };

  /* ---------------- Save Edited Profile ---------------- */
  const handleSave = async () => {
    // Run all validations
    const businessError = validateBusinessInfo();
    if (businessError) {
      setAlertData({
        type: "error",
        title: "Validation Error",
        message: businessError,
      });
      return;
    }

    const hoursError = validateOperatingHours();
    if (hoursError) {
      setAlertData({
        type: "error",
        title: "Validation Error",
        message: hoursError,
      });
      return;
    }

    const staffError = validateStaff();
    if (staffError) {
      setAlertData({
        type: "error",
        title: "Validation Error",
        message: staffError,
      });
      return;
    }

    try {
      const payload = {
        businessInfo: {
          name: name.trim(),
          type: type.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          about: about.trim(), // Optional, can be empty
          imageUrl: imagePreview || business?.imageUrl || null,
        },
        operatingHours,
        socialLinks: {
          instagram: socialLinks.instagram?.trim() || "",
          other: socialLinks.other?.trim() || "",
        },
        staff: staff.map((m) => ({
          name: m.name.trim(),
          role: m.role.trim(),
          schedule: m.schedule,
        })),
        imageUrl: imagePreview || business?.imageUrl || null,
      };

      const res = await api.put("/business/me", payload);
      const data = res.data;
      const updatedBusiness = data.business || data;

      hydrateFromBusiness(updatedBusiness);
      localStorage.setItem("business", JSON.stringify(updatedBusiness));
      localStorage.setItem("businessInfo", JSON.stringify(updatedBusiness));
      
      // ✅ Reset all editing states
      setEditingBusinessInfo(false);
      setEditingOperatingHours(false);
      setEditingStaff(false);
      setEditingSocial(false);
      
      setAlertData({
        type: "success",
        message: "Profile updated successfully.",
      });
    } catch (err: any) {
      console.error(err);
      setAlertData({
        type: "error",
        title: "ERROR",
        message:
          err?.response?.data?.message || "Failed to update profile",
      });
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

    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    const formData = new FormData();
    formData.append("image", file);

    try {
      // backend: PUT /api/business/me/profile-image
      const res = await api.put("/business/me/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
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

  /* ---------------- RENDER ---------------- */

  if (loading) {
    return (
      <PageContainer>
        <TabBar type="business" />
        <div style={{ padding: 40 }}>Loading profile...</div>
      </PageContainer>
    );
  }

  if (!business) {
    return (
      <PageContainer>
        <TabBar type="business" />
        <ContentWrapper>
          <TitleRow>
            <Title>Your Profile</Title>
          </TitleRow>
          <Wrapper>
            <p style={{ fontSize: 14, color: "#777" }}>
              No business profile found. Make sure you are logged in as a
              business account or complete your business registration.
            </p>
          </Wrapper>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TabBar type="business" />

      <ContentWrapper>
        <TitleRow>
          <Title>Your Profile</Title>
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
        </HeaderWrapper>

        <Wrapper>
          {/* BUSINESS INFO */}
          <Section>
            <SectionHeader>
              <SectionTitle>Business Information</SectionTitle>
              <EditButton
                type="button"
                onClick={() => {
                  if (editingBusinessInfo) {
                    handleSave();
                  } else {
                    setEditingBusinessInfo(true);
                  }
                }}
              >
                {editingBusinessInfo ? (
                  <>Save Changes</>
                ) : (
                  <>
                    <FiEdit2 size={14} /> Edit
                  </>
                )}
              </EditButton>
            </SectionHeader>

            <Row>
                <TextBox
                  placeholder="Business Name"
                  value={name}
                  readOnly={!editingBusinessInfo}
                  onChange={(e: any) => setName(e.target.value)}
                />
              
            </Row>

            <Row>
              <HalfWidthBox>
                <TextBox
                  placeholder="Email"
                  value={email}
                  readOnly={!editingBusinessInfo}
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </HalfWidthBox>
              <HalfWidthBox>
                <TextBox
                  placeholder="Phone Number"
                  value={phone}
                  readOnly={!editingBusinessInfo}
                  onChange={(e: any) => setPhone(e.target.value)}
                />
              </HalfWidthBox>
            </Row>

            <Row>
              <HalfWidthBox>
                <TextBox
                  placeholder="Address"
                  value={address}
                  readOnly={!editingBusinessInfo}
                  onChange={(e: any) => setAddress(e.target.value)}
                />
              </HalfWidthBox>
              <HalfWidthBox>
                <TextBox
                  placeholder="City"
                  value={city}
                  readOnly={!editingBusinessInfo}
                  onChange={(e: any) => setCity(e.target.value)}
                />
              </HalfWidthBox>
            </Row>

            <TextArea
              placeholder="Description"
              value={about}
              readOnly={!editingBusinessInfo}
              onChange={(e: any) => setAbout(e.target.value)}
            />
          </Section>

          {/* OPERATING HOURS */}
          <Section>
            <SectionHeader>
              <SectionTitle>Operating Hours</SectionTitle>
              <EditButton
                type="button"
                onClick={() => {
                  if (editingOperatingHours) {
                    handleSave();
                  } else {
                    setEditingOperatingHours(true);
                  }
                }}
              >
                {editingOperatingHours ? (
                  <>Save Changes</>
                ) : (
                  <>
                    <FiEdit2 size={14} /> Edit
                  </>
                )}
              </EditButton>
            </SectionHeader>

            <HoursGrid>
              {DAY_KEYS.map((dayKey) => {
                const raw = operatingHours[dayKey];
                const parsed = parseHours(raw);

                if (!editingOperatingHours) {
                  return (
                    <TextBox
                      key={dayKey}
                      label={DAY_LABELS[dayKey]}
                      value={displayHours(raw)}
                      readOnly
                    />
                  );
                }

                const validClosingTimes = getValidClosingTimes(parsed.open);

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
                      {validClosingTimes.map((time) => (
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

          {/* STAFF MEMBERS */}
          <Section>
            <SectionHeader>
              <SectionTitle>Staff Members</SectionTitle>
              <EditButton
                type="button"
                onClick={() => {
                  if (editingStaff) {
                    handleSave();
                  } else {
                    setEditingStaff(true);
                  }
                }}
              >
                {editingStaff ? (
                  <>Save Changes</>
                ) : (
                  <>
                    <FiEdit2 size={14} /> Manage
                  </>
                )}
              </EditButton>
            </SectionHeader>

            {staff && staff.length > 0 ? (
              <StaffList>
                {staff.map((member, staffIndex) => (
                  <div key={staffIndex}>
                    {editingStaff ? (
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

                    {editingStaff && (
                      <>
                        <div
                          style={{
                            marginTop: "10px",
                            fontSize: "0.85rem",
                            color: "#666",
                            marginBottom: "4px",
                          }}
                        >
                          Work schedule (must be within business operating hours)
                        </div>
                        <HoursGrid>
                          {DAY_KEYS.map((dayKey) => {
                            const day = member.schedule[dayKey] || {
                              open: "",
                              close: "",
                              closed: false,
                            };
                            
                            // ✅ CHECK: Get business hours for this day
                            const businessDay = parseHours(operatingHours[dayKey]);
                            const isBusinessClosed = businessDay.closed || !businessDay.open || !businessDay.close;
                            
                            // ✅ GET: Valid time options based on business hours
                            const validStaffOpenTimes = getValidStaffTimes(dayKey, false);
                            const validStaffCloseTimes = getValidStaffTimes(dayKey, true, day.open);

                            return (
                              <DayRow key={dayKey}>
                                <DayLabel>{DAY_LABELS[dayKey]}</DayLabel>
                                <HoursSelect
                                  value={day.open}
                                  disabled={day.closed || isBusinessClosed}
                                  onChange={(e) =>
                                    updateStaffDayHours(staffIndex, dayKey, {
                                      open: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">
                                    {isBusinessClosed ? "Closed" : "From"}
                                  </option>
                                  {validStaffOpenTimes.map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </HoursSelect>
                                <HoursSelect
                                  value={day.close}
                                  disabled={day.closed || isBusinessClosed}
                                  onChange={(e) =>
                                    updateStaffDayHours(staffIndex, dayKey, {
                                      close: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">
                                    {isBusinessClosed ? "Closed" : "To"}
                                  </option>
                                  {validStaffCloseTimes.map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </HoursSelect>
                                <ClosedCheckboxRow>
                                  <input
                                    type="checkbox"
                                    checked={day.closed || isBusinessClosed}
                                    onChange={(e) =>
                                      updateStaffDayHours(staffIndex, dayKey, {
                                        closed: e.target.checked,
                                      })
                                    }
                                    disabled={isBusinessClosed}
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

            {editingStaff && (
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
                  if (editingSocial) {
                    handleSave();
                  } else {
                    setEditingSocial(true);
                  }
                }}
              >
                {editingSocial ? (
                  <>Save Changes</>
                ) : (
                  <>
                    <FiEdit2 size={14} /> Edit
                  </>
                )}
              </EditButton>
            </SectionHeader>

            <SocialGrid>
              <TextBox
                placeholder="Instagram"
                value={socialLinks.instagram || ""}
                readOnly={!editingSocial}
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
                readOnly={!editingSocial}
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

        {alertData && (
          <AlertPopup
            type={alertData.type}
            title={alertData.title}
            message={alertData.message}
            onClose={() => setAlertData(null)}
          />
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default BusinessProfile;
