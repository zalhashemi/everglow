import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TextBox from "../../components/common/TextBox";

// ---------- Styled Components ----------
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
  gap: ${(p) => p.theme.spacing.md};
`;

const StaffRow = styled.div`
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

// ---------- Main Component ----------
const BusinessRegistration: React.FC = () => {
  const navigate = useNavigate();

  // which step we’re on: 1 = business/services, 2 = staff (people)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // business info state
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    type: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    about: "",
  });

  // operating hours state
  const [operatingHours, setOperatingHours] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });

  // social links state
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    facebook: "",
    website: "",
    other: "",
  });

  // staff state
  const [staffList, setStaffList] = useState([
    { name: "", role: "", email: "", phone: "" },
  ]);

  // image file for cover photo
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStaffChange = (index: number, field: string, value: string) => {
    setStaffList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addStaffMember = () => {
    setStaffList((prev) => [
      ...prev,
      { name: "", role: "", email: "", phone: "" },
    ]);
  };

  const removeStaffMember = (index: number) => {
    setStaffList((prev) => prev.filter((_, i) => i !== index));
  };

  // handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  // only allow submit on last step
  if (currentStep !== 2) {
    setCurrentStep(2);
    return;
  }

  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("businessInfo", JSON.stringify(businessInfo));
    formData.append("operatingHours", JSON.stringify(operatingHours));
    formData.append("socialLinks", JSON.stringify(socialLinks));
    formData.append("staff", JSON.stringify(staffList));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    console.log("📤 Sending FormData with image:", {
      businessInfo,
      operatingHours,
      socialLinks,
      staffList,
      imageFileName: imageFile?.name,
    });

    const res = await fetch("http://localhost:5000/api/business/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("📥 Response data:", data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to register business");
    }

    // ✅ NEW: save token so protected routes work
    if (data.token) {
      localStorage.setItem("businessToken", data.token);
      localStorage.setItem("businessInfo", JSON.stringify(data.business));
    }

    alert("Business registered successfully!");
    navigate("/business/dashboard");
  } catch (err: any) {
    console.error("Error registering business:", err);
    setError(err.message || "Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};




  return (
    <PageContainer>
      <FormWrapper>
        <Title>Register Your Business</Title>
        <Subtitle>Manage your salon information and settings.</Subtitle>
        <StepIndicator>
          Step {currentStep} of 2 ·{" "}
          {currentStep === 1 ? "Business & Services" : "Staff Members"}
        </StepIndicator>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* ---- STEP 1: Business Info + Hours + Socials ---- */}
          {currentStep === 1 && (
            <>
              {/* Business Info */}
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
                    placeholder="Business Type"
                    value={businessInfo.type}
                    onChange={(e: any) =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        type: e.target.value,
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

              {/* Operating Hours */}
              <Section>
                <SectionHeader>Operating Hours</SectionHeader>
                <TwoColumnGrid>
                  <TextBox
                    placeholder="Monday: 9:00 AM - 6:00 PM"
                    value={operatingHours.monday}
                    onChange={(e: any) =>
                      setOperatingHours((prev) => ({
                        ...prev,
                        monday: e.target.value,
                      }))
                    }
                  />
                  <TextBox
                    placeholder="Tuesday: 9:00 AM - 6:00 PM"
                    value={operatingHours.tuesday}
                    onChange={(e: any) =>
                      setOperatingHours((prev) => ({
                        ...prev,
                        tuesday: e.target.value,
                      }))
                    }
                  />
                  <TextBox
                    placeholder="Wednesday: 9:00 AM - 6:00 PM"
                    value={operatingHours.wednesday}
                    onChange={(e: any) =>
                      setOperatingHours((prev) => ({
                        ...prev,
                        wednesday: e.target.value,
                      }))
                    }
                  />
                  <TextBox
                    placeholder="Thursday: 9:00 AM - 6:00 PM"
                    value={operatingHours.thursday}
                    onChange={(e: any) =>
                      setOperatingHours((prev) => ({
                        ...prev,
                        thursday: e.target.value,
                      }))
                    }
                  />
                  <TextBox
                    placeholder="Friday: 9:00 AM - 6:00 PM"
                    value={operatingHours.friday}
                    onChange={(e: any) =>
                      setOperatingHours((prev) => ({
                        ...prev,
                        friday: e.target.value,
                      }))
                    }
                  />
                  <TextBox
                    placeholder="Saturday: 10:00 AM - 4:00 PM"
                    value={operatingHours.saturday}
                    onChange={(e: any) =>
                      setOperatingHours((prev) => ({
                        ...prev,
                        saturday: e.target.value,
                      }))
                    }
                  />
                  <TextBox
                    placeholder="Sunday: Closed"
                    value={operatingHours.sunday}
                    onChange={(e: any) =>
                      setOperatingHours((prev) => ({
                        ...prev,
                        sunday: e.target.value,
                      }))
                    }
                  />
                </TwoColumnGrid>
              </Section>

              {/* Social Media */}
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
                    placeholder="Facebook"
                    value={socialLinks.facebook}
                    onChange={(e: any) =>
                      setSocialLinks((prev) => ({
                        ...prev,
                        facebook: e.target.value,
                      }))
                    }
                  />
                  <TextBox
                    placeholder="Website"
                    value={socialLinks.website}
                    onChange={(e: any) =>
                      setSocialLinks((prev) => ({
                        ...prev,
                        website: e.target.value,
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

              {/* Cover Image Upload */}
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
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
              </Section>

              <NextButton type="button" onClick={() => setCurrentStep(2)}>
                Next: Staff Members
              </NextButton>
            </>
          )}

          {/* ---- STEP 2: Staff ---- */}
          {currentStep === 2 && (
            <>
              <Section>
                <SectionHeader>Staff Members</SectionHeader>
                <StaffContainer>
                  {staffList.map((staff, index) => (
                    <StaffRow key={index}>
                      <TextBox
                        placeholder="Name"
                        value={staff.name}
                        onChange={(e: any) =>
                          handleStaffChange(index, "name", e.target.value)
                        }
                      />
                      <TextBox
                        placeholder="Role / Title"
                        value={staff.role}
                        onChange={(e: any) =>
                          handleStaffChange(index, "role", e.target.value)
                        }
                      />
                      <TextBox
                        placeholder="Email"
                        value={staff.email}
                        onChange={(e: any) =>
                          handleStaffChange(index, "email", e.target.value)
                        }
                      />
                      <TextBox
                        placeholder="Phone"
                        value={staff.phone}
                        onChange={(e: any) =>
                          handleStaffChange(index, "phone", e.target.value)
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
                    </StaffRow>
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
    </PageContainer>
  );
};

export default BusinessRegistration;
