import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import L from "../../leafletSetup";
import type { LeafletMouseEvent } from "leaflet";
import AlertPopup from "../../components/common/AlertPopup";
import TextBox from "../../components/common/TextBox";

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

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${(p) => p.theme.spacing.md};
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

/* --------- Pretty file input --------- */

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

/* ------------------------------------- */

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

const BusinessRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    // kept for backend validation but hidden in UI
    type: "Salon",
    email: "",
    phone: "",
    address: "",
    city: "",
    about: "",
  });

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
      schedule[day] = { ...schedule[day], ...changes };
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

  const updateDayHours = (day: DayKey, changes: Partial<DayHours>) => {
    setHoursSelection((prev) => {
      const updatedDay: DayHours = { ...prev[day], ...changes };
      return { ...prev, [day]: updatedDay };
    });
  };

  /** ✅ Validate that working hours are fully set (mandatory) */
  const validateOperatingHours = (): boolean => {
    // every day must either be Closed OR have both open & close
    const invalidDay = DAY_KEYS.find((dayKey) => {
      const d = hoursSelection[dayKey];
      if (d.closed) return false;
      return !(d.open && d.close);
    });

    if (invalidDay) {
      setError(
        "Please set working hours for all days (From & To) or mark them as Closed before continuing."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Step 1 → go to Step 2 but only if hours are valid
    if (currentStep !== 2) {
      const ok = validateOperatingHours();
      if (!ok) return;
      setCurrentStep(2);
      return;
    }

    // On final submit, validate again
    const ok = validateOperatingHours();
    if (!ok) return;

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
          // this should no longer happen because of validation,
          // but we keep it safe:
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
      }

      setPopup({
  type: "success",
  message: "Business registered successfully!",
});

// Auto redirect after popup closes
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

  const [popup, setPopup] = useState<{
  type: "error" | "success";
  message: string;
} | null>(null);


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
                <SectionHeader>Business Information</SectionHeader>
                <TwoColumnGrid>
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
                    placeholder="Email Address"
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
                </TwoColumnGrid>
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
                          {TIME_OPTIONS.map((time) => (
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
                <TwoColumnGrid>
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
                </TwoColumnGrid>
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
                        Work schedule
                      </div>
                      <HoursGrid>
                        {DAY_KEYS.map((dayKey) => {
                          const day = staff.schedule[dayKey];
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
                                  updateStaffDayHours(index, dayKey, {
                                    close: e.target.value,
                                  })
                                }
                                disabled={day.closed}
                              >
                                <option value="">To</option>
                                {TIME_OPTIONS.map((time) => (
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
                                    updateStaffDayHours(index, dayKey, {
                                      closed: e.target.checked,
                                    })
                                  }
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
