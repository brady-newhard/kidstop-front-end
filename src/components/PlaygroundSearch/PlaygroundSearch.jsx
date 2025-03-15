import React, { useState, useEffect, useRef } from "react";
import GoogleMapComponent from "../GoogleMapsAPI/GoogleMapsAPI";
import GooglePlacesSearch from "../GooglePlacesAPI/GooglePlacesAPI";
import SearchControls from "../SearchControls/SearchControls";
import { amenityOptions } from "../SearchControls/AmenitySelect";
import "./PlaygroundSearch.css";

const PlaygroundsPage = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [error, setError] = useState(null);
  const [searchRadius, setSearchRadius] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState(['playground']);
  const [searchType, setSearchType] = useState('playground');
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Create a map instance for the Places service
    const mapDiv = document.createElement('div');
    mapRef.current = new window.google.maps.Map(mapDiv);
  }, []);

  // Add new useEffect for searching
  useEffect(() => {
    if (selectedPlace && searchRadius) {
      performSearch();
    }
  }, [selectedPlace, searchRadius]);

  const getPlaceDetails = async (placeId) => {
    if (!mapRef.current) {
      console.error('Map not initialized');
      return null;
    }

    try {
      const service = new window.google.maps.places.PlacesService(mapRef.current);
      
      return new Promise((resolve, reject) => {
        service.getDetails(
          {
            placeId: placeId,
            fields: [
              'name', 
              'formatted_address', 
              'geometry', 
              'rating',
              'opening_hours', 
              'formatted_phone_number', 
              'website', 
              'url', 
              'photos', 
              'reviews',
              'user_ratings_total',
              'vicinity',
              'types',
              'business_status',
              'editorial_summary',
              'price_level',
              'international_phone_number',
              'address_components'
            ]
          },
          (result, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              // Process amenities from types and other fields
              const amenities = new Set();
              
              // Check types for common amenities
              (result.types || []).forEach(type => {
                switch(type) {
                  case 'parking':
                    amenities.add('Parking Available');
                    break;
                  case 'park':
                    amenities.add('Public Park');
                    break;
                  case 'playground':
                    amenities.add('Playground Equipment');
                    break;
                  case 'dog_park':
                    amenities.add('Dog Park Area');
                    break;
                }
              });

              // Check name, description, and vicinity for common features
              const searchText = [
                result.name,
                result.vicinity,
                result.editorial_summary?.overview,
                (result.reviews || []).map(r => r.text).join(' ')
              ].join(' ').toLowerCase();

              // Check for each amenity
              amenityOptions.forEach(({ value, searchTerms }) => {
                if (searchTerms.some(term => searchText.includes(term))) {
                  amenities.add(value);
                }
              });

              // Add amenities to the result
              result.amenities = Array.from(amenities).sort();
              
              console.log('Place details with amenities:', result);
              resolve(result);
            } else {
              console.error('Failed to get place details:', status);
              reject(new Error(`Failed to get place details: ${status}`));
            }
          }
        );
      });
    } catch (err) {
      console.error('Error getting place details:', err);
      return null;
    }
  };

  const performSearch = async () => {
    if (!mapRef.current || !selectedPlace || !searchRadius) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create the Places service
      const service = new window.google.maps.places.PlacesService(mapRef.current);

      // Single search for all parks
      const request = {
        location: new window.google.maps.LatLng(
          selectedPlace.location.lat,
          selectedPlace.location.lng
        ),
        radius: searchRadius * 1609.34, // Convert miles to meters
        type: 'park',
        keyword: 'park playground dog park',
      };

      // Perform the search
      const results = await new Promise((resolve, reject) => {
        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        });
      });

      console.log('Raw search results:', results);

      // Get details for each place
      const detailedResults = await Promise.all(
        results.map(place => 
          getPlaceDetails(place.place_id)
            .then(details => ({ ...place, details }))
            .catch(() => place) // If details fail, just return the basic place
        )
      );

      // Log details for debugging
      detailedResults.forEach(place => {
        console.log('Place details:', place.details);
      });

      // Remove duplicates based on place_id
      const uniqueResults = detailedResults.filter((place, index, self) =>
        index === self.findIndex((p) => p.place_id === place.place_id)
      );

      setSearchResults(uniqueResults);
      setIsLoading(false);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = (place) => {
    console.log('Place selected:', place);
    if (place && place.location) {
      setSelectedPlace(place);
      setError(null);
      setPlaceDetails(null);
    } else {
      setError('Unable to get location details for this place');
    }
  };

  const handleMarkerClick = async (place) => {
    try {
      setPlaceDetails(null);
      const details = await getPlaceDetails(place.place_id);
      setPlaceDetails(details);
      setError(null);
    } catch (err) {
      console.error('Error getting place details:', err);
      setError('Could not fetch place details');
      setPlaceDetails(null);
    }
  };

  const handleSearch = async (searchParams) => {
    setSearchRadius(searchParams.data.radius);
    setSelectedAmenities(searchParams.data.amenities);
    setSearchType(searchParams.type);
    setPlaceDetails(null);
    setError(null);
    
    if (searchParams.method === 'current') {
      const location = {
        lat: searchParams.data.lat,
        lng: searchParams.data.lng
      };
      setSelectedPlace({
        name: 'Current Location',
        location: location,
        address: 'Your location'
      });
    } else if (searchParams.method === 'cityState' || searchParams.method === 'zip') {
      try {
        const address = searchParams.method === 'cityState' 
          ? `${searchParams.data.city}, ${searchParams.data.state}`
          : searchParams.data.zipCode;
          
        const geocoder = new window.google.maps.Geocoder();
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error('Location not found'));
            }
          });
        });

        const location = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng()
        };

        setSelectedPlace({
          name: result.formatted_address,
          location: location,
          address: result.formatted_address
        });
      } catch (err) {
        setError(`Error finding location: ${err.message}`);
        console.error(err);
      }
    }
  };

  return (
    <div className="playground-search-container">
      <h1 className="playground-search-title">Find Your KidStop</h1>
      
      <SearchControls onSearch={handleSearch} />
      
      {error && (
        <p className="playground-error">{error}</p>
      )}
      
      <div className="playground-map-container">
        {selectedPlace ? (
          <div>
            <h3>{selectedPlace.name}</h3>
            <div style={{ height: "400px", width: "100%" }}>
              <GoogleMapComponent 
                lat={selectedPlace.location.lat} 
                lng={selectedPlace.location.lng}
                radius={searchRadius}
                onMarkerClick={handleMarkerClick}
                selectedPlaceDetails={placeDetails}
                searchResults={searchResults}
                searchType={searchType === 'dogpark' ? 'dog_park' : searchType}
                selectedAmenities={selectedAmenities}
              />
            </div>
          </div>
        ) : (
          <div style={{ height: "400px", width: "100%" }}>
            <GoogleMapComponent 
              lat={40.7829}
              lng={-73.9654}
              searchResults={searchResults}
              selectedAmenities={selectedAmenities}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaygroundsPage;
