import { toggleDisabled } from "../utils/dom.js";

export function initDeleteConfirmation() {
  const deleteInput = document.querySelector("#deleteConfirmInputEmail");

  const deleteButton = document.querySelector("#deleteAccountBtn");

  if (!deleteInput || !deleteButton) return;

  const correctEmail = deleteInput.dataset.email;

  deleteInput.addEventListener("input", () => {
    const isValid = deleteInput.value.trim() === correctEmail;

    toggleDisabled(deleteButton, !isValid);
  });
}
