import React from "react";
import styled from "styled-components";
import TextBox from "../../components/common/TextBox";
import TabBar from "../../components/common/TabBar";
import ProfileHeader from "../../components/common/ProfileHeader";
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

const FullWidthRow = styled.div`
  width: 100%;
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

const StaffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
`;

const StaffCard = styled.div`
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const StaffAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const StaffName = styled.h3`
  font-size: 16px;
  font-weight: 600;
`;

const StaffRole = styled.p`
  font-size: 14px;
  color: #777;
`;

const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 8px;
`;

/* -------- Component -------- */
const BusinessProfile: React.FC = () => {
  return (
    <PageContainer>
      {/* ✅ Business Tab Bar */}
      <TabBar type="business" />

      <ContentWrapper>
        {/* ✅ Title above everything */}
        <Title>Your Profile</Title>

        {/* ✅ Profile Header */}
        <HeaderWrapper>
          <ProfileHeader
            type="business"
            name="Glamour Beauty Salon"
            image={placeholderImage}
            stat1={4.8}
            stat2={342}
            stat3={8}
          />
        </HeaderWrapper>

        {/* ✅ Rest of Profile Sections */}
        <Wrapper>
          {/* BUSINESS INFO */}
          <Section>
            <SectionHeader>
              <SectionTitle>Business Information</SectionTitle>
              <EditButton>
                {React.createElement(FiEdit2 as any, { size: 14 })} Edit
              </EditButton>
            </SectionHeader>

            {/* Row 1 - Business Name + Type */}
            <Row>
              <HalfWidthBox>
                <TextBox placeholder="Business Name" value="Glamour Beauty Salon" />
              </HalfWidthBox>
              <HalfWidthBox>
                <TextBox placeholder="Business Type" value="Beauty & Salon" />
              </HalfWidthBox>
            </Row>

            {/* Row 2 - Email + Phone */}
            <Row>
              <HalfWidthBox>
                <TextBox placeholder="Email" value="glamour@example.com" />
              </HalfWidthBox>
              <HalfWidthBox>
                <TextBox placeholder="Phone Number" value="+973 0000 0000" />
              </HalfWidthBox>
            </Row>

            {/* Row 3 - Address */}
            <FullWidthRow>
              <TextBox placeholder="Address" value="Seef Mall, Bahrain" />
            </FullWidthRow>

            {/* Description */}
            <TextArea
              placeholder="Description"
              value="Glamour Beauty Salon offers top-tier hair, nail, and skincare services. Experience relaxation in style."
            />
          </Section>

          {/* OPERATING HOURS */}
          <Section>
            <SectionHeader>
              <SectionTitle>Operating Hours</SectionTitle>
              <EditButton>
                {React.createElement(FiEdit2 as any, { size: 14 })} Edit
              </EditButton>
            </SectionHeader>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              <TextBox value="Sunday 9:00 AM - 6:00 PM" />
              <TextBox value="Tuesday 9:00 AM - 6:00 PM" />
              <TextBox value="Wednesday 9:00 AM - 6:00 PM" />
              <TextBox value="Thursday 9:00 AM - 6:00 PM" />
              <TextBox value="Friday 9:00 AM - 6:00 PM" />
              <TextBox value="Saturday 10:00 AM - 4:00 PM" />
              <TextBox value="Sunday Closed" />
            </div>
          </Section>

          {/* STAFF MEMBERS */}
          <Section>
            <SectionHeader>
              <SectionTitle>Staff Members</SectionTitle>
              <EditButton>
                {React.createElement(FiEdit2 as any, { size: 14 })} Manage
              </EditButton>
            </SectionHeader>

            <StaffGrid>
              <StaffCard>
                <StaffAvatar src={placeholderImage} alt="Staff" />
                <StaffName>Sarah Khalifa</StaffName>
                <StaffRole>Hair Stylist</StaffRole>
              </StaffCard>
              <StaffCard>
                <StaffAvatar src={placeholderImage} alt="Staff" />
                <StaffName>Michael Chen</StaffName>
                <StaffRole>Color Specialist</StaffRole>
              </StaffCard>
              <StaffCard>
                <StaffAvatar src={placeholderImage} alt="Staff" />
                <StaffName>Emily Johnson</StaffName>
                <StaffRole>Nail Technician</StaffRole>
              </StaffCard>
              <StaffCard>
                <StaffAvatar src={placeholderImage} alt="Staff" />
                <StaffName>Jessica Lee</StaffName>
                <StaffRole>Receptionist</StaffRole>
              </StaffCard>
            </StaffGrid>
          </Section>

          {/* SOCIAL MEDIA */}
          <Section>
            <SectionHeader>
              <SectionTitle>Social Media & Website</SectionTitle>
              <EditButton>
                {React.createElement(FiEdit2 as any, { size: 14 })} Edit
              </EditButton>
            </SectionHeader>

            <SocialGrid>
              <TextBox placeholder="Instagram" value="@glamourbeauty" />
              <TextBox placeholder="Facebook" value="facebook.com/glamour" />
              <TextBox placeholder="Website" value="www.glamourbeauty.com" />
              <TextBox placeholder="Other Link" value="linktr.ee/glamour" />
            </SocialGrid>
          </Section>
        </Wrapper>
      </ContentWrapper>
    </PageContainer>
  );
};

export default BusinessProfile;
