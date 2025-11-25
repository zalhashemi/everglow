// src/pages/auth/BusinessDetailsRegistration.tsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import L from "../../leafletSetup";
import type { LeafletMouseEvent } from "leaflet";
import AlertPopup from "../../components/common/AlertPopup";
import TextBox from "../../components/common/TextBox";

/* ===========================
   Styled Components
=========================== */
const PageContainer = styled.div`
  background: ${(p) => p.theme.colors.background};
  min-height: 100vh;
  padding: ${(p) => p.theme.spacing.xl};
  display: flex;
  justify-content: center;
`;

const FormWrapper = styled.div`
  background: ${(p) => p.theme.colors.white};
  border-radius: ${(p) => p.theme.borderRadius.large};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 900px;
  width: 100%;
  padding: ${(p) => p.theme.spacing.lg};
`;

const Title = styled.h1`
  color: ${(p) => p.theme.colors.secondary};
  font-size: ${(p) => p.theme.typography.fontSizes.xlarge};
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.gray.dark};
  margin-bottom: ${(p) => p.theme.spacing.lg};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
`;

const StepIndicator = styled.p`
  color: ${(p) => p.theme.colors.gray.dark};
  margin-bottom: ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
`;

const Section = styled.section`
  margin-bottom: ${(p) => p.theme.spacing.lg};
  border: 1px solid ${(p) => p.theme.colors.gray.medium};
  border-radius: ${(p) => p.theme.borderRadius.medium};
  background: ${(p) => p.theme.colors.white};
  padding: ${(p) => p.theme.spacing.lg};
`;

const SectionHeader = styled.h2`
  font-size: ${(p) => p.theme.typography.fontSizes.large};
  color: ${(p) => p.theme.colors.secondary};
  margin-bottom: ${(p) => p.theme.spacing.md};
`;

/** Stack fields vertically */
const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: ${(p) => p.theme.spacing.md};
  border: 1px solid ${(p) => p.theme.colors.gray.medium};
  border-radius: ${(p) => p.theme.borderRadius.small};
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  resize: none;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  font-size: ${(p) => p.theme.typography.fontSizes.medium};
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.medium};
  padding: ${(p) => p.theme.spacing.md};
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: ${(p) => p.theme.spacing.md};

  &:hover {
    background: ${(p) => p.theme.colors.secondary};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StaffContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.lg};
`;

const StaffHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) auto;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: center;
`;

const AddButton = styled.button`
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  border: none;
  padding: ${(p) => `${p.theme.spacing.sm} ${p.theme.spacing.md}`};
  border-radius: ${(p) => p.theme.borderRadius.small};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  cursor: pointer;
  margin-top: ${(p) => p.theme.spacing.sm};
  width: fit-content;
  transition: background 0.2s ease;

  &:hover {
    background: ${(p) => p.theme.colors.secondary};
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  color: ${(p) => p.theme.colors.secondary};
  border: 1px solid ${(p) => p.theme.colors.gray.medium};
  border-radius: ${(p) => p.theme.borderRadius.small};
  padding: ${(p) => `${p.theme.spacing.xs} ${p.theme.spacing.sm}`};
  cursor: pointer;
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: ${(p) => p.theme.colors.secondary};
  border: 1px solid ${(p) => p.theme.colors.gray.medium};
  border-radius: ${(p) => p.theme.borderRadius.small};
  padding: ${(p) => `${p.theme.spacing.sm} ${p.theme.spacing.md}`};
  cursor: pointer;
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  transition: all 0.2s ease;
  margin-top: ${(p) => p.theme.spacing.md};

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const NextButton = styled(AddButton)`
  margin-top: ${(p) => p.theme.spacing.md};
`;

const ErrorText = styled.p`
  color: red;
  margin-top: ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
`;

const MapBlock = styled.div`
  width: 100%;
  height: 280px;
  border-radius: ${(p) => p.theme.borderRadius.medium};
  overflow: hidden;
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const LocationInfo = styled.div`
  margin-top: ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  color: #555;
`;

/* --------- Operating Hours --------- */

const HoursGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
`;

const DayRow = styled.div`
  display: grid;
  grid-template-columns: 110px repeat(2, minmax(0, 1fr)) auto;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
`;

const DayLabel = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  font-weight: 600;
  color: ${(p) => p.theme.colors.gray.dark};
`;

const TimeSelect = styled.select`
  width: 100%;
  padding: ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.borderRadius.small};
  border: 1px solid ${(p) => p.theme.colors.gray.medium};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  background: ${(p) => p.theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }

  &:disabled {
    background: ${(p) => p.theme.colors.gray.light};
    cursor: not-allowed;
  }
`;

const ClosedToggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  color: ${(p) => p.theme.colors.gray.dark};
  cursor: pointer;

  input {
    cursor: pointer;
  }

  @media (max-width: 600px) {
    margin-top: ${(p) => p.theme.spacing.xs};
  }
`;

/* --------- File Input --------- */

const FileInputWrapper = styled.div`
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => `${p.theme.spacing.sm} ${p.theme.spacing.lg}`};
  border-radius: ${(p) => p.theme.borderRadius.large};
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.white};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  cursor: pointer;
  border: none;
  transition: background 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  &:hover {
    background: ${(p) => p.theme.colors.secondary};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PasswordToggle = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  color: #4a5174;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 4px;

  &:hover {
    opacity: 0.9;
  }
`;

/** Salon type select (women/men/mixed) */
const SalonTypeSelect = styled.select`
  width: 100%;
  padding: ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.borderRadius.small};
  border: 1px solid ${(p) => p.theme.colors.gray.medium};
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  background: ${(p) => p.theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

/* ===========================
   Types & Constants
=========================== */

const DEFAULT_CENTER = {
  lat: 26.2285,
  lng: 50.586,
  zoom: 11,
};

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

/* ===========================
   Component
=========================== */

const BusinessRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    type: "Salon",
    email: "",
    phone: "",
    address: "", // added back
    city: "", // added back
    about: "",
    genderTag: "", // women / men / mixed
  });

  const [accountPassword, setAccountPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [hoursSelection, setHoursSelection] = useState<
    Record<DayKey, DayHours>
  >(createEmptySchedule());

  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    other: "",
  });

  const [staffList, setStaffList] = useState<StaffMember[]>([
    { name: "", role: "", schedule: createEmptySchedule() },
  ]);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [manualLocation, setManualLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [popup, setPopup] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        DEFAULT_CENTER.zoom
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      map.on("click", (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setManualLocation({ lat, lng });

        if (markerRef.current) {
          markerRef.current.remove();
        }

        markerRef.current = L.marker([lat, lng]).addTo(map);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  /* ==== Staff helpers ==== */

  const handleStaffFieldChange = (
    index: number,
    field: keyof StaffMember,
    value: any
  ) => {
    setStaffList((prev) => {
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
    setStaffList((prev) => {
      const updated = [...prev];
      const staff = { ...updated[staffIndex] };
      const schedule = { ...staff.schedule };
      const currentDay = { ...schedule[day] };
      
      // ✅ Check if business is operating on this day
      const businessDay = hoursSelection[day];
      if (businessDay.closed) {
        // If business is closed, staff must be off
        currentDay.closed = true;
        currentDay.open = "";
        currentDay.close = "";
        schedule[day] = currentDay;
        staff.schedule = schedule;
        updated[staffIndex] = staff;
        return updated;
      }

      // ✅ If opening time changed, reset close time if it's now invalid
      if (changes.open !== undefined) {
        currentDay.open = changes.open;
        if (currentDay.close) {
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
      staff.schedule = schedule;
      updated[staffIndex] = staff;
      return updated;
    });
  };

  const addStaffMember = () => {
    setStaffList((prev) => [
      ...prev,
      { name: "", role: "", schedule: createEmptySchedule() },
    ]);
  };

  const removeStaffMember = (index: number) => {
    setStaffList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  /* ==== Helper to get valid closing times based on opening time ==== */
  const getValidClosingTimes = (openTime: string): string[] => {
    if (!openTime) return TIME_OPTIONS;
    const openIndex = TIME_OPTIONS.indexOf(openTime);
    if (openIndex === -1) return TIME_OPTIONS;
    // Return only times after the opening time
    return TIME_OPTIONS.slice(openIndex + 1);
  };

  const updateDayHours = (day: DayKey, changes: Partial<DayHours>) => {
    setHoursSelection((prev) => {
      const updatedDay: DayHours = { ...prev[day], ...changes };
      
      // ✅ If opening time changed, reset close time if it's now invalid
      if (changes.open !== undefined && updatedDay.close) {
        const openIndex = TIME_OPTIONS.indexOf(updatedDay.open);
        const closeIndex = TIME_OPTIONS.indexOf(updatedDay.close);
        if (closeIndex <= openIndex) {
          updatedDay.close = "";
        }
      }
      
      return { ...prev, [day]: updatedDay };
    });
  };

  /* ==== NEW: Helper to get valid staff times based on business hours ==== */
  const getValidStaffTimes = (dayKey: DayKey, isClosing: boolean, staffOpenTime?: string): string[] => {
    const businessDay = hoursSelection[dayKey];
    
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

  /* ==== Validation ==== */

  const validateAccountSection = (): boolean => {
    const name = businessInfo.name.trim();
    const email = businessInfo.email.trim();
    const phone = businessInfo.phone.trim();
    const address = businessInfo.address.trim();
    const city = businessInfo.city.trim();

    if (!name) {
      setError("Business Name: Please enter your business name.");
      return false;
    }

    if (!email) {
      setError("Business Email: Please enter your business email.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Business Email: Please enter a valid email address.");
      return false;
    }

    if (!phone) {
      setError("Phone Number: Please enter a phone number.");
      return false;
    }

    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(phone)) {
      setError(
        "Phone Number: Please enter a valid phone number (digits only, 7–15, optional +)."
      );
      return false;
    }

    if (!address) {
      setError("Address: Please enter your salon address.");
      return false;
    }

    if (!city) {
      setError("City: Please enter the city of the salon.");
      return false;
    }

    if (!businessInfo.genderTag) {
      setError(
        "Salon Type: Please select if your salon is for women, men, or mixed."
      );
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!accountPassword) {
      setError("Password: Please enter a password for your business login.");
      return false;
    }

    if (!passwordRegex.test(accountPassword)) {
      setError(
        "Password: Must be at least 8 characters and include 1 uppercase, 1 lowercase, and 1 number."
      );
      return false;
    }

    if (accountPassword !== confirmPassword) {
      setError("Confirm Password: Passwords do not match.");
      return false;
    }

    // Location must be chosen
    if (!manualLocation) {
      setError("Location on Map: Please select your salon location.");
      return false;
    }

    return true;
  };

  const validateOperatingHours = (): boolean => {
    const invalidDay = DAY_KEYS.find((dayKey) => {
      const d = hoursSelection[dayKey];
      if (d.closed) return false;
      return !(d.open && d.close);
    });

    if (invalidDay) {
      setError(
        "Operating Hours: Please set working hours for all days (From & To) or mark them as Closed."
      );
      return false;
    }

    return true;
  };

  /* ==== NEW: Validate staff schedules against business hours ==== */
  const validateStaffSchedules = (): boolean => {
    for (let i = 0; i < staffList.length; i++) {
      const staff = staffList[i];
      
      for (const dayKey of DAY_KEYS) {
        const staffDay = staff.schedule[dayKey];
        const businessDay = hoursSelection[dayKey];

        // Skip if staff is off
        if (staffDay.closed) continue;

        // If staff is working but business is closed, that's invalid
        if (businessDay.closed && (staffDay.open || staffDay.close)) {
          setError(
            `Staff member ${i + 1} (${staff.name || 'unnamed'}): Cannot work on ${DAY_LABELS[dayKey]} - business is closed.`
          );
          return false;
        }

        // If staff has working hours
        if (staffDay.open && staffDay.close) {
          const businessOpenIndex = TIME_OPTIONS.indexOf(businessDay.open);
          const businessCloseIndex = TIME_OPTIONS.indexOf(businessDay.close);
          const staffOpenIndex = TIME_OPTIONS.indexOf(staffDay.open);
          const staffCloseIndex = TIME_OPTIONS.indexOf(staffDay.close);

          // Staff opening time must be >= business opening time
          if (staffOpenIndex < businessOpenIndex) {
            setError(
              `Staff member ${i + 1} (${staff.name || 'unnamed'}), ${DAY_LABELS[dayKey]}: Cannot start before business opens (${businessDay.open}).`
            );
            return false;
          }

          // Staff closing time must be <= business closing time
          if (staffCloseIndex > businessCloseIndex) {
            setError(
              `Staff member ${i + 1} (${staff.name || 'unnamed'}), ${DAY_LABELS[dayKey]}: Cannot work after business closes (${businessDay.close}).`
            );
            return false;
          }
        }
      }
    }

    return true;
  };

  /* ==== Submit ==== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (currentStep !== 2) {
      const okAccount = validateAccountSection();
      if (!okAccount) return;

      const okHours = validateOperatingHours();
      if (!okHours) return;

      setCurrentStep(2);
      return;
    }

    const okAccount = validateAccountSection();
    if (!okAccount) return;

    const okHours = validateOperatingHours();
    if (!okHours) return;

    // ✅ NEW: Validate staff schedules
    const okStaff = validateStaffSchedules();
    if (!okStaff) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const payloadBusinessInfo: any = {
        ...businessInfo,
      };

      if (manualLocation) {
        payloadBusinessInfo.locationLat = manualLocation.lat;
        payloadBusinessInfo.locationLng = manualLocation.lng;
      }

      const operatingHoursPayload: Record<string, string> = {};
      DAY_KEYS.forEach((dayKey) => {
        const d = hoursSelection[dayKey];
        if (d.closed) {
          operatingHoursPayload[dayKey] = "Closed";
        } else if (d.open && d.close) {
          operatingHoursPayload[dayKey] = `${d.open} - ${d.close}`;
        } else {
          operatingHoursPayload[dayKey] = "";
        }
      });

      formData.append("businessInfo", JSON.stringify(payloadBusinessInfo));
      formData.append(
        "operatingHours",
        JSON.stringify(operatingHoursPayload)
      );
      formData.append("socialLinks", JSON.stringify(socialLinks));
      formData.append("staff", JSON.stringify(staffList));

      // login credentials for business
      formData.append("email", businessInfo.email);
      formData.append("password", accountPassword);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("http://localhost:5000/api/business/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register business");
      }

      if (data.token) {
        localStorage.setItem("businessToken", data.token);
        localStorage.setItem("businessInfo", JSON.stringify(data.business));
        if (data.business && data.business._id) {
          localStorage.setItem("businessId", data.business._id);
        }
      }

      setPopup({
        type: "success",
        message: "Business registered successfully!",
      });

      setTimeout(() => {
        navigate("/business/dashboard");
      }, 5200);
    } catch (err: any) {
      console.error("Error registering business:", err);
      setPopup({
        type: "error",
        message: err.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===========================
     Render
  ============================ */

  return (
    <PageContainer>
      <FormWrapper>
        <Title>Register Your Business</Title>
        <Subtitle>Manage your salon information and settings.</Subtitle>
        <StepIndicator>
          Step {currentStep} of 2 ·{" "}
          {currentStep === 1 ? "Business & Details" : "Staff Members"}
        </StepIndicator>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {currentStep === 1 && (
            <>
              <Section>
                <SectionHeader>Business Information & Login</SectionHeader>

                <FieldStack>
                  <TextBox
                    placeholder="Business Name"
                    value={businessInfo.name}
                    onChange={(e: any) =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />

                  <TextBox
                    placeholder="Business Email (used for login)"
                    value={businessInfo.email}
                    onChange={(e: any) =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />

                  <TextBox
                    placeholder="Phone Number"
                    value={businessInfo.phone}
                    onChange={(e: any) =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />

                  <TextBox
                    placeholder="Address"
                    value={businessInfo.address}
                    onChange={(e: any) =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />

                  <TextBox
                    placeholder="City"
                    value={businessInfo.city}
                    onChange={(e: any) =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                  />

                  <SalonTypeSelect
                    value={businessInfo.genderTag}
                    onChange={(e) =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        genderTag: e.target.value,
                      }))
                    }
                  >
                    <option value="">Salon type</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="mixed">Mixed</option>
                  </SalonTypeSelect>

                  <div>
                    <TextBox
                      type={showPassword ? "text" : "password"}
                      placeholder="Business Account Password"
                      value={accountPassword}
                      onChange={(e: any) => setAccountPassword(e.target.value)}
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide password" : "Show password"}
                    </PasswordToggle>
                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "0.85rem",
                        color: "#555",
                      }}
                    >
                      Password must be at least 8 characters and include 1
                      uppercase, 1 lowercase, and 1 number.
                    </div>
                  </div>

                  <TextBox
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e: any) => setConfirmPassword(e.target.value)}
                  />

                  <TextArea
                    placeholder="About your business."
                    value={businessInfo.about}
                    onChange={(e) =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        about: e.target.value,
                      }))
                    }
                  />
                </FieldStack>
              </Section>

              <Section>
                <SectionHeader>Choose Location on Map</SectionHeader>
                <p
                  style={{
                    marginBottom: "8px",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  Click on the map to set where your salon is located. This is
                  what customers will see on the search page.
                </p>

                <MapBlock>
                  <div
                    ref={mapContainerRef}
                    style={{ width: "100%", height: "100%" }}
                  />
                </MapBlock>

                <LocationInfo>
                  {manualLocation ? (
                    <>
                      Selected: {manualLocation.lat.toFixed(5)},{" "}
                      {manualLocation.lng.toFixed(5)}
                    </>
                  ) : (
                    <>No location selected yet. Click on the map to drop a pin.</>
                  )}
                </LocationInfo>
              </Section>

              <Section>
                <SectionHeader>Operating Hours</SectionHeader>
                <HoursGrid>
                  {DAY_KEYS.map((dayKey) => {
                    const day = hoursSelection[dayKey];
                    const validClosingTimes = getValidClosingTimes(day.open);
                    
                    return (
                      <DayRow key={dayKey}>
                        <DayLabel>{DAY_LABELS[dayKey]}</DayLabel>
                        <TimeSelect
                          value={day.open}
                          onChange={(e) =>
                            updateDayHours(dayKey, { open: e.target.value })
                          }
                          disabled={day.closed}
                        >
                          <option value="">From</option>
                          {TIME_OPTIONS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </TimeSelect>
                        <TimeSelect
                          value={day.close}
                          onChange={(e) =>
                            updateDayHours(dayKey, { close: e.target.value })
                          }
                          disabled={day.closed}
                        >
                          <option value="">To</option>
                          {validClosingTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </TimeSelect>
                        <ClosedToggle>
                          <input
                            type="checkbox"
                            checked={day.closed}
                            onChange={(e) =>
                              updateDayHours(dayKey, {
                                closed: e.target.checked,
                              })
                            }
                          />
                          Closed
                        </ClosedToggle>
                      </DayRow>
                    );
                  })}
                </HoursGrid>
              </Section>

              <Section>
                <SectionHeader>Social Media & Website</SectionHeader>
                <FieldStack>
                  <TextBox
                    placeholder="Instagram"
                    value={socialLinks.instagram}
                    onChange={(e: any) =>
                      setSocialLinks((prev) => ({
                        ...prev,
                        instagram: e.target.value,
                      }))
                    }
                  />
                  <TextBox
                    placeholder="Other Link"
                    value={socialLinks.other}
                    onChange={(e: any) =>
                      setSocialLinks((prev) => ({
                        ...prev,
                        other: e.target.value,
                      }))
                    }
                  />
                </FieldStack>
              </Section>

              <Section>
                <SectionHeader>Cover Image</SectionHeader>
                <p
                  style={{
                    marginBottom: "8px",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  This image will be displayed on your salon card for users.
                </p>

                <FileInputWrapper>
                  <FileInputLabel>
                    Choose Cover Image
                    <HiddenFileInput
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </FileInputLabel>
                  {imageFile && (
                    <p
                      style={{
                        marginTop: "8px",
                        fontSize: "0.85rem",
                        color: "#555",
                      }}
                    >
                      Selected: {imageFile.name}
                    </p>
                  )}
                </FileInputWrapper>
              </Section>

              <NextButton type="button" onClick={handleSubmit}>
                Next: Staff Members
              </NextButton>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Section>
                <SectionHeader>Staff Members</SectionHeader>
                <StaffContainer>
                  {staffList.map((staff, index) => (
                    <div key={index}>
                      <StaffHeaderRow>
                        <TextBox
                          placeholder="Name"
                          value={staff.name}
                          onChange={(e: any) =>
                            handleStaffFieldChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />
                        <TextBox
                          placeholder="Role / Title"
                          value={staff.role}
                          onChange={(e: any) =>
                            handleStaffFieldChange(
                              index,
                              "role",
                              e.target.value
                            )
                          }
                        />
                        {staffList.length > 1 && (
                          <RemoveButton
                            type="button"
                            onClick={() => removeStaffMember(index)}
                          >
                            ✕
                          </RemoveButton>
                        )}
                      </StaffHeaderRow>

                      <div
                        style={{
                          marginTop: "12px",
                          fontSize: "0.85rem",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        Work schedule (must be within business operating hours)
                      </div>
                      <HoursGrid>
                        {DAY_KEYS.map((dayKey) => {
                          const day = staff.schedule[dayKey];
                          const businessDay = hoursSelection[dayKey];
                          const isBusinessClosed = businessDay.closed || !businessDay.open || !businessDay.close;
                          
                          const validStaffOpenTimes = getValidStaffTimes(dayKey, false);
                          const validStaffCloseTimes = getValidStaffTimes(dayKey, true, day.open);
                          
                          return (
                            <DayRow key={dayKey}>
                              <DayLabel>{DAY_LABELS[dayKey]}</DayLabel>
                              <TimeSelect
                                value={day.open}
                                onChange={(e) =>
                                  updateStaffDayHours(index, dayKey, {
                                    open: e.target.value,
                                  })
                                }
                                disabled={day.closed || isBusinessClosed}
                              >
                                <option value="">
                                  {isBusinessClosed ? "Closed" : "From"}
                                </option>
                                {validStaffOpenTimes.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </TimeSelect>
                              <TimeSelect
                                value={day.close}
                                onChange={(e) =>
                                  updateStaffDayHours(index, dayKey, {
                                    close: e.target.value,
                                  })
                                }
                                disabled={day.closed || isBusinessClosed}
                              >
                                <option value="">
                                  {isBusinessClosed ? "Closed" : "To"}
                                </option>
                                {validStaffCloseTimes.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </TimeSelect>
                              <ClosedToggle>
                                <input
                                  type="checkbox"
                                  checked={day.closed || isBusinessClosed}
                                  onChange={(e) =>
                                    updateStaffDayHours(index, dayKey, {
                                      closed: e.target.checked,
                                    })
                                  }
                                  disabled={isBusinessClosed}
                                />
                                Off
                              </ClosedToggle>
                            </DayRow>
                          );
                        })}
                      </HoursGrid>
                    </div>
                  ))}

                  <AddButton type="button" onClick={addStaffMember}>
                    + Add Staff Member
                  </AddButton>
                </StaffContainer>
              </Section>

              <BackButton type="button" onClick={() => setCurrentStep(1)}>
                ← Back to Business Info
              </BackButton>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Submit"}
              </SubmitButton>
            </>
          )}

          {error && <ErrorText>{error}</ErrorText>}
        </form>
      </FormWrapper>

      {popup && (
        <AlertPopup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    </PageContainer>
  );
};

export default BusinessRegistration;
