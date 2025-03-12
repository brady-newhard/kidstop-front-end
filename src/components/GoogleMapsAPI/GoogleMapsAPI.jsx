import React, { useCallback, useState, useEffect } from "react";
import { GoogleMap, Marker, Circle, InfoWindow } from "@react-google-maps/api";

const getAmenityIcon = (amenity) => {
  switch (amenity.toLowerCase()) {
    case 'parking available': return '🅿️';
    case 'public park': return '🌳';
    case 'playground equipment': return '🎪';
    case 'dog park area': return '🐕';
    case 'basketball court': return '🏀';
    case 'tennis court': return '🎾';
    case 'baseball/softball field': return '⚾';
    case 'soccer field': return '⚽';
    case 'picnic area': return '🧺';
    case 'restrooms': return '🚻';
    case 'water fountain': return '💧';
    case 'benches': return '🪑';
    case 'lighting': return '💡';
    case 'fenced area': return '🔒';
    case 'wheelchair accessible': return '♿';
    case 'walking trails': return '🚶';
    case 'shaded areas': return '☂️';
    default: return '✨';
  }
};

const containerStyle = {
  width: '100%',
  height: '600px',
  margin: '0 auto',
  display: 'block',
  position: 'relative',
  aspectRatio: '1/1'
};

const circleOptions = {
  strokeColor: '#666666',
  strokeOpacity: 0.3,
  strokeWeight: 1,
  fillColor: '#666666',
  fillOpacity: 0.1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true
};

const getMapStyle = (searchType) => [
  {
    featureType: "all",
    elementType: "all",
    stylers: [{ saturation: -20 }]
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [
      { visibility: "on" },
      { saturation: -20 }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "all",
    stylers: [
      { visibility: "on" },
      { saturation: 20 },
      { lightness: 10 }
    ]
  },
  {
    featureType: "poi.attraction",
    elementType: "all",
    stylers: [
      { visibility: "on" },
      { saturation: 20 }
    ]
  }
];

const GoogleMapComponent = ({ 
  lat = 40.7829, 
  lng = -73.9654, 
  radius,
  onMarkerClick,
  selectedPlaceDetails,
  searchType = 'playground',
  searchResults = []
}) => {
  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentCircle, setCurrentCircle] = useState(null);
  
  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };

  // Handle radius changes
  useEffect(() => {
    if (!map || !center || !radius) return;

    // Clear previous circle if it exists
    if (currentCircle) {
      currentCircle.setMap(null);
    }

    // Create new circle
    const newCircle = new window.google.maps.Circle({
      center: {
        lat: parseFloat(center.lat),
        lng: parseFloat(center.lng)
      },
      radius: radius * 1609.34, // Convert miles to meters
      ...circleOptions,
      map: map
    });
    
    setCurrentCircle(newCircle);

    // Cleanup function
    return () => {
      if (newCircle) {
        newCircle.setMap(null);
      }
    };
  }, [map, radius]); // Remove center from dependencies since we handle it separately

  const mapOptions = {
    disableDefaultUI: false,
    clickableIcons: true,
    mapTypeControl: true,
    streetViewControl: true,
    mapTypeControlOptions: {
      style: 2,
      position: 3
    },
    styles: getMapStyle(searchType)
  };

  const onLoad = useCallback((map) => {
    console.log('Map loaded:', map);
    setMap(map);
    
    if (radius) {
      // Set zoom based on radius
      const radiusInMiles = radius;
      let zoom = 12; // Default zoom level
      
      if (radiusInMiles <= 1) zoom = 14;
      else if (radiusInMiles <= 2) zoom = 13;
      else if (radiusInMiles <= 5) zoom = 12;
      else if (radiusInMiles <= 10) zoom = 11;
      else if (radiusInMiles <= 20) zoom = 10;
      else zoom = 9;
      
      map.setZoom(zoom);
      map.setCenter(center);
    }
  }, [radius, center]);

  const onUnmount = useCallback((map) => {
    console.log('Map unmounted:', map);
    setSelectedPlace(null);
    if (map) {
      window.google.maps.event.clearInstanceListeners(map);
    }
  }, []);

  const getPosition = (place) => {
    if (!place.geometry?.location) {
      console.error('Invalid place geometry:', place);
      return null;
    }

    try {
      // Handle both function and object formats of location
      let lat, lng;

      if (typeof place.geometry.location.lat === 'function') {
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
      } else if (place.geometry.location.lat != null) {
        lat = place.geometry.location.lat;
        lng = place.geometry.location.lng;
      } else {
        console.error('Invalid location format:', place.geometry.location);
        return null;
      }

      console.log('Extracted position:', { lat, lng });
      return { lat, lng };
    } catch (error) {
      console.error('Error getting position:', error);
      return null;
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '600px',
      aspectRatio: '1/1'
    }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Center marker */}
        <Marker 
          position={center}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(30, 30)
          }}
        />

        {/* Search result markers */}
        {Array.isArray(searchResults) && searchResults.map((place, index) => {
          // Skip if place is invalid
          if (!place || !place.geometry || !place.geometry.location) {
            console.error('Invalid place object at index:', index);
            return null;
          }

          // Get position from place geometry
          const lat = typeof place.geometry.location.lat === 'function' ? 
            place.geometry.location.lat() : place.geometry.location.lat;
          const lng = typeof place.geometry.location.lng === 'function' ? 
            place.geometry.location.lng() : place.geometry.location.lng;

          if (!lat || !lng) {
            console.error('Invalid coordinates for place:', place.name);
            return null;
          }

          const position = { lat, lng };
          
          // Enhanced type checking for places
          const types = place.types || [];
          const name = (place.name || '').toLowerCase();
          const vicinity = (place.vicinity || '').toLowerCase();
          const details = place.details || {};
          const amenities = (details.amenities || []).map(a => a.toLowerCase());

          // Log raw place data for debugging
          console.log('Raw place data:', {
            name,
            types,
            amenities,
            vicinity
          });
          
          // Check if it's a dog park
          const isDogPark = types.includes('dog_park') || 
                           name.includes('dog park') ||
                           name.includes('dog run') ||
                           name.includes('off-leash') ||
                           vicinity.includes('dog park') ||
                           name.includes('dog') ||
                           amenities.some(a => 
                             a.includes('dog park') || 
                             a.includes('dog area') ||
                             a.includes('off-leash') ||
                             a === 'dog park area'
                           );
          
          // Check if it's a playground (if not already identified as a dog park)
          const isPlayground = !isDogPark && (
            types.includes('playground') || 
            name.includes('playground') ||
            name.includes('play ground') ||
            (name.includes('children') && name.includes('play')) ||
            types.includes('amusement_park') ||
            amenities.includes('playground equipment') ||
            amenities.some(a => 
              a.includes('playground') || 
              (a.includes('play') && a.includes('area'))
            )
          );

          // Log classification results
          console.log('Place classification:', {
            name: place.name,
            isDogPark,
            isPlayground,
            matchedTypes: types.filter(t => t.includes('park') || t.includes('playground') || t.includes('dog')),
            matchedAmenities: amenities.filter(a => a.includes('dog') || a.includes('play') || a.includes('park'))
          });

          // Set marker color based on type
          let markerUrl = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
          if (isDogPark) {
            markerUrl = 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
          } else if (isPlayground) {
            markerUrl = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
          }

          // Filter based on search type
          if (searchType === 'playground' && !isPlayground) {
            return null;
          }
          if (searchType === 'dog_park' && !isDogPark) {
            return null;
          }
          if (searchType === 'both' && !isPlayground && !isDogPark) {
            return null;
          }
          
          console.log('Rendering marker for place:', {
            name: place.name,
            position,
            types: types,
            amenities: amenities,
            isPlayground,
            isDogPark,
            searchType
          });

          return (
            <Marker
              key={place.place_id || `place-${index}`}
              position={position}
              onClick={() => {
                console.log('Marker clicked:', place);
                setSelectedPlace(place);
                if (onMarkerClick) {
                  onMarkerClick({ place_id: place.place_id });
                }
              }}
              icon={{
                url: markerUrl,
                scaledSize: new window.google.maps.Size(40, 40)
              }}
              title={place.name}
            />
          );
        })}

        {/* Info window for selected place */}
        {selectedPlace && selectedPlaceDetails && (
          <InfoWindow
            position={selectedPlace.geometry?.location || getPosition(selectedPlace)}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div style={{ padding: '10px', maxWidth: '300px' }}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                {selectedPlaceDetails.name}
              </h3>
              
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                📍 {selectedPlaceDetails.formatted_address || selectedPlaceDetails.vicinity}
              </p>
              
              {selectedPlaceDetails.rating && (
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                  ⭐ {selectedPlaceDetails.rating.toFixed(1)} 
                  {selectedPlaceDetails.user_ratings_total && 
                    ` (${selectedPlaceDetails.user_ratings_total} reviews)`}
                </p>
              )}

              {selectedPlaceDetails.opening_hours && (
                <p style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '14px',
                  color: selectedPlaceDetails.opening_hours.isOpen() ? '#4CAF50' : '#F44336',
                  fontWeight: 'bold'
                }}>
                  {selectedPlaceDetails.opening_hours.isOpen() ? 
                    '🟢 Open now' : '🔴 Closed'}
                </p>
              )}

              {selectedPlaceDetails.amenities && selectedPlaceDetails.amenities.length > 0 && (
                <div style={{ 
                  margin: '12px 0', 
                  padding: '8px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '4px' 
                }}>
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '14px', 
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    🎯 Amenities:
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px' 
                  }}>
                    {selectedPlaceDetails.amenities.map((amenity, index) => (
                      <span key={index} style={{ 
                        fontSize: '12px',
                        padding: '4px 8px',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {getAmenityIcon(amenity)} {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPlaceDetails.formatted_phone_number && (
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                  📞 {selectedPlaceDetails.formatted_phone_number}
                </p>
              )}

              {selectedPlaceDetails.website && (
                <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                  <a 
                    href={selectedPlaceDetails.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#1976D2', 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    🌐 Visit Website
                  </a>
                </p>
              )}

              {selectedPlaceDetails.url && (
                <p style={{ margin: '0', fontSize: '14px' }}>
                  <a 
                    href={selectedPlaceDetails.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#1976D2', 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    📍 View on Google Maps
                  </a>
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
