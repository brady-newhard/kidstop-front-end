const performSearch = async () => {
  if (!map || !searchLocation || !radius) return;

  setIsLoading(true);
  setError(null);

  try {
    // Create the Places service
    const service = new window.google.maps.places.PlacesService(map);

    // Single search for all parks
    const request = {
      location: searchLocation,
      radius: radius * 1609.34, // Convert miles to meters
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
        new Promise((resolve) => {
          service.getDetails(
            { placeId: place.place_id, fields: detailFields },
            (details, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // Add amenities to the place details
                const amenities = extractAmenities(details);
                resolve({ ...place, details: { ...details, amenities } });
              } else {
                // If we can't get details, just return the basic place
                resolve(place);
              }
            }
          );
        })
      )
    );

    // Log details for debugging
    detailedResults.forEach(place => {
      console.log('Place details with amenities:', place.details);
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