// 1. Get user location using the browser's Geolocation API
async function getUserLocation() {
  try {
    // Request the user's location using the Geolocation API
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    // Extract the latitude and longitude coordinates from the response
    const { latitude, longitude } = position.coords;
    return { latitude, longitude };
  } catch (error) {
    // Handle errors, such as user denying location access
    console.error('Error getting user location:', error);
    throw error;
  }
}

// 2. Use the Google Maps API to find nearby restaurants
async function findNearbyRestaurants(latitude, longitude) {
  try {
    // Create a new Google Maps client
    const client = new google.maps.places.PlacesService(document.createElement('div'));

    // Search for nearby restaurants using the Places API
    const response = await client.nearbySearch({
      location: { lat: latitude, lng: longitude },
      radius: 5000, // Search radius in meters
      type: 'restaurant',
      rankBy: google.maps.places.RankBy.RATING, // Sort by rating
    });

    // Extract the restaurant information from the response
    const restaurants = response.map(place => ({
      name: place.name,
      rating: place.rating,
      address: place.vicinity,
    }));

    return restaurants;
  } catch (error) {
    // Handle errors, such as API quota exceeded
    console.error('Error finding nearby restaurants:', error);
    throw error;
  }
}

// 3. Randomly select and display a restaurant recommendation
function displayRestaurantRecommendation(restaurants) {
  // Randomly select a restaurant from the list
  const randomIndex = Math.floor(Math.random() * restaurants.length);
  const selectedRestaurant = restaurants[randomIndex];

  // Get the recommendation element and update its content
  const recommendationElement = document.getElementById('restaurant-recommendation');
  recommendationElement.textContent = `We recommend: ${selectedRestaurant.name} (Rating: ${selectedRestaurant.rating}, Address: ${selectedRestaurant.address})`;
}

// 4. Implement the one-button functionality
document.getElementById('find-restaurant-button').addEventListener('click', async () => {
  try {
    // Get the user's location
    const { latitude, longitude } = await getUserLocation();

    // Find nearby restaurants
    const restaurants = await findNearbyRestaurants(latitude, longitude);

    // Display a random restaurant recommendation
    displayRestaurantRecommendation(restaurants);
  } catch (error) {
    // Handle errors and display appropriate feedback to the user
    console.error('Error:', error);
    alert('Sorry, we couldn\'t find any nearby restaurant recommendations. Please try again later.');
  }
});
