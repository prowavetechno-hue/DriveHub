const splash = document.getElementById("splash");
const loginScreen = document.getElementById("loginScreen");
const roleScreen = document.getElementById("roleScreen");
const signupScreen = document.getElementById("signupScreen");
const riderDashboard =
  document.getElementById("riderDashboard");
const toast = document.getElementById("toast");


// ==========================
// SCREEN CONTROL
// ==========================

function showScreen(screen) {
  splash.classList.add("hidden");
  loginScreen.classList.add("hidden");
  roleScreen.classList.add("hidden");
  signupScreen.classList.add("hidden");
  riderDashboard.classList.add("hidden");
  screen.classList.remove("hidden");
}


// ==========================
// TOAST MESSAGE
// ==========================

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


// ==========================
// SPLASH SCREEN
// ==========================

window.addEventListener("load", () => {

  setTimeout(() => {
    showScreen(loginScreen);
  }, 1800);

});

// ==========================
// LOGIN - REAL ACCOUNT CHECK
// ==========================

document.getElementById("loginBtn").addEventListener("click", () => {

  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!phone) {
    showToast("Please enter your mobile number");
    return;
  }

  if (!password) {
    showToast("Please enter your password");
    return;
  }

  // Saved account check
  const savedAccount = localStorage.getItem("drivehubAccount");

  if (!savedAccount) {
    showToast("No account found. Please create an account first.");
    return;
  }

  const account = JSON.parse(savedAccount);

  // Check mobile number
  if (account.phone !== phone) {
    showToast("Incorrect mobile number or password");
    return;
  }

  // Check password
  if (account.password !== password) {
    showToast("Incorrect mobile number or password");
    return;
  }

  // Login successful
  localStorage.setItem("drivehubLoggedIn", "true");

  showToast("Login successful");

  setTimeout(() => {
    showScreen(roleScreen);
  }, 700);

});

// ==========================
// CREATE ACCOUNT
// ==========================

document.getElementById("signupBtn").addEventListener("click", () => {
  showScreen(signupScreen);
});


// ==========================
// BACK TO LOGIN
// ==========================

document.getElementById("backToLogin").addEventListener("click", () => {
  showScreen(loginScreen);
});


// ==========================
// CREATE NEW ACCOUNT
// ==========================

document.getElementById("createAccountBtn").addEventListener("click", () => {

  const name =
    document.getElementById("signupName").value.trim();

  const phone =
    document.getElementById("signupPhone").value.trim();

  const password =
    document.getElementById("signupPassword").value.trim();


  // Validation

  if (!name) {
    showToast("Please enter your name");
    return;
  }

  if (!phone) {
    showToast("Please enter your mobile number");
    return;
  }

  if (!password) {
    showToast("Please create a password");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters");
    return;
  }


  // Check if account already exists

  const existingAccount =
    localStorage.getItem("drivehubAccount");


  if (existingAccount) {

    const account =
      JSON.parse(existingAccount);

    if (account.phone === phone) {

      showToast(
        "This mobile number is already registered"
      );

      return;
    }
  }


  // Create account

  const newAccount = {

    name: name,

    phone: phone,

    password: password,

    role: null,

    createdAt: new Date().toISOString()

  };


  // Save account

  localStorage.setItem(
    "drivehubAccount",
    JSON.stringify(newAccount)
  );


  showToast(
    "Account created successfully"
  );


  setTimeout(() => {

    showScreen(roleScreen);

  }, 700);

});


// ==========================
// ROLE SELECTION
// ==========================

document.querySelectorAll(".role-card").forEach(card => {

  card.addEventListener("click", () => {

    const role = card.dataset.role;

    if (role === "rider") {

  showToast("Welcome to DriveHub Rider 🚗");

  setTimeout(() => {

    showScreen(riderDashboard);

  }, 700);

}

    if (role === "driver") {

      showToast("Driver account selected");

      setTimeout(() => {
        showToast("Driver Dashboard coming next 🧑‍✈️");
      }, 700);

    }

  });

});
// ==========================
// LOCATION + MAP SYSTEM
// ==========================

const mapModal = document.getElementById("mapModal");
const mapTitle = document.getElementById("mapTitle");
const closeMapBtn = document.getElementById("closeMapBtn");
const currentLocationBtn =
  document.getElementById("currentLocationBtn");
const confirmLocationBtn =
  document.getElementById("confirmLocationBtn");

let map = null;
let locationMarker = null;

let selectedLatitude = null;
let selectedLongitude = null;

let selectingLocation = "pickup";


// ==========================
// OPEN MAP
// ==========================

function openLocationMap(type) {

  selectingLocation = type;

  if (type === "pickup") {
    mapTitle.textContent = "Choose Pickup";
  } else {
    mapTitle.textContent = "Choose Destination";
  }

  mapModal.classList.remove("hidden");

  setTimeout(() => {

    if (!map) {

      map = L.map("map").setView(
        [25.3960, 68.3578],
        13
      );

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "© OpenStreetMap"
        }
      ).addTo(map);

    }

    map.invalidateSize();

  }, 200);
}


// ==========================
// PICKUP CLICK
// ==========================

document
  .getElementById("pickupInput")
  .addEventListener("click", () => {

    openLocationMap("pickup");

  });


// ==========================
// DESTINATION CLICK
// ==========================

document
  .getElementById("destinationInput")
  .addEventListener("click", () => {

    openLocationMap("destination");

  });


// ==========================
// MAP CLICK
// ==========================

function selectMapLocation(lat, lng) {

  selectedLatitude = lat;
  selectedLongitude = lng;

  if (locationMarker) {
    map.removeLayer(locationMarker);
  }

  locationMarker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup("Selected Location")
    .openPopup();

}


// User map par tap kare
if (document.getElementById("map")) {

  document
    .getElementById("map")
    .addEventListener("click", () => {});

}


// Leaflet map click
function enableMapClick() {

  if (!map) return;

  map.on("click", function(e) {

    selectMapLocation(
      e.latlng.lat,
      e.latlng.lng
    );

  });

}


// ==========================
// CURRENT LOCATION
// ==========================

currentLocationBtn.addEventListener(
  "click",
  () => {

    if (!navigator.geolocation) {

      showToast(
        "Location is not supported on this device"
      );

      return;
    }

    showToast("Getting your location...");

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;

        selectedLatitude = lat;
        selectedLongitude = lng;

        map.setView(
          [lat, lng],
          16
        );

        if (locationMarker) {
          map.removeLayer(locationMarker);
        }

        locationMarker =
          L.marker([lat, lng])
            .addTo(map)
            .bindPopup("📍 Your Location")
            .openPopup();

        showToast(
          "Location found successfully 📍"
        );

      },

      () => {

        showToast(
          "Please allow location access"
        );

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }

    );

  }
);


// ==========================
// CONFIRM LOCATION
// ==========================

confirmLocationBtn.addEventListener(
  "click",
  async () => {

    if (
      selectedLatitude === null ||
      selectedLongitude === null
    ) {

      showToast(
        "Please select a location first"
      );

      return;
    }

    const lat = selectedLatitude;
    const lng = selectedLongitude;

    const locationName =
      `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    if (selectingLocation === "pickup") {

      document.getElementById(
        "pickupInput"
      ).value = locationName;

    } else {

      document.getElementById(
        "destinationInput"
      ).value = locationName;

    }

    mapModal.classList.add("hidden");

    showToast(
      selectingLocation === "pickup"
        ? "Pickup location selected 📍"
        : "Destination selected 📍"
    );

  }
);


// ==========================
// CLOSE MAP
// ==========================

closeMapBtn.addEventListener(
  "click",
  () => {

    mapModal.classList.add("hidden");

  }
);


// ==========================
// ENABLE MAP CLICK
// ==========================

setTimeout(() => {

  if (map) {
    enableMapClick();
  }

}, 1000);
// ==========================
// DRIVEHUB LOCATION MAP
// ==========================

const mapBox = document.getElementById("mapBox");
const mapTitle = document.getElementById("mapTitle");
const closeMapBtn = document.getElementById("closeMapBtn");
const currentLocationBtn =
  document.getElementById("currentLocationBtn");
const confirmLocationBtn =
  document.getElementById("confirmLocationBtn");

const pickupInput =
  document.getElementById("pickupInput");

const destinationInput =
  document.getElementById("destinationInput");

let driveHubMap = null;
let selectedMarker = null;

let selectedLat = null;
let selectedLng = null;

let selectingType = "pickup";


// ==========================
// OPEN MAP
// ==========================

function openDriveHubMap(type) {

  selectingType = type;

  if (type === "pickup") {
    mapTitle.textContent = "Choose Pickup";
  } else {
    mapTitle.textContent = "Choose Destination";
  }

  mapBox.classList.remove("hidden");

  setTimeout(() => {

    if (!driveHubMap) {

      driveHubMap = L.map("map").setView(
        [25.3960, 68.3578],
        13
      );

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "© OpenStreetMap"
        }
      ).addTo(driveHubMap);


      // MAP TAP
      driveHubMap.on("click", function(e) {

        selectDriveHubLocation(
          e.latlng.lat,
          e.latlng.lng
        );

      });

    }

    driveHubMap.invalidateSize();

  }, 200);
}


// ==========================
// SELECT LOCATION
// ==========================

function selectDriveHubLocation(lat, lng) {

  selectedLat = lat;
  selectedLng = lng;

  if (selectedMarker) {
    driveHubMap.removeLayer(selectedMarker);
  }

  selectedMarker = L.marker([
    lat,
    lng
  ]).addTo(driveHubMap);

  selectedMarker
    .bindPopup("📍 Selected Location")
    .openPopup();

}


// ==========================
// PICKUP
// ==========================

pickupInput.addEventListener(
  "click",
  function() {

    openDriveHubMap("pickup");

  }
);


// ==========================
// DESTINATION
// ==========================

destinationInput.addEventListener(
  "click",
  function() {

    openDriveHubMap("destination");

  }
);


// ==========================
// CURRENT LOCATION
// ==========================

currentLocationBtn.addEventListener(
  "click",
  function() {

    if (!navigator.geolocation) {

      showToast(
        "Location is not supported"
      );

      return;
    }

    showToast(
      "Getting your location..."
    );


    navigator.geolocation.getCurrentPosition(

      function(position) {

        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;


        selectedLat = lat;
        selectedLng = lng;


        driveHubMap.setView(
          [lat, lng],
          16
        );


        if (selectedMarker) {
          driveHubMap.removeLayer(
            selectedMarker
          );
        }


        selectedMarker =
          L.marker([lat, lng])
            .addTo(driveHubMap)
            .bindPopup(
              "📍 Your Current Location"
            )
            .openPopup();


        showToast(
          "Location found 📍"
        );

      },


      function() {

        showToast(
          "Please allow location access"
        );

      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }

    );

  }
);


// ==========================
// CONFIRM LOCATION
// ==========================

confirmLocationBtn.addEventListener(
  "click",
  function() {

    if (
      selectedLat === null ||
      selectedLng === null
    ) {

      showToast(
        "Please select a location first"
      );

      return;
    }


    const locationText =
      `${selectedLat.toFixed(5)}, ${selectedLng.toFixed(5)}`;


    if (selectingType === "pickup") {

      pickupInput.value =
        locationText;

      showToast(
        "Pickup location selected 📍"
      );

    } else {

      destinationInput.value =
        locationText;

      showToast(
        "Destination selected 📍"
      );

    }


    mapBox.classList.add("hidden");

  }
);


// ==========================
// CLOSE MAP
// ==========================

closeMapBtn.addEventListener(
  "click",
  function() {

    mapBox.classList.add("hidden");

  }
);
