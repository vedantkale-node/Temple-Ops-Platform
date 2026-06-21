const themeToggleBtn = document.getElementById("theme-toggle");
const toggleIcon = document.getElementById("toggle-icon");

export const initTheme = () => {
  const isDark = localStorage.getItem("theme") === "dark";

  document.documentElement.classList.toggle("dark", isDark);

  if (toggleIcon) {
    toggleIcon.classList.toggle("ti-moon", !isDark);
    toggleIcon.classList.toggle("ti-sun", isDark);
  }

  if (!themeToggleBtn) return;

  themeToggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    const isDark = document.documentElement.classList.contains("dark");

    toggleIcon.classList.toggle("ti-moon", !isDark);
    toggleIcon.classList.toggle("ti-sun", isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
};
