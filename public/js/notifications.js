/* global Notyf */
export const notyf = new Notyf();

export function initNotifications() {
  const error = document.body.dataset.error;

  if (error && error !== "undefined" && error.trim() !== "") {
    notyf.error(error);
  }
}
