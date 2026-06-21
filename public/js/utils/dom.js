export function toggleVisibility(element, isVisible) {
  element.classList.toggle("hidden", !isVisible);
  element.classList.toggle("flex", isVisible);
}

export function toggleDisabled(element, isDisabled) {
  element.disabled = isDisabled;

  element.classList.toggle("opacity-50", isDisabled);
  element.classList.toggle("cursor-not-allowed", isDisabled);
}
