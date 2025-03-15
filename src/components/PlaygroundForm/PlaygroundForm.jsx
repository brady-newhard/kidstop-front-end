// src/components/PlaygroundForm/PlaygroundForm.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import * as playgroundService from '../../services/playgroundService';
import './PlaygroundForm.css';
import AmenitySelect, { amenityOptions } from '../SearchControls/AmenitySelect';

// import { amenityOptions } from '../SearchControls/AmenitySelect';

const PlaygroundForm = ({ handleAddPlayground, handleUpdatePlayground }) => {
  const { playgroundId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rating: 'A',
    amenities: []
  });

  useEffect(() => {
    const fetchPlayground = async () => {
      const playgroundData = await playgroundService.show(playgroundId);
      setFormData({
        ...playgroundData,
        amenities: playgroundData.amenities || []
      });
    };
    if (playgroundId) fetchPlayground();

    return () => setFormData({ name: '', description: '', rating: 'A', amenities: [] });
  }, [playgroundId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleAmenitiesChange = (selectedAmenities) => {
    setFormData({ ...formData, amenities: selectedAmenities });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (playgroundId) {
      handleUpdatePlayground(playgroundId, formData);
    } else {
      handleAddPlayground(formData);
    }
  };

  return (
    <div className="playground-form-container">
      <div className="playground-form-header">
        <h1 className="playground-form-title">{playgroundId ? 'Edit Your KidStop' : 'Add a KidStop'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="playground-form">
        <div className="form-group">
          <label htmlFor='name-input'>Name</label>
          <input
            required
            type='text'
            name='name'
            id='name-input'
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter playground name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor='description-input'>Description</label>
          <textarea
            required
            name='description'
            id='description-input'
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the playground"
          />
        </div>

        <div className="form-group">
          <label htmlFor='rating-input'>Rating</label>
          <select
            required
            name='rating'
            id='rating-input'
            value={formData.rating}
            onChange={handleChange}
          >
            <option value='A'>A</option>
            <option value='B'>B</option>
            <option value='C'>C</option>
            <option value='D'>D</option>
            <option value='F'>F</option>
          </select>
        </div>

        {/* <div className="form-group">
          <label>Amenities</label>
          <AmenitySelect 
            selectedAmenities={formData.amenities} 
            onChange={handleAmenitiesChange} 
          />
        </div> */}

        <button type='submit' className="playground-form-button">
          {playgroundId ? 'Update' : 'Add'} KidStop
        </button>
      </form>
    </div>
  );
};

export default PlaygroundForm;
