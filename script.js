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
        location: location,
        radius: 5000,
        type: ['school', 'child_care', 'day_care_center']
    };

    service.nearbySearch(request, (results, status) => {
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = ""; // Clear previous results

        if (status === google.maps.places.PlacesServiceStatus.OK && results.length) {
            const grid = document.createElement("div");
            grid.className = "results-grid";
            results.forEach((place, i) => {
                // Add marker for each place
                const marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location,
                    title: place.name
                });
                markers.push(marker);

                // Card item
                const card = document.createElement("div");
                card.className = "result-card";
                card.innerHTML = `
                    <strong>${place.name}</strong><br>
                    ${place.vicinity || ""}
                `;
                card.onclick = () => focusMarker(i);
                grid.appendChild(card);
            });
            resultsDiv.appendChild(grid);
        } else {
            resultsDiv.innerHTML = "<p>No child care centers found nearby.</p>";
        }
    });
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
