import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 1rem;
`;

const MapContainer = styled.div`
  height: 300px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  margin-bottom: 1rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuggestionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
`;

const SuggestionItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SelectedLocation = styled.div`
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LocationDetails = styled.div`
  font-size: 0.875rem;
  color: #555;
  margin-top: 0.5rem;
`;

interface Location {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [searchQuery, setSearchQuery] = useState(initialLocation || '');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock location data - in real app would use Google Places API
  const mockLocations: Location[] = [
    { address: '123 Main St, Downtown, City', lat: 40.7128, lng: -74.0060 },
    { address: '456 Oak Ave, Midtown, City', lat: 40.7589, lng: -73.9851 },
    { address: '789 Pine Rd, Uptown, City', lat: 40.7831, lng: -73.9712 },
    { address: '321 Elm St, Westside, City', lat: 40.7282, lng: -74.0776 },
    { address: '654 Maple Dr, Eastside, City', lat: 40.7505, lng: -73.9934 },
    { address: 'Central Library, Main Branch', lat: 40.7531, lng: -73.9822 },
    { address: 'Community Center, North District', lat: 40.7614, lng: -73.9776 },
    { address: 'Coffee Shop on 5th Avenue', lat: 40.7499, lng: -73.9857 }
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = mockLocations.filter(loc =>
        loc.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSearchQuery(location.address);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            address: `Current Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          handleLocationSelect(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter an address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Container>
      <div style={{ position: 'relative' }}>
        <SearchInput
          type="text"
          placeholder="Search for an address or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
        />
        
        {showSuggestions && (
          <SuggestionsList>
            {suggestions.map((location, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleLocationSelect(location)}
              >
                {location.address}
              </SuggestionItem>
            ))}
          </SuggestionsList>
        )}
      </div>

      <button
        type="button"
        onClick={getCurrentLocation}
        style={{
          background: '#28a745',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '1rem'
        }}
      >
        📍 Use Current Location
      </button>

      {selectedLocation && (
        <SelectedLocation>
          <strong>Selected Location:</strong>
          <div>{selectedLocation.address}</div>
          <LocationDetails>
            Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </LocationDetails>
        </SelectedLocation>
      )}

      <MapContainer>
        {selectedLocation ? (
          <div style={{ textAlign: 'center' }}>
            <div>📍 Map Preview</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {selectedLocation.address}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
              In a real application, this would show an interactive map
            </div>
          </div>
        ) : (
          <div>
            <div>🗺️ Map will appear here</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Select a location to see it on the map
            </div>
          </div>
        )}
      </MapContainer>
    </Container>
  );
};

export default LocationPicker;