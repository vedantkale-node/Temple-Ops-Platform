export function initPasswordToggles() {
  const loginBtn = document.querySelector("#showPasswordBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const password = document.querySelector("#loginFieldPassword");

      const isPassword = password.type === "password";

      password.type = isPassword ? "text" : "password";
      loginBtn.innerText = isPassword ? "hide" : "show";
    });
  }

  const signupBtn = document.querySelector("#showSignupPasswordBtn");

  if (signupBtn) {
    signupBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const password = document.querySelector("#signUpFieldPassword");
      const confirmPassword = document.querySelector(
        "#signUpFieldConfirmPassword",
      );

      const isPassword = password.type === "password";

      password.type = isPassword ? "text" : "password";
      confirmPassword.type = isPassword ? "text" : "password";

      signupBtn.innerText = isPassword ? "hide" : "show";
    });
  }
}
