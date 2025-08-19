// ...Light and dark theme...
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Load theme from localStorage
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-theme");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-theme");
        if (body.classList.contains("dark-theme")) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem("theme", "dark");
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem("theme", "light");
        }
    });
});
// ...Light and dark theme...


// ...map...


let map, service, markers = [];



function initMap(lat = 31.117119, lng = -97.727796) { // Default: Killeen, TX 
    const location = new google.maps.LatLng(lat, lng);
    map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 14,
    });
    service = new google.maps.places.PlacesService(map);
}

function findPlaces() {
  const address = document.getElementById("locationInput").value;
  if (!address) return alert("Please enter a location or use GPS");

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK) {
      const loc = results[0].geometry.location;
      map.setCenter(loc);
      searchNearby(loc);
    } else {
      alert("Location not found");
    }
  });
}

function useGPS() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(loc);
        searchNearby(loc);
      },
      () => alert("Unable to get your location")
    );
  } else {
    alert("Geolocation not supported");
  }
}

function searchNearby(location) {
  clearMarkers();
  const request = {
    location,
    radius: 5000, // 5km
    keyword: "childcare OR daycare OR child support center"
  };
  service.nearbySearch(request, showResults);
}

function showResults(results, status) {
  const output = document.getElementById("results");
  output.innerHTML = "";
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    results.forEach((place, index) => {
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location
      });
      markers.push(marker);

      const photo = place.photos && place.photos.length > 0 
        ? place.photos[0].getUrl({maxWidth: 100, maxHeight: 100})
        : "https://via.placeholder.com/70?text=No+Image";

      const rating = place.rating ? 
        `<div class="rating">⭐ ${place.rating} (${place.user_ratings_total || 0} reviews)</div>` 
        : "";

      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name)}&destination_place_id=${place.place_id}`;

      output.innerHTML += `
        <div class="place" onclick="focusMarker(${index})">
          <img src="${photo}" alt="${place.name}">
          <div class="place-details">
            <strong>${place.name}</strong>
            <div>${place.vicinity || ''}</div>
            ${rating}
            <a class="directions" href="${directionsUrl}" target="_blank">📍 Get Directions</a>
          </div>
        </div>
      `;
    });
  } else {
    output.innerHTML = "No results found.";
  }
}

function focusMarker(index) {
  map.setCenter(markers[index].getPosition());
  map.setZoom(16);
}

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

window.onload = () => {
  initMap();
  useGPS(); // Try automatic location on load
};

// ...map...


// ...menu...

document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".nav-links ul li");
    const navLinks = document.getElementById("navLinks");
    const menuToggle = document.getElementById("menu-toggle");
    const overlay = document.getElementById("overlay");

    function openMenu() {
        navLinks.classList.add("active");
        overlay.classList.add("show");
    }

    function closeMenu() {
        navLinks.classList.remove("active");
        overlay.classList.remove("show");
    }

    menuToggle.addEventListener("click", () => {
        if (navLinks.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener("click", closeMenu);

    // Desktop dropdown with fade-in/out
    navItems.forEach((item) => {
        const submenu = item.querySelector(".sub-menu-1");
        let timeoutId;
        if (submenu) {
            item.addEventListener("mouseenter", () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    submenu.classList.add("show");
                }, 300);
            });
            item.addEventListener("mouseleave", () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    submenu.classList.remove("show");
                }, 300);
            });
        }
    });

});

// ...menu...

// ...email...

  document.addEventListener("DOMContentLoaded", function () {
    // Initialize EmailJS
    emailjs.init("yWWzG_SgD2z79-Oey"); // Replace with your EmailJS Public Key

    // Handle form submit
    const contactForm = document.getElementById("contact-form");
    const statusDiv = document.getElementById("status");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            emailjs.sendForm("service_wfw3awg", "template_7olc8ke", this)
                .then(function() {
                    if (statusDiv) {
                        statusDiv.innerHTML =
                            '<div class="success">✅ Your message has been sent successfully!</div>';
                    }
                    contactForm.reset();
                }, function(error) {
                    if (statusDiv) {
                        statusDiv.innerHTML =
                            '<div class="error">❌ Failed to send. Please try again later.</div>';
                    }
                    console.error("Error:", error);
                });
        });
    }
});
