import { toggleVisibility } from "../utils/dom.js";

export function initLogoutModal() {
  const modal = document.querySelector("#logoutModal");
  const openBtn = document.querySelector("#logoutModalBtn");
  const closeBtn = document.querySelector("#logoutModalClose");

  if (!modal || !openBtn || !closeBtn) return;

  openBtn.addEventListener("click", () => {
    localStorage.removeItem("activeSidebarIndex");
    toggleVisibility(modal, true);
  });

  closeBtn.addEventListener("click", () => {
    toggleVisibility(modal, false);
  });
}
