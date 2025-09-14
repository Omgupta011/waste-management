document.addEventListener("DOMContentLoaded", () => {
  // Chart.js Pie Chart
  const ctx = document.getElementById("wasteChart").getContext("2d");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Organic", "Plastic", "Metal", "E-Waste"],
      datasets: [{
        label: "Waste Segregation",
        data: [40, 30, 20, 10],
        backgroundColor: ["#27ae60", "#2980b9", "#f39c12", "#e74c3c"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });

  // Restore last shown quote
  const savedQuote = localStorage.getItem("lastQuote");
  if (savedQuote) {
    document.getElementById("quoteText").innerText = savedQuote;
  } else {
    newQuote();
  }

  // Restore stories from localStorage
  const savedStories = JSON.parse(localStorage.getItem("stories")) || [];
  savedStories.forEach(story => {
    appendStory(story);
  });

  // Attach button events
  document.getElementById("newQuoteBtn")?.addEventListener("click", newQuote);
  document.getElementById("shareQuoteBtn")?.addEventListener("click", copyQuote);
  document.getElementById("submitStoryBtn")?.addEventListener("click", addStory);
  document.getElementById("clearStoriesBtn")?.addEventListener("click", clearStories);
});

// Google Maps
function initMap() {
  const center = { lat: 28.6139, lng: 77.2090 }; // Delhi
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: center,
  });

  const markers = [
    { position: { lat: 28.6139, lng: 77.2090 }, title: "Central Recycling Center" },
    { position: { lat: 28.7041, lng: 77.1025 }, title: "North Facility" },
    { position: { lat: 28.5355, lng: 77.3910 }, title: "South Facility" }
  ];

  markers.forEach(m => {
    new google.maps.Marker({
      position: m.position,
      map: map,
      title: m.title
    });
  });

  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let searchMarker = null;

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();
    if (places.length == 0) return;

    if (searchMarker) searchMarker.setMap(null);

    const place = places[0];
    if (!place.geometry || !place.geometry.location) return;

    searchMarker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name,
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    });

    map.setCenter(place.geometry.location);
    map.setZoom(14);
  });
}

// Quotes
const quotes = [
  "Clean city, green city is our dream city.",
  "Waste is only waste if you waste it.",
  "Be part of the solution, not pollution.",
  "Reduce, Reuse, Recycle – the power is in your hands.",
  "A green planet is a clean planet."
];

function newQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteText").innerText = quote;
  localStorage.setItem("lastQuote", quote);
}

function copyQuote() {
  const quote = document.getElementById("quoteText").innerText;
  navigator.clipboard.writeText(quote).then(() => {
    alert("Quote copied to clipboard! ✅");
  }).catch(err => {
    console.error("Clipboard error:", err);
  });
}

// Add story
function addStory() {
  const input = document.getElementById("storyInput").value;
  if (input.trim() !== "") {
    appendStory(input);

    // Save to localStorage
    const savedStories = JSON.parse(localStorage.getItem("stories")) || [];
    savedStories.push(input);
    localStorage.setItem("stories", JSON.stringify(savedStories));

    document.getElementById("storyInput").value = "";
  }
}

// Append story helper
function appendStory(text) {
  const storyDiv = document.getElementById("storiesList");
  const newStory = document.createElement("p");
  newStory.innerHTML = `<b>Citizen:</b> ${text}`;
  storyDiv.appendChild(newStory);
}

// Clear all stories
function clearStories() {
  const storyDiv = document.getElementById("storiesList");
  storyDiv.innerHTML = "";
  localStorage.removeItem("stories");
}

// Leaderboard Data Restore
document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();
});

function addStory() {
  const input = document.getElementById("storyInput").value;
  if (input.trim() !== "") {
    appendStory(input);

    // Save story
    const savedStories = JSON.parse(localStorage.getItem("stories")) || [];
    savedStories.push(input);
    localStorage.setItem("stories", JSON.stringify(savedStories));

    // Add points
    addPoints("Citizen", 10);

    document.getElementById("storyInput").value = "";
  }
}

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("active");
});

// Profile dropdown toggle
const profileIcon = document.getElementById("profileIcon");
const dropdownMenu = document.getElementById("dropdownMenu");

profileIcon.addEventListener("click", () => {
  dropdownMenu.classList.toggle("active");
});

// Close dropdown if clicked outside
document.addEventListener("click", (event) => {
  if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove("active");
  }
});