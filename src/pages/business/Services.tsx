import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import TextBox from '../../components/common/TextBox';
import ServiceTile from '../../components/common/ServiceTile';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.xxlarge};
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.medium};
  width: 100%;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};
`;

const BusinessServices: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [services, setServices] = useState([
    {
      id: '1',
      name: 'Haircut',
      duration: '45 min',
      price: 50,
      description: 'Professional haircut service including wash and style'
    },
    {
      id: '2',
      name: 'Hair Coloring',
      duration: '2 hrs',
      price: 120,
      description: 'Full hair coloring service with premium products'
    },
    // Add more services
  ]);

  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    description: ''
  });

  const handleAddService = () => {
    setSelectedService(null);
    setFormData({
      name: '',
      duration: '',
      price: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price.toString(),
      description: service.description
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService) {
      // Update existing service
      setServices(services.map(service =>
        service.id === selectedService.id
          ? { ...service, ...formData, price: parseFloat(formData.price) }
          : service
      ));
    } else {
      // Add new service
      setServices([
        ...services,
        {
          id: (services.length + 1).toString(),
          ...formData,
          price: parseFloat(formData.price)
        }
      ]);
    }
    setShowModal(false);
  };

  return (
    <Container>
      <Content>
        <Header>
          <Title>Services</Title>
          <Button onClick={handleAddService}>
            Add New Service
          </Button>
        </Header>

        <ServicesGrid>
          {services.map(service => (
            <ServiceTile
              key={service.id}
              name={service.name}
              duration={service.duration}
              price={service.price}
              description={service.description}
              onClick={() => handleEditService(service)}
            />
          ))}
        </ServicesGrid>

        {showModal && (
          <Modal>
            <ModalContent>
              <Title>
                {selectedService ? 'Edit Service' : 'Add New Service'}
              </Title>
              <Form onSubmit={handleSubmit}>
                <TextBox
                  placeholder="Service Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                <TextBox
                  placeholder="Duration (e.g., 45 min)"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
                <TextBox
                  placeholder="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
                <TextBox
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <ButtonGroup>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    {selectedService ? 'Update' : 'Add'} Service
                  </Button>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </Content>
    </Container>
  );
};

export default BusinessServices;