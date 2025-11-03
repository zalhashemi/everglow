import React, { useState } from 'react';
import styled from 'styled-components';
import TextBox from '../../components/common/TextBox';
import Button from '../../components/common/Button';
import SalonCard from '../../components/common/SalonCard';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl};
`;

const SearchSection = styled.div`
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const FiltersSection = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ResultsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.gray.dark};
  font-size: ${props => props.theme.typography.fontSizes.large};
`;

const CustomerHomepage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    service: '',
    rating: '',
    price: '',
  });

  // Mock data for example
  const mockBusinesses = [
    {
      id: 1,
      name: "Elegant Beauty Salon",
      image: "https://example.com/salon1.jpg",
      rating: 4.8,
      location: "New York, NY",
      services: ["Haircut", "Coloring", "Styling"],
    },
    {
      id: 2,
      name: "Wellness Spa Center",
      image: "https://example.com/salon2.jpg",
      rating: 4.5,
      location: "Brooklyn, NY",
      services: ["Massage", "Facial", "Manicure"],
    },
    // Add more mock data as needed
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
  };

  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <Container>
      <SearchSection>
        <SearchForm onSubmit={handleSearch}>
          <TextBox
            placeholder="Search for salons, spas, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => handleSearch}>
            Search
          </Button>
        </SearchForm>

        <FiltersSection>
          <FilterGroup>
            <Button
              variant={selectedFilters.service === 'hair' ? 'primary' : 'outline'}
              onClick={() => handleFilterChange('service', 'hair')}
            >
              Hair
            </Button>
            <Button
              variant={selectedFilters.service === 'nails' ? 'primary' : 'outline'}
              onClick={() => handleFilterChange('service', 'nails')}
            >
              Nails
            </Button>
            <Button
              variant={selectedFilters.service === 'spa' ? 'primary' : 'outline'}
              onClick={() => handleFilterChange('service', 'spa')}
            >
              Spa
            </Button>
          </FilterGroup>

          <FilterGroup>
            <Button
              variant={selectedFilters.rating === 'high' ? 'primary' : 'outline'}
              onClick={() => handleFilterChange('rating', 'high')}
            >
              Highest Rated
            </Button>
          </FilterGroup>

          <FilterGroup>
            <Button
              variant={selectedFilters.price === 'low' ? 'primary' : 'outline'}
              onClick={() => handleFilterChange('price', 'low')}
            >
              $ Low to High
            </Button>
          </FilterGroup>
        </FiltersSection>
      </SearchSection>

      <ResultsSection>
        {mockBusinesses.length > 0 ? (
          mockBusinesses.map(business => (
            <SalonCard
              key={business.id}
              name={business.name}
              image={business.image}
              rating={business.rating}
              location={business.location}
              services={business.services}
              onClick={() => {/* Handle navigation to business page */}}
            />
          ))
        ) : (
          <NoResults>
            No results found. Try adjusting your search or filters.
          </NoResults>
        )}
      </ResultsSection>
    </Container>
  );
};

export default CustomerHomepage;