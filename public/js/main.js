console.log("JS LOADED");

document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark",
);

const themeToggleBtn = document.getElementById("theme-toggle");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

console.log(localStorage.getItem("theme"));
console.log(document.documentElement.className);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// NOTYF

const notyf = new Notyf();
document.addEventListener("DOMContentLoaded", () => {
  const error = document.body.dataset.error;

  if (error && error !== "undefined" && error.trim() !== "") {
    notyf.error(error);
  }
});

// LOGIN VALIDATOR

const loginEmail = document.querySelector("#loginFieldEmail");
const loginPassword = document.querySelector("#loginFieldPassword");
const loginBtnSubmit = document.querySelector("#loginBtnSubmit");
const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginBtnSubmit.addEventListener("click", (e) => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email) {
      e.preventDefault();
      notyf.error("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      e.preventDefault();
      notyf.error("Invalid email");
      return;
    }

    if (!password) {
      e.preventDefault();
      notyf.error("Password is required");
      return;
    }

    if (password.length < 8) {
      e.preventDefault();
      notyf.error("Password must be at least 8 characters");
      return;
    }
  });
}

const signUpForm = document.querySelector("#signupform");
const firstNameSignup = document.querySelector("#signUpFieldFirstName");
const lastNameSignup = document.querySelector("#signUpFieldLastName");
const usernameSignup = document.querySelector("#signUpFieldUsername");
const emailSignup = document.querySelector("#signUpFieldEmail");
const passwordSignup = document.querySelector("#signUpFieldPassword");
const confirmPasswordSignup = document.querySelector(
  "#signUpFieldConfirmPassword",
);
const signUpBtnSubmit = document.querySelector("#signUpBtnSubmit");

if (signUpForm) {
  signUpBtnSubmit.addEventListener("click", (e) => {
    const firstName = firstNameSignup.value.trim();
    const lastName = lastNameSignup.value.trim();
    const username = usernameSignup.value.trim();
    const email = emailSignup.value.trim();
    const password = passwordSignup.value.trim();
    const confirmPassword = confirmPasswordSignup.value.trim();

    if (!firstName || firstName.length < 3) {
      e.preventDefault();
      notyf.error("Invalid first name");
      return;
    }

    if (!lastName || lastName.length < 3) {
      e.preventDefault();
      notyf.error("Invalid last name");
      return;
    }

    if (!username || lastName.length < 3) {
      e.preventDefault();
      notyf.error("Invalid username");
      return;
    }

    if (!email) {
      e.preventDefault();
      notyf.error("Invalid email");
      return;
    }

    if (!emailRegex.test(email)) {
      e.preventDefault();
      notyf.error("Invalid email");
      return;
    }

    if (!password || password.length < 8) {
      e.preventDefault();
      notyf.error("Invalid password");
      return;
    }

    if (!confirmPassword || confirmPassword !== password) {
      e.preventDefault();
      notyf.error("Password does not match");
      return;
    }
  });
}

const showLoginPasswordBtn = document.querySelector("#showPasswordBtn");

if (showLoginPasswordBtn) {
  showLoginPasswordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const passwordInput = document.querySelector("#loginFieldPassword");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      showLoginPasswordBtn.innerText = "hide";
    } else {
      passwordInput.type = "password";
      showLoginPasswordBtn.innerText = "show";
    }
  });
}

const showSignupPasswordBtn = document.querySelector("#showSignupPasswordBtn");

if (showSignupPasswordBtn) {
  showSignupPasswordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const passwordInput = document.querySelector("#signUpFieldPassword");
    const confirmPasswordInput = document.querySelector(
      "#signUpFieldConfirmPassword",
    );
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      confirmPasswordInput.type = "text";
      showSignupPasswordBtn.innerText = "hide";
    } else {
      passwordInput.type = "password";
      confirmPasswordInput.type = "password";
      showSignupPasswordBtn.innerText = "show";
    }
  });
}

const logOutModal = document.querySelector("#logoutModal");
const logOutModalBtn = document.querySelector("#logoutModalBtn");
const logOutModalClose = document.querySelector("#logoutModalClose");

if (logOutModalBtn) {
  logOutModalBtn.addEventListener("click", () => {
    localStorage.removeItem("activeSidebarIndex");
    logOutModal.classList.remove("hidden");
    logOutModal.classList.add("flex");
  });

  logOutModalClose.addEventListener("click", () => {
    logOutModal.classList.remove("flex");
    logOutModal.classList.add("hidden");
  });
}

const deleteInput = document.querySelector("#deleteConfirmInputEmail");
const deleteButton = document.querySelector("#deleteAccountBtn");

if (deleteInput) {
  const correctEmail = deleteInput.dataset.email;
  deleteInput.addEventListener("input", () => {
    const isValid = deleteInput.value.trim() === correctEmail;

    deleteButton.disabled = !isValid;

    deleteButton.classList.toggle("opacity-50", !isValid);

    deleteButton.classList.toggle("cursor-not-allowed", !isValid);
  });
}

const sidebarItems = document.querySelectorAll(".sidebar-item");
const savedIndex = localStorage.getItem("activeSidebarIndex");
const sidebarActiveClasses = [
  "bg-slate-200",
  "text-blue-gray-900",
  "dark:bg-gray-700",
  "dark:text-white",
];

const setActiveSidebarItem = (item) => {
  sidebarItems.forEach((el) => {
    el.classList.remove(...sidebarActiveClasses);
  });

  item?.classList.add(...sidebarActiveClasses);
};

if (savedIndex !== null) {
  setActiveSidebarItem(sidebarItems[savedIndex]);
}

sidebarItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    setActiveSidebarItem(item);
    localStorage.setItem("activeSidebarIndex", index);
  });
});
