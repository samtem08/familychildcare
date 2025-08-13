// ...Light and dark theme...
document.addEventListener("DOMContentLoaded", function () {
    // ...existing code...

    // Theme toggle
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


let map;
let service;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 31.117119, lng: -97.727796 }, // Default: Killeen, TX 
        zoom: 14,
    });
}

function findNearbyChildCare() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                map.setCenter(userLocation);

                // Add marker for user's location
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "You are here",
                });

                // Search for child care centers
                const request = {
                    location: userLocation,
                    radius: 5000, // 5 km
                    keyword: "child care OR day care",
                };

                service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        results.forEach(place => {
                            new google.maps.Marker({
                                position: place.geometry.location,
                                map: map,
                                title: place.name,
                            });
                        });
                    }
                });
            },
            () => {
                alert("Unable to get your location.");
            }
        );
    } else {
        alert("Geolocation not supported by your browser.");
    }
}

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

  // Initialize EmailJS
  (function(){
    emailjs.init("yWWzG_SgD2z79-Oey"); // Replace with your EmailJS Public Key
  })();

  // Handle form submit
  document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    emailjs.sendForm("service_wfw3awg", "template_7olc8ke", this)
      .then(function() {
        document.getElementById("status").innerHTML =
          '<div class="success">✅ Your message has been sent successfully!</div>';
        document.getElementById("contact-form").reset();
      }, function(error) {
        document.getElementById("status").innerHTML =
          '<div class="error">❌ Failed to send. Please try again later.</div>';
        console.error("Error:", error);
      });
  });
// ...email...

