import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import Button from "../../components/common/Button";
import SecondaryButton from "../../components/common/SecondaryButton";
import api from "../../utils/api";

type ServiceDto = {
  _id: string;
  name: string;
  durationMinutes: number;
  priceBHD: number;
};

type LocationState = {
  isReschedule?: boolean;
  bookingId?: string;
  businessId: string;
  businessName: string;
  selectedServices: ServiceDto[];
  totalDurationMinutes: number;
  totalPrice: number;
};

type StaffOption = {
  index: number;
  fullName: string;
  role?: string;
};

const PageWrapper = styled.div`
  background-color: #FAF6EA;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  padding: 40px 0 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #27374d;
`;

const SubTitle = styled.p`
  font-size: 15px;
  color: #555;
`;

const Section = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #27374d;
  margin-bottom: 12px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const Label = styled.label`
  font-size: 14px;
  color: #555;
`;

const DateInput = styled.input`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
`;

const TimeSelect = styled.select`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  min-width: 160px;
`;

const StaffSelect = styled.select`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  min-width: 200px;
`;

const HelperText = styled.p`
  margin-top: 8px;
  font-size: 13px;
  color: #777;
`;

const SmallText = styled.p`
  margin-top: 4px;
  font-size: 12px;
  color: #777;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 8px;
`;

const SelectDatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const {
    isReschedule,
    bookingId,
    businessId,
    businessName,
    selectedServices,
    totalDurationMinutes,
    totalPrice,
  } = state;

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const [availableStaff, setAvailableStaff] = useState<StaffOption[]>([]);
  const [selectedStaffIndex, setSelectedStaffIndex] = useState<string>("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staffError, setStaffError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId || !selectedServices || !selectedServices.length) {
      navigate(-1);
    }
  }, [businessId, selectedServices, navigate]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  const isToday = (dateString: string) => {
    return dateString === getTodayDate();
  };

  const getFilteredSlots = (slots: string[]): string[] => {
    if (!isToday(selectedDate)) {
      return slots;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return slots.filter((slot) => {
      const [hourStr, minuteStr] = slot.split(":");
      const slotHour = parseInt(hourStr, 10);
      const slotMinute = parseInt(minuteStr, 10);

      if (slotHour > currentHour) return true;
      if (slotHour === currentHour && slotMinute > currentMinute) return true;
      return false;
    });
  };

  useEffect(() => {
    if (!businessId || !totalDurationMinutes || !selectedDate) return;

    const loadSlots = async () => {
      try {
        setLoadingSlots(true);
        setError(null);

        const res = await api.get<string[]>(
          `/bookings/available-slots/${businessId}`,
          {
            params: {
              date: selectedDate,
              duration: totalDurationMinutes,
            },
          }
        );

        const rawSlots = res.data || [];
        const filteredSlots = getFilteredSlots(rawSlots);

        setAvailableSlots(filteredSlots);
        setSelectedSlot("");
        setAvailableStaff([]);
        setSelectedStaffIndex("");
        setStaffError(null);
      } catch (err: any) {
        console.error("Error loading slots", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load available slots. Please try again."
        );
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [businessId, totalDurationMinutes, selectedDate]);

  useEffect(() => {
    if (!businessId || !selectedDate || !selectedSlot) {
      setAvailableStaff([]);
      setSelectedStaffIndex("");
      setStaffError(null);
      return;
    }

    const loadStaff = async () => {
      try {
        setLoadingStaff(true);
        setStaffError(null);

        const startTimeIso = `${selectedDate}T${selectedSlot}:00`;

        const res = await api.get<{ staff: StaffOption[] }>(
          "/bookings/available-staff",
          {
            params: {
              businessId,
              startTime: startTimeIso,
            },
          }
        );

        const staff = res.data?.staff || [];
        setAvailableStaff(staff);
        setSelectedStaffIndex("");
      } catch (err: any) {
        console.error("Error loading staff", err);
        setAvailableStaff([]);
        setStaffError(
          err?.response?.data?.message ||
            "Failed to load staff availability. Please try again."
        );
      } finally {
        setLoadingStaff(false);
      }
    };

    loadStaff();
  }, [businessId, selectedDate, selectedSlot]);

  const handleNext = () => {
    if (!selectedDate || !selectedSlot) {
      setError("Please select a date and time.");
      return;
    }

    if (selectedDate < getTodayDate()) {
      setError("Cannot book appointments in the past.");
      return;
    }

    if (!selectedStaffIndex) {
      setError("Please select a staff member.");
      return;
    }

    setError(null);

    const staffIndexNumber = Number(selectedStaffIndex);
    const staffObj = availableStaff.find(
      (s) => s.index === staffIndexNumber
    );

    navigate("/book/summary", {
      state: {
        businessId,
        businessName,
        selectedServices,
        totalDurationMinutes,
        totalPrice,
        date: selectedDate,
        time: selectedSlot,
        isReschedule,
        bookingId,
        staffIndex: staffIndexNumber,
        staffName: staffObj?.fullName || "",
      },
    });
  };

  return (
    <PageWrapper>
      <TabBar type="customer" />

      <ContentWrapper>
        <div>
          <Title>{businessName}</Title>
          <SubTitle>
            Select a date and time for your{" "}
            {selectedServices.map((s) => s.name).join(", ")} (
            {totalDurationMinutes} mins · {totalPrice.toFixed(2)} BHD)
          </SubTitle>
        </div>

        <Section>
          <SectionTitle>Choose Date & Time</SectionTitle>

          <FormRow style={{ marginBottom: 16 }}>
            <Label>
              Date
              <br />
              <DateInput
                type="date"
                value={selectedDate}
                min={getTodayDate()}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Label>

            <Label>
              Time
              <br />
              <TimeSelect
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                disabled={loadingSlots || availableSlots.length === 0}
              >
                <option value="">
                  {loadingSlots
                    ? "Loading..."
                    : availableSlots.length === 0
                    ? "No slots available"
                    : "Select time"}
                </option>

                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </TimeSelect>
            </Label>
          </FormRow>

          <FormRow style={{ marginBottom: 8 }}>
            <Label>
              Staff Member
              <br />
              <StaffSelect
                value={selectedStaffIndex}
                onChange={(e) => setSelectedStaffIndex(e.target.value)}
                disabled={
                  !selectedSlot ||
                  loadingStaff ||
                  availableStaff.length === 0
                }
              >
                <option value="">
                  {!selectedSlot
                    ? "Select a time first"
                    : loadingStaff
                    ? "Loading staff..."
                    : availableStaff.length === 0
                    ? "No staff available for this time"
                    : "Select staff"}
                </option>
                {availableStaff.map((staff) => (
                  <option key={staff.index} value={staff.index}>
                    {staff.fullName}
                    {staff.role ? ` - ${staff.role}` : ""}
                  </option>
                ))}
              </StaffSelect>
            </Label>
          </FormRow>

          {staffError && <ErrorText>{staffError}</ErrorText>}

          <HelperText>
            Time options are limited to the salon's working hours for the
            selected day. If a slot is already booked, it will not appear.
          </HelperText>
          <SmallText>
            Staff options update based on the selected time. Only staff who are
            working and not already booked will be shown.
          </SmallText>

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonRow>
            <SecondaryButton width="160px" onClick={() => navigate(-1)}>
              Back
            </SecondaryButton>
            <Button width="220px" onClick={handleNext}>
              Review Booking
            </Button>
          </ButtonRow>
        </Section>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default SelectDatePage;
