import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SessionFormat, AVAILABLE_SKILLS } from '../types/session';
import { coursesAPI } from '../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchInputContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const RangeSlider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const RangeDisplay = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #666;
`;

const SearchButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ResultsCount = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TeacherCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TeacherName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const SkillName = styled.div`
  color: #007bff;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const TeacherDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
`;

const Price = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #28a745;
  margin-bottom: 1rem;
`;

const BookButton = styled.button`
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #218838;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface Teacher {
  id: string;
  name: string;
  skill: string;
  price: number;
  rating: number;
  distance: number;
  format: SessionFormat[];
  location: string;
  experience: string;
}

interface Filters {
  location: string;
  maxDistance: number;
  priceRange: [number, number];
  format: SessionFormat | 'ALL';
}

interface SkillSearchProps {
  onTeacherSelect: (teacherId: string, teacherData: Teacher) => void;
  initialSkill?: string;
  initialLocation?: string;
  isAuthenticated?: boolean;
}

const SkillSearch: React.FC<SkillSearchProps> = ({ onTeacherSelect, initialSkill = '', initialLocation = '', isAuthenticated = true }) => {
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [filters, setFilters] = useState<Filters>({
    location: initialLocation,
    maxDistance: 25,
    priceRange: [0, 200],
    format: 'ALL'
  });
  const [results, setResults] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6;

  // Mock data
  const mockTeachers: Teacher[] = [
    // Music & Arts
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Sarah Johnson',
      skill: 'Guitar',
      price: 50,
      rating: 4.8,
      distance: 2.3,
      format: [SessionFormat.IN_PERSON, SessionFormat.ONLINE],
      location: 'Downtown',
      experience: '8 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Mike Chen',
      skill: 'Piano',
      price: 60,
      rating: 4.9,
      distance: 1.8,
      format: [SessionFormat.IN_PERSON],
      location: 'Midtown',
      experience: '12 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Jennifer Martinez',
      skill: 'Voice',
      price: 55,
      rating: 4.7,
      distance: 3.5,
      format: [SessionFormat.IN_PERSON, SessionFormat.ONLINE],
      location: 'Arts District',
      experience: '9 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Robert Thompson',
      skill: 'Drums',
      price: 45,
      rating: 4.6,
      distance: 4.2,
      format: [SessionFormat.IN_PERSON],
      location: 'Music Quarter',
      experience: '6 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      name: 'Amy Foster',
      skill: 'Photography',
      price: 70,
      rating: 4.8,
      distance: 2.9,
      format: [SessionFormat.IN_PERSON, SessionFormat.ONLINE],
      location: 'Studio District',
      experience: '11 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      name: 'Carlos Rivera',
      skill: 'Drawing',
      price: 40,
      rating: 4.5,
      distance: 5.8,
      format: [SessionFormat.IN_PERSON],
      location: 'Art Center',
      experience: '7 years'
    },
    
    // Programming & Tech
    {
      id: '00000000-0000-0000-0000-000000000007',
      name: 'Emma Davis',
      skill: 'Python Programming',
      price: 75,
      rating: 4.7,
      distance: 5.2,
      format: [SessionFormat.ONLINE],
      location: 'Tech District',
      experience: '6 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000008',
      name: 'David Kim',
      skill: 'Web Development',
      price: 80,
      rating: 4.9,
      distance: 6.8,
      format: [SessionFormat.ONLINE],
      location: 'Tech Hub',
      experience: '7 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000009',
      name: 'Rachel Green',
      skill: 'JavaScript',
      price: 70,
      rating: 4.6,
      distance: 7.1,
      format: [SessionFormat.ONLINE],
      location: 'Innovation Park',
      experience: '5 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000010',
      name: 'Kevin Wong',
      skill: 'React',
      price: 85,
      rating: 4.8,
      distance: 8.2,
      format: [SessionFormat.ONLINE],
      location: 'Silicon Valley',
      experience: '8 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000011',
      name: 'Sophia Clark',
      skill: 'Data Science',
      price: 90,
      rating: 4.9,
      distance: 9.5,
      format: [SessionFormat.ONLINE],
      location: 'Research Center',
      experience: '10 years'
    },
    
    // Languages
    {
      id: '00000000-0000-0000-0000-000000000012',
      name: 'Alex Rodriguez',
      skill: 'Spanish',
      price: 40,
      rating: 4.6,
      distance: 3.1,
      format: [SessionFormat.IN_PERSON, SessionFormat.ONLINE],
      location: 'University Area',
      experience: '5 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000013',
      name: 'Marie Dubois',
      skill: 'French',
      price: 45,
      rating: 4.7,
      distance: 4.8,
      format: [SessionFormat.IN_PERSON, SessionFormat.ONLINE],
      location: 'Cultural District',
      experience: '8 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000014',
      name: 'Hiroshi Tanaka',
      skill: 'Japanese',
      price: 50,
      rating: 4.8,
      distance: 6.3,
      format: [SessionFormat.ONLINE],
      location: 'International Center',
      experience: '12 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000015',
      name: 'Isabella Romano',
      skill: 'Italian',
      price: 42,
      rating: 4.5,
      distance: 5.7,
      format: [SessionFormat.IN_PERSON, SessionFormat.ONLINE],
      location: 'Little Italy',
      experience: '6 years'
    },
    
    // Fitness & Wellness
    {
      id: '00000000-0000-0000-0000-000000000016',
      name: 'Lisa Wang',
      skill: 'Yoga',
      price: 45,
      rating: 4.8,
      distance: 4.7,
      format: [SessionFormat.IN_PERSON],
      location: 'Park District',
      experience: '10 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000017',
      name: 'Marcus Johnson',
      skill: 'Personal Training',
      price: 65,
      rating: 4.7,
      distance: 3.4,
      format: [SessionFormat.IN_PERSON],
      location: 'Fitness Center',
      experience: '9 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000018',
      name: 'Nina Patel',
      skill: 'Meditation',
      price: 35,
      rating: 4.9,
      distance: 2.1,
      format: [SessionFormat.IN_PERSON, SessionFormat.ONLINE],
      location: 'Wellness Center',
      experience: '7 years'
    },
    
    // Academic & Professional
    {
      id: '00000000-0000-0000-0000-000000000019',
      name: 'Dr. Patricia Lee',
      skill: 'Math',
      price: 60,
      rating: 4.9,
      distance: 4.9,
      format: [SessionFormat.IN_PERSON, SessionFormat.ONLINE],
      location: 'Academic Center',
      experience: '15 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000020',
      name: 'James Wilson',
      skill: 'English',
      price: 50,
      rating: 4.6,
      distance: 3.8,
      format: [SessionFormat.IN_PERSON, SessionFormat.ONLINE],
      location: 'Library District',
      experience: '8 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000021',
      name: 'Dr. Andrew Miller',
      skill: 'Physics',
      price: 70,
      rating: 4.8,
      distance: 7.2,
      format: [SessionFormat.ONLINE],
      location: 'Science Park',
      experience: '12 years'
    },
    
    // Creative & Lifestyle
    {
      id: '00000000-0000-0000-0000-000000000022',
      name: 'Gordon Ramsay Jr.',
      skill: 'Cooking',
      price: 75,
      rating: 4.9,
      distance: 5.5,
      format: [SessionFormat.IN_PERSON],
      location: 'Culinary District',
      experience: '10 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000023',
      name: 'Elena Kowalski',
      skill: 'Baking',
      price: 55,
      rating: 4.7,
      distance: 4.1,
      format: [SessionFormat.IN_PERSON],
      location: 'Bakery Row',
      experience: '8 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000024',
      name: 'Oliver Smith',
      skill: 'Woodworking',
      price: 60,
      rating: 4.6,
      distance: 8.9,
      format: [SessionFormat.IN_PERSON],
      location: 'Craft Workshop',
      experience: '14 years'
    },
    
    // Business & Finance
    {
      id: '00000000-0000-0000-0000-000000000025',
      name: 'Victoria Chang',
      skill: 'Business English',
      price: 80,
      rating: 4.8,
      distance: 6.7,
      format: [SessionFormat.ONLINE],
      location: 'Business District',
      experience: '11 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000026',
      name: 'Michael Brown',
      skill: 'Excel Training',
      price: 65,
      rating: 4.7,
      distance: 5.3,
      format: [SessionFormat.ONLINE],
      location: 'Corporate Center',
      experience: '9 years'
    },
    
    // More affordable options
    {
      id: '00000000-0000-0000-0000-000000000027',
      name: 'Sophie Turner',
      skill: 'Guitar',
      price: 30,
      rating: 4.4,
      distance: 1.2,
      format: [SessionFormat.IN_PERSON],
      location: 'Community Center',
      experience: '3 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000028',
      name: 'Jake Williams',
      skill: 'Python Programming',
      price: 35,
      rating: 4.3,
      distance: 2.7,
      format: [SessionFormat.ONLINE],
      location: 'Coding Bootcamp',
      experience: '2 years'
    },
    
    // Premium options
    {
      id: '00000000-0000-0000-0000-000000000029',
      name: 'Master Chen Wei',
      skill: 'Tai Chi',
      price: 100,
      rating: 5.0,
      distance: 12.5,
      format: [SessionFormat.IN_PERSON],
      location: 'Martial Arts Academy',
      experience: '25 years'
    },
    {
      id: '00000000-0000-0000-0000-000000000030',
      name: 'Dr. Sarah Goldman',
      skill: 'Advanced Mathematics',
      price: 120,
      rating: 4.9,
      distance: 15.8,
      format: [SessionFormat.ONLINE],
      location: 'University',
      experience: '20 years'
    }
  ];

  const skillSuggestions = AVAILABLE_SKILLS.map(skill => skill.name);

  const handleSearch = async () => {
    setLoading(true);
    setCurrentPage(1);
    
    try {
      const searchFilters = {
        skill: selectedSkill,
        location: filters.location,
        maxDistance: filters.maxDistance,
        priceRange: filters.priceRange,
        format: filters.format
      };
      
      const searchResponse = await coursesAPI.searchTeachers(searchFilters);
      
      // Extract results from the response object
      if (searchResponse && Array.isArray(searchResponse.results)) {
        setResults(searchResponse.results);
      } else if (Array.isArray(searchResponse)) {
        // Fallback in case API returns array directly
        setResults(searchResponse);
      } else {
        console.warn('API returned unexpected response format:', searchResponse);
        setResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when initial parameters are provided
  useEffect(() => {
    if (initialSkill) {
      handleSearch();
    }
  }, [initialSkill, initialLocation]);

  // Ensure results is always an array before using array methods
  const safeResults = Array.isArray(results) ? results : [];
  const totalPages = Math.ceil(safeResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = safeResults.slice(startIndex, startIndex + resultsPerPage);

  const handleBookNow = (teacherId: string) => {
    const teacherData = safeResults.find(t => t.id === teacherId);
    if (teacherData) {
      onTeacherSelect(teacherId, teacherData);
    }
  };

  return (
    <Container>
      <Title>
        {initialSkill ? `${initialSkill} Teachers` : 'Find Your Perfect Teacher'}
      </Title>
      
      {initialSkill && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '1rem', 
          padding: '0.75rem', 
          background: '#e8f5e8', 
          borderRadius: '6px',
          color: '#2d5a2d',
          fontSize: '0.9rem'
        }}>
          Showing results for "{initialSkill}"{initialLocation && ` in ${initialLocation}`}
        </div>
      )}
      
      <SearchSection>
        <SearchInputContainer>
          <Select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">Select a skill to learn...</option>
            {skillSuggestions.map((skill, index) => (
              <option key={index} value={skill}>
                {skill}
              </option>
            ))}
          </Select>
        </SearchInputContainer>

        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Distance</FilterLabel>
            <RangeSlider
              type="range"
              min="5"
              max="50"
              value={filters.maxDistance}
              onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
            />
            <RangeDisplay>Within {filters.maxDistance} miles</RangeDisplay>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Price Range</FilterLabel>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  priceRange: [Number(e.target.value), prev.priceRange[1]] 
                }))}
                style={{ width: '80px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <span>-</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  priceRange: [prev.priceRange[0], Number(e.target.value)] 
                }))}
                style={{ width: '80px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <RangeDisplay>${filters.priceRange[0]} - ${filters.priceRange[1]}</RangeDisplay>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Session Format</FilterLabel>
            <Select
              value={filters.format}
              onChange={(e) => setFilters(prev => ({ ...prev, format: e.target.value as SessionFormat | 'ALL' }))}
            >
              <option value="ALL">All Formats</option>
              <option value={SessionFormat.ONLINE}>Online Only</option>
              <option value={SessionFormat.IN_PERSON}>In-Person Only</option>
            </Select>
          </FilterGroup>
        </FiltersContainer>

        <div style={{ textAlign: 'center' }}>
          <SearchButton onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Find Teachers'}
          </SearchButton>
        </div>
      </SearchSection>

      <ResultsContainer>
        {loading ? (
          <LoadingState>
            <div>🔍 Searching for teachers...</div>
          </LoadingState>
        ) : results.length === 0 ? (
          <EmptyState>
            <div>No teachers found matching your criteria.</div>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
              Try adjusting your filters or search terms.
            </div>
          </EmptyState>
        ) : (
          <>
            <ResultsHeader>
              <h2>Available Teachers</h2>
              <ResultsCount>
                {results.length} teacher{results.length !== 1 ? 's' : ''} found
              </ResultsCount>
            </ResultsHeader>

            <ResultsGrid>
              {paginatedResults.map(teacher => (
                <TeacherCard key={teacher.id}>
                  <TeacherName>{teacher.name}</TeacherName>
                  <SkillName>{teacher.skill}</SkillName>
                  <TeacherDetails>
                    <div>⭐ {teacher.rating}/5</div>
                    <div>📍 {teacher.distance} miles</div>
                    <div>📍 {teacher.location}</div>
                    <div>🎓 {teacher.experience}</div>
                  </TeacherDetails>
                  <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
                    Formats: {teacher.format.join(', ')}
                  </div>
                  <Price>${teacher.price}/hour</Price>
                  <BookButton onClick={() => handleBookNow(teacher.id)}>
                    {isAuthenticated ? 'Book Now' : 'Login to Book'}
                  </BookButton>
                </TeacherCard>
              ))}
            </ResultsGrid>

            {totalPages > 1 && (
              <Pagination>
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </PageButton>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PageButton
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PageButton>
                ))}
                
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PageButton>
              </Pagination>
            )}
          </>
        )}
      </ResultsContainer>
    </Container>
  );
};

export default SkillSearch;