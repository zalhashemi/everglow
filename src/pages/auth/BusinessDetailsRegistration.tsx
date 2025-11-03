import React, { useState } from 'react';
import styled from 'styled-components';
import TextBox from '../../components/common/TextBox';
import Button from '../../components/common/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl};
`;

const FormContainer = styled.div`
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.secondary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.xxlarge};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FormSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.large};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
`;

const BusinessDetailsRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
    description: '',
    category: '',
    openingHours: '',
    closingHours: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle business registration logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      <FormContainer>
        <Title>Business Details</Title>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            <TextBox
              placeholder="Business Name"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
            />
            <TextBox
              placeholder="Business Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
            <TextBox
              placeholder="Business Category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            />
          </FormSection>

          <FormSection>
            <SectionTitle>Contact Information</SectionTitle>
            <TextBox
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
            <TextBox
              placeholder="Website (Optional)"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            />
          </FormSection>

          <FormSection>
            <SectionTitle>Address</SectionTitle>
            <TextBox
              placeholder="Street Address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
            <Grid>
              <TextBox
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
              <TextBox
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              />
            </Grid>
            <TextBox
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
            />
          </FormSection>

          <FormSection>
            <SectionTitle>Business Hours</SectionTitle>
            <Grid>
              <TextBox
                placeholder="Opening Hours"
                value={formData.openingHours}
                onChange={(e) => setFormData(prev => ({ ...prev, openingHours: e.target.value }))}
              />
              <TextBox
                placeholder="Closing Hours"
                value={formData.closingHours}
                onChange={(e) => setFormData(prev => ({ ...prev, closingHours: e.target.value }))}
              />
            </Grid>
          </FormSection>

          <Button onClick={() => handleSubmit} fullWidth>
            Complete Registration
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default BusinessDetailsRegistration;