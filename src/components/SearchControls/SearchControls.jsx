import React, { useState } from 'react';
import AmenitySelect from './AmenitySelect';

const SearchControls = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('playground'); // 'playground' or 'dogpark' or 'both'
  const [searchMethod, setSearchMethod] = useState('current');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(5);
  const [selectedAmenities, setSelectedAmenities] = useState(['playground']);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city') {
      setCity(value);
    } else if (name === 'state') {
      setState(value);
    } else if (name === 'zipCode') {
      setZipCode(value);
    } else if (name === 'radius') {
      setRadius(Number(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let searchData = {
      type: searchType,
      method: searchMethod,
      data: {
        radius: radius,
        amenities: selectedAmenities
      }
    };

    if (searchMethod === 'current') {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        searchData.data = {
          ...searchData.data,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      } catch (err) {
        console.error('Error getting location:', err);
        alert('Could not get your location. Please try a different search method.');
        return;
      }
    } else if (searchMethod === 'cityState') {
      if (!city || !state) {
        alert('Please enter both city and state');
        return;
      }
      searchData.data = {
        ...searchData.data,
        city,
        state
      };
    } else if (searchMethod === 'zip') {
      if (!zipCode) {
        alert('Please enter a zip code');
        return;
      }
      searchData.data = {
        ...searchData.data,
        zipCode
      };
    }

    onSearch(searchData);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSearch({
            type: searchType,
            method: 'current',
            data: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              radius: parseInt(radius) * 1609.34 // Convert miles to meters
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please try another search method.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const radiusOptions = [1, 2, 5, 10, 15, 20, 25, 50];

  return (
    <div className="search-controls" style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Search for:</span>
          <select 
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px' }}
          >
            <option value="playground">Playgrounds</option>
            <option value="dogpark">Dog Parks</option>
            <option value="both">Both</option>
          </select>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Search by:</span>
          <select 
            value={searchMethod}
            onChange={(e) => setSearchMethod(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px' }}
          >
            <option value="current">Use my current location</option>
            <option value="cityState">Search by city/state</option>
            <option value="zip">Search by ZIP code</option>
          </select>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Radius:</span>
          <select
            name="radius"
            value={radius}
            onChange={handleInputChange}
            style={{ padding: '8px', borderRadius: '4px' }}
          >
            {radiusOptions.map(miles => (
              <option key={miles} value={miles}>
                {miles} {miles === 1 ? 'mile' : 'miles'}
              </option>
            ))}
          </select>
        </label>

        <button 
          onClick={handleCurrentLocation}
          style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
        >
          Use Current Location
        </button>
      </div>

      {searchMethod === 'cityState' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            name="city"
            value={city}
            onChange={handleInputChange}
            placeholder="Enter city"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            name="state"
            value={state}
            onChange={handleInputChange}
            placeholder="Enter state"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button 
            type="submit"
            style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#2196F3', color: 'white', border: 'none' }}
          >
            Search
          </button>
        </form>
      )}

      {searchMethod === 'zip' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            name="zipCode"
            value={zipCode}
            onChange={handleInputChange}
            placeholder="Enter zip code"
            pattern="[0-9]{5}"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button 
            type="submit"
            style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#2196F3', color: 'white', border: 'none' }}
          >
            Search
          </button>
        </form>
      )}

      <AmenitySelect
        selectedAmenities={selectedAmenities}
        onChange={setSelectedAmenities}
      />
    </div>
  );
};

export default SearchControls; 