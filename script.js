const searchButton = document.getElementById('search-button');
const locationInput = document.getElementById('location-input');
const resultsDiv = document.getElementById('results');

searchButton.addEventListener('click', () => {
  const location = locationInput.value;

  // Check if the input is a Singapore postal code
  if (/^\d{6}$/.test(location)) {
    // Use geocoding API to convert postal code to lat/lng
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyA3pTkee0v777-QpuN1Qs_RiX2wezm9HTk`;

    fetch(geocodingUrl)
      .then(response => response.json())
      .then(data => {
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;

        // Use Places API to fetch restaurants
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyA3pTkee0v777-QpuN1Qs_RiX2wezm9HTk&location=${lat},${lng}&radius=5000&type=restaurant`;

        fetch(placesUrl)
          .then(response => response.json())
          .then(data => {
            resultsDiv.innerHTML = ''; // Clear previous results

            data.results.forEach(result => {
              const restaurant = document.createElement('div');
              restaurant.classList.add('result');
              restaurant.innerHTML = `
                <h2>${result.name}</h2>
                <p>${result.vicinity}</p>
                <p>Rating: ${result.rating}</p>
              `;
              resultsDiv.appendChild(restaurant);
            });
          })
          .catch(error => {
            console.error('Error fetching restaurants:', error);
            resultsDiv.innerHTML = '<p>Error fetching restaurants. Please try again later.</p>';
          });
      })
      .catch(error => {
        console.error('Error fetching geocoding data:', error);
        resultsDiv.innerHTML = '<p>Error fetching location. Please try again later.</p>';
      });
  } else {
    // Handle regular location input (e.g., city name)
    // ... (existing code for fetching restaurants by location name)
  }
});