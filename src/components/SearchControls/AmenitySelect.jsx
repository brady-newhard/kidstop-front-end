import React from 'react';
import './AmenitySelect.css';

const amenityOptions = [
  { value: 'playground', label: '🎪 Playground Equipment', searchTerms: ['playground', 'play area', 'jungle gym', 'swing', 'slide'] },
  { value: 'swimming', label: '🏊‍♂️ Swimming Pool', searchTerms: ['swimming pool', 'pool', 'swim'] },
  { value: 'splash_pad', label: '💦 Splash Pad', searchTerms: ['splash pad', 'spray park', 'water play'] },
  { value: 'water_fountain', label: '💧 Water Fountain', searchTerms: ['water fountain', 'drinking fountain'] },
  { value: 'walking_trails', label: '🚶 Walking Trails', searchTerms: ['trail', 'path', 'walking', 'hiking'] },
  { value: 'basketball', label: '🏀 Basketball Court', searchTerms: ['basketball', 'court', 'hoop'] },
  { value: 'tennis', label: '🎾 Tennis Court', searchTerms: ['tennis'] },
  { value: 'baseball', label: '⚾ Baseball Field', searchTerms: ['baseball', 'softball', 'diamond'] },
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
  // Function to extract emoji from label
  const extractEmojiAndText = (label) => {
    const emojiMatch = label.match(/^(\p{Emoji}|[\u{1F000}-\u{1FFFF}])/u);
    if (emojiMatch) {
      const emoji = emojiMatch[0];
      const text = label.replace(emoji, '').trim();
      return { emoji, text };
    }
    return { emoji: '', text: label };
  };

  return (
    <div className="amenity-select-container">
      <h4 className="amenity-select-title">
        Desired Amenities
      </h4>
      <div className="amenity-grid">
        {amenityOptions.map((amenity) => {
          const { emoji, text } = extractEmojiAndText(amenity.label);
          return (
            <label
              key={amenity.value}
              className={`amenity-option ${selectedAmenities.includes(amenity.value) ? 'selected' : ''}`}
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
              />
              <span data-emoji={emoji}>{text}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export { amenityOptions };
export default AmenitySelect; 