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