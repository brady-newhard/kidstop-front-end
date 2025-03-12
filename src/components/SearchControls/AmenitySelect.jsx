import React from 'react';

const amenityOptions = [
  { value: 'playground', label: '🎪 Playground Equipment', searchTerms: ['playground', 'play area', 'jungle gym', 'swing', 'slide'] },
  { value: 'swimming', label: '🏊‍♂️ Swimming Pool', searchTerms: ['swimming pool', 'pool', 'swim'] },
  { value: 'splash_pad', label: '💦 Splash Pad', searchTerms: ['splash pad', 'spray park', 'water play'] },
  { value: 'water_fountain', label: '💧 Water Fountain', searchTerms: ['water fountain', 'drinking fountain'] },
  { value: 'walking_trails', label: '🚶 Walking Trails', searchTerms: ['trail', 'path', 'walking', 'hiking'] },
  { value: 'basketball', label: '🏀 Basketball Court', searchTerms: ['basketball', 'court', 'hoop'] },
  { value: 'tennis', label: '🎾 Tennis Court', searchTerms: ['tennis'] },
  { value: 'baseball', label: '⚾ Baseball/Softball Field', searchTerms: ['baseball', 'softball', 'diamond'] },
  { value: 'soccer', label: '⚽ Soccer Field', searchTerms: ['soccer', 'football field'] },
  { value: 'picnic', label: '🧺 Picnic Area', searchTerms: ['picnic', 'tables', 'pavilion'] },
  { value: 'restroom', label: '🚻 Restrooms', searchTerms: ['restroom', 'bathroom', 'facilities'] },
  { value: 'benches', label: '🪑 Benches', searchTerms: ['bench', 'seating'] },
  { value: 'lighting', label: '💡 Lighting', searchTerms: ['light', 'illuminated', 'lit'] },
  { value: 'fenced', label: '🔒 Fenced Area', searchTerms: ['fenced', 'enclosed'] },
  { value: 'accessible', label: '♿ Wheelchair Accessible', searchTerms: ['accessible', 'wheelchair', 'ada'] },
  { value: 'shade', label: '☂️ Shaded Areas', searchTerms: ['shade', 'covered', 'trees'] },
  { value: 'parking', label: '🅿️ Parking', searchTerms: ['parking', 'lot', 'spaces'] }
];

const AmenitySelect = ({ selectedAmenities, onChange }) => {
  return (
    <div style={{ 
      marginTop: '10px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h4 style={{ 
        margin: '0 0 10px 0',
        fontSize: '16px',
        color: '#000'
      }}>
        Desired Amenities
      </h4>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '8px'
      }}>
        {amenityOptions.map((amenity) => (
          <label
            key={amenity.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: selectedAmenities.includes(amenity.value) ? '#e3f2fd' : 'transparent',
              transition: 'background-color 0.2s',
              color: '#000'
            }}
          >
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity.value)}
              onChange={(e) => {
                const newSelection = e.target.checked
                  ? [...selectedAmenities, amenity.value]
                  : selectedAmenities.filter(a => a !== amenity.value);
                onChange(newSelection);
              }}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontSize: '14px', color: '#000' }}>{amenity.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export { amenityOptions };
export default AmenitySelect; 