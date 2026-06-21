import { notyf } from "../notifications.js";
import { isValidEmail } from "../utils/validators.js";

export function initSignupForm() {
  const signUpForm = document.querySelector("#signupform");

  if (!signUpForm) return;

  const firstName = document.querySelector("#signUpFieldFirstName");
  const lastName = document.querySelector("#signUpFieldLastName");
  const username = document.querySelector("#signUpFieldUsername");
  const email = document.querySelector("#signUpFieldEmail");
  const password = document.querySelector("#signUpFieldPassword");
  const confirmPassword = document.querySelector("#signUpFieldConfirmPassword");

  const submitBtn = document.querySelector("#signUpBtnSubmit");

  submitBtn.addEventListener("click", (e) => {
    if (!firstName.value.trim() || firstName.value.trim().length < 3) {
      e.preventDefault();
      return notyf.error("Invalid first name");
    }

    if (!lastName.value.trim() || lastName.value.trim().length < 3) {
      e.preventDefault();
      return notyf.error("Invalid last name");
    }

    if (!username.value.trim() || username.value.trim().length < 3) {
      e.preventDefault();
      return notyf.error("Invalid username");
    }

    if (!isValidEmail(email.value.trim())) {
      e.preventDefault();
      return notyf.error("Invalid email");
    }

    if (!password.value.trim() || password.value.trim().length < 8) {
      e.preventDefault();
      return notyf.error("Invalid password");
    }

    if (confirmPassword.value.trim() !== password.value.trim()) {
      e.preventDefault();
      return notyf.error("Password does not match");
    }
  });
}
