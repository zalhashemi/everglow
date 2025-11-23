import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import Button from "../../components/common/Button";
import SecondaryButton from "../../components/common/SecondaryButton";
import api from "../../utils/api";

// NEW IMPORT
import AlertPopup from "../../components/common/AlertPopup";

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

const HelperText = styled.p`
  margin-top: 8px;
  font-size: 13px;
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

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NEW: popup state
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!businessId || !selectedServices || !selectedServices.length) {
      navigate(-1);
    }
  }, [businessId, selectedServices, navigate]);

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

        setAvailableSlots(res.data || []);
        setSelectedSlot("");
      } catch (err: any) {
        console.error("Error loading slots", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load available slots. Please try again."
        );
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [businessId, totalDurationMinutes, selectedDate]);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) {
      setError("Please select a date and time.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const startTimeIso = `${selectedDate}T${selectedSlot}:00`;
      const serviceIds = selectedServices.map((s) => s._id);

      if (isReschedule && bookingId) {
        await api.patch(`/bookings/${bookingId}`, {
          action: "reschedule",
          newStartTime: startTimeIso,
          serviceIds,
        });
      } else {
        await api.post("/bookings", {
          businessId,
          serviceIds,
          startTime: startTimeIso,
          notes: "",
        });
      }

      // SHOW POPUP INSTEAD OF ALERT
      setShowPopup(true);

      // redirect after popup closes (5 seconds + user can close early)
      setTimeout(() => {
        navigate("/bookings");
      }, 5200);
    } catch (err: any) {
      console.error("Confirm booking error:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to confirm booking. The slot may have just been taken.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
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

          <HelperText>
            Time options are limited to the salon's working hours for the
            selected day. If a slot is already booked, it will not appear.
          </HelperText>

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonRow>
            <SecondaryButton width="160px" onClick={() => navigate(-1)}>
              Back
            </SecondaryButton>
            <Button width="220px" onClick={handleConfirm} disabled={submitting}>
              {submitting
                ? "Saving..."
                : isReschedule
                ? "Confirm Changes"
                : "Confirm Booking"}
            </Button>
          </ButtonRow>
        </Section>
      </ContentWrapper>

      {/* POPUP */}
      {showPopup && (
  <AlertPopup
    title="Booking Confirmed!"
    message="Your appointment has been successfully booked."
    onClose={() => {
      setShowPopup(false);
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
        },
      });
    }}
  />
)}

    </PageWrapper>
  );
};

export default SelectDatePage;
