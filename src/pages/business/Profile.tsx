import React from "react";
import styled from "styled-components";
import TextBox from "../../components/common/TextBox";
import { AiFillStar } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import placeholderImage from "../../images/errorLoading.png";

const PageContainer = styled.div`
  background: ${(p) => p.theme.colors.background};
  min-height: 100vh;
  padding: ${(p) => p.theme.spacing.xl};
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  background: ${(p) => p.theme.colors.white};
  border-radius: ${(p) => p.theme.borderRadius.large};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 900px; /* match BusinessDetailsRegistration */
  padding: ${(p) => p.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${(p) => p.theme.typography.fontSizes.xxlarge};
  color: ${(p) => p.theme.colors.secondary};
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: ${(p) => p.theme.typography.fontSizes.small};
  color: ${(p) => p.theme.colors.gray.dark};
  margin-top: ${(p) => p.theme.spacing.xs};
`;

/* -------- Salon Header -------- */
const SalonHeader = styled.div`
  background: ${(p) => p.theme.colors.white};
  border-radius: ${(p) => p.theme.borderRadius.medium};
  padding: ${(p) => p.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.lg};
`;

const SalonImage = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
`;

const SalonDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const SalonName = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  color: #444;
  font-size: 15px;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  svg {
    color: #f5b300;
  }
`;

/* -------- Section Styles -------- */
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.sm};
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

const SocialGrid = styled(Grid)`
  margin-top: 8px;
`;

const BusinessProfile: React.FC = () => {
  return (
    <PageContainer>
      <Wrapper>
        <div>
          <Title>Your Profile</Title>
          <Subtitle>Manage your salon information and settings.</Subtitle>
        </div>

        {/* Salon Header */}
        <SalonHeader>
          <SalonImage src={placeholderImage} alt="Salon" />
          <SalonDetails>
            <SalonName>Glamour Beauty Salon</SalonName>
            <StatsRow>
              <span>
                {React.createElement(AiFillStar as any)} 4.8
              </span>
              <span>342 Clients</span>
              <span>8 Staff</span>
            </StatsRow>
          </SalonDetails>
        </SalonHeader>

        {/* Business Info */}
        <Section>
          <SectionHeader>
            <SectionTitle>Business Information</SectionTitle>
            <EditButton>
              {React.createElement(FiEdit2 as any, { size: 14 })} Edit
            </EditButton>
          </SectionHeader>
          <Grid>
            <TextBox placeholder="Business Name" value="Glamour Beauty Salon" />
            <TextBox placeholder="Business Type" value="Beauty & Salon" />
            <TextBox placeholder="Email" value="glamour@example.com" />
            <TextBox placeholder="Phone Number" value="+973 0000 0000" />
            <TextBox placeholder="Address" value="Seef Mall, Bahrain" />
          </Grid>
          <TextArea
            placeholder="Description"
            value="Glamour Beauty Salon offers top-tier hair, nail, and skincare services. Experience relaxation in style."
          />
        </Section>

        {/* Operating Hours */}
        <Section>
          <SectionHeader>
            <SectionTitle>Operating Hours</SectionTitle>
            <EditButton>
              {React.createElement(FiEdit2 as any, { size: 14 })} Edit
            </EditButton>
          </SectionHeader>
          <Grid>
            <TextBox placeholder="Monday" value="9:00 AM - 6:00 PM" />
            <TextBox placeholder="Tuesday" value="9:00 AM - 6:00 PM" />
            <TextBox placeholder="Wednesday" value="9:00 AM - 6:00 PM" />
            <TextBox placeholder="Thursday" value="9:00 AM - 6:00 PM" />
            <TextBox placeholder="Friday" value="9:00 AM - 6:00 PM" />
            <TextBox placeholder="Saturday" value="10:00 AM - 4:00 PM" />
            <TextBox placeholder="Sunday" value="Closed" />
          </Grid>
        </Section>

        {/* Staff Members */}
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

        {/* Social Media */}
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
    </PageContainer>
  );
};

export default BusinessProfile;
