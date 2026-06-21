import { notyf } from "../notifications.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initLoginForm() {
  const loginForm = document.querySelector("#loginForm");

  if (!loginForm) return;

  const loginEmail = document.querySelector("#loginFieldEmail");
  const loginPassword = document.querySelector("#loginFieldPassword");
  const loginBtnSubmit = document.querySelector("#loginBtnSubmit");

  loginBtnSubmit.addEventListener("click", (e) => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email) {
      e.preventDefault();
      return notyf.error("Email is required");
    }

    if (!emailRegex.test(email)) {
      e.preventDefault();
      return notyf.error("Invalid email");
    }

    if (!password) {
      e.preventDefault();
      return notyf.error("Password is required");
    }

    if (password.length < 8) {
      e.preventDefault();
      return notyf.error("Password must be at least 8 characters");
    }
  });
}
