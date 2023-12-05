function initializeApp() {
  // Extract the access token from the URL
  getAccessTokenFromUrl();

  // Add event listeners or other initialization logic here
  const moodForm = document.getElementById('moodForm');
  moodForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const selectedMood = document.getElementById('moodDropdown').value;
    generatePlaylistForMood(selectedMood);
  });
}


// Initialize the application when the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const moodForm = document.getElementById('moodForm');
  
  // Call the function from spot.js to ensure the access token is retrieved from the URL
  if (typeof getAccessTokenFromUrl === "function") { 
    getAccessTokenFromUrl();
  }

  moodForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const selectedMood = document.getElementById('moodDropdown').value;
    generatePlaylistForMood(selectedMood);
  });
});

function fetchSpotifyUserID() {
  // The access token is used here to fetch the Spotify user ID
  return fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${window.access_token}`
    }
  })
  .then(response => response.json())
  .then(data => data.id);
}

function mapMoodToAttributes(mood) {
  // Maps the selected mood to track attributes used in the Spotify API
  return {
    valence: mood === 'happy' ? 0.8 : mood === 'sad' ? 0.2 : 0.5,
    energy: mood === 'energetic' ? 0.8 : 0.4,
    // ...other mood mappings...
  };
}

function fetchTracksWithAttributes(attributes) {
  // Fetch tracks from Spotify based on the attributes associated with the selected mood
  return fetch(`https://api.spotify.com/v1/recommendations?seed_genres=pop&target_valence=${attributes.valence}&target_energy=${attributes.energy}`, {
    headers: {
      'Authorization': `Bearer ${window.access_token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    return data.tracks; // Return the full track objects
  });
}

function generatePlaylistForMood(mood) {
  fetchSpotifyUserID().then(userId => {
    const attributes = mapMoodToAttributes(mood);
    fetchTracksWithAttributes(attributes).then(tracks => {
      if (tracks.length > 0) {
        displayTracksAsText(tracks);
        // Optionally create a Spotify playlist with these tracks
        // createOrUpdatePlaylist(userId, tracks.map(track => track.uri));
      } else {
        alert('No tracks found for this mood. Please try a different mood.');
      }
    }).catch(error => {
      console.error('Error fetching tracks:', error);
      alert('An error occurred while generating the playlist.');
    });
  }).catch(error => {
    console.error('Error fetching user ID:', error);
  });
}

function displayTracksAsText(tracks) {
  const trackListContainer = document.getElementById('trackListContainer'); // Make sure this exists in your HTML
  trackListContainer.innerHTML = ''; // Clear existing track list

  tracks.forEach(track => {
    const trackElement = document.createElement('p');
    trackElement.textContent = `Track: ${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
    trackListContainer.appendChild(trackElement);
  });
}


function createOrUpdatePlaylist(userId, trackUris) {
  // Create a new playlist and add the tracks to it
  // ...
}