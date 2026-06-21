import { initTheme } from "./theme.js";
import { initNotifications } from "./notifications.js";
import { initLoginForm } from "./auth/login.js";
import { initSignupForm } from "./auth/signup.js";
import { initPasswordToggles } from "./auth/password-toggle.js";
import { initLogoutModal } from "./modals/logout-modal.js";
import { initDeleteConfirmation } from "./account/delete-confirmation.js";
import { initSidebar } from "./sidebar.js";

console.log("JS LOADED");

initTheme();
initNotifications();
initLoginForm();
initSignupForm();
initPasswordToggles();
initLogoutModal();
initDeleteConfirmation();
initSidebar();
