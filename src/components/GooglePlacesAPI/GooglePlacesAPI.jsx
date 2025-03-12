import React, { useState, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";

const GooglePlacesSearch = ({ onSelect, searchType = 'playground' }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [placeholder, setPlaceholder] = useState('Search for a playground...');

  useEffect(() => {
    setPlaceholder(searchType === 'playground' 
      ? 'Search for a playground...' 
      : 'Search for a dog park...'
    );
  }, [searchType]);

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log('Selected place:', place);
      
      if (place && place.geometry && place.geometry.location) {
        const placeData = {
          name: place.name || '',
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          address: place.formatted_address || '',
          type: searchType
        };
        console.log('Processed place data:', placeData);
        onSelect(placeData);
      } else {
        console.log('No geometry found for this place');
      }
    } else {
      console.log('Autocomplete is not loaded yet');
    }
  };

  const handleLoad = (autoComplete) => {
    console.log('Autocomplete loaded:', autoComplete);
    setAutocomplete(autoComplete);
  };

  return (
    <Autocomplete 
      onLoad={handleLoad} 
      onPlaceChanged={handlePlaceSelect}
      restrictions={{ country: "us" }}
      options={{
        types: ["establishment"],
        keyword: searchType === 'playground' ? 'playground' : 'dog park'
      }}
    >
      <input 
        type="text" 
        placeholder={placeholder}
        style={{ 
          width: "100%", 
          padding: "10px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc"
        }} 
      />
    </Autocomplete>
  );
};

export default GooglePlacesSearch;
