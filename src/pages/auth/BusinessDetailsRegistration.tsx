import React, { useState } from "react";
import styled from "styled-components";
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

  &:hover {
    background: ${(p) => p.theme.colors.secondary};
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

// ---------- Main Component ----------
const BusinessRegistration: React.FC = () => {
  const [staffList, setStaffList] = useState([
    { name: "", role: "", email: "", phone: "" },
  ]);

  const handleStaffChange = (index: number, field: string, value: string) => {
    const updated = [...staffList];
    (updated[index] as any)[field] = value;
    setStaffList(updated);
  };

  const addStaffMember = () => {
    setStaffList([...staffList, { name: "", role: "", email: "", phone: "" }]);
  };

  const removeStaffMember = (index: number) => {
    const updated = staffList.filter((_, i) => i !== index);
    setStaffList(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted staff:", staffList);
    alert("Business registered successfully!");
  };

  return (
    <PageContainer>
      <FormWrapper>
        <Title>Register Your Business</Title>
        <Subtitle>Manage your salon information and settings.</Subtitle>

        <form onSubmit={handleSubmit}>
          {/* ---- Business Info ---- */}
          <Section>
            <SectionHeader>Business Information</SectionHeader>
            <TwoColumnGrid>
              <TextBox placeholder="Business Name" />
              <TextBox placeholder="Business Type" />
              <TextBox placeholder="Email Address" />
              <TextBox placeholder="Phone Number" />
              <TextBox placeholder="Address" />
              <TextBox placeholder="City" />
            </TwoColumnGrid>
            <TextArea placeholder="About your business..." />
          </Section>

          {/* ---- Operating Hours ---- */}
          <Section>
            <SectionHeader>Operating Hours</SectionHeader>
            <TwoColumnGrid>
              <TextBox placeholder="Monday: 9:00 AM - 6:00 PM" />
              <TextBox placeholder="Tuesday: 9:00 AM - 6:00 PM" />
              <TextBox placeholder="Wednesday: 9:00 AM - 6:00 PM" />
              <TextBox placeholder="Thursday: 9:00 AM - 6:00 PM" />
              <TextBox placeholder="Friday: 9:00 AM - 6:00 PM" />
              <TextBox placeholder="Saturday: 10:00 AM - 4:00 PM" />
              <TextBox placeholder="Sunday: Closed" />
            </TwoColumnGrid>
          </Section>

          {/* ---- Staff Members ---- */}
          <Section>
            <SectionHeader>Staff Members</SectionHeader>
            <StaffContainer>
              {staffList.map((staff, index) => (
                <StaffRow key={index}>
                  <TextBox
                    placeholder="Name"
                    value={staff.name}
                    onChange={(e) =>
                      handleStaffChange(index, "name", e.target.value)
                    }
                  />
                  <TextBox
                    placeholder="Role / Title"
                    value={staff.role}
                    onChange={(e) =>
                      handleStaffChange(index, "role", e.target.value)
                    }
                  />
                  <TextBox
                    placeholder="Email"
                    value={staff.email}
                    onChange={(e) =>
                      handleStaffChange(index, "email", e.target.value)
                    }
                  />
                  <TextBox
                    placeholder="Phone"
                    value={staff.phone}
                    onChange={(e) =>
                      handleStaffChange(index, "phone", e.target.value)
                    }
                  />
                  {staffList.length > 1 && (
                    <RemoveButton onClick={() => removeStaffMember(index)}>
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

          {/* ---- Social Media ---- */}
          <Section>
            <SectionHeader>Social Media & Website</SectionHeader>
            <TwoColumnGrid>
              <TextBox placeholder="Instagram" />
              <TextBox placeholder="Facebook" />
              <TextBox placeholder="Website" />
              <TextBox placeholder="Other Link" />
            </TwoColumnGrid>
          </Section>

          <SubmitButton type="submit">Submit</SubmitButton>
        </form>
      </FormWrapper>
    </PageContainer>
  );
};

export default BusinessRegistration;
