export function initSidebar() {
  const sidebarItems = document.querySelectorAll(".sidebar-item");

  if (!sidebarItems.length) return;

  const savedIndex = localStorage.getItem("activeSidebarIndex");

  const activeClasses = [
    "bg-slate-200",
    "text-blue-gray-900",
    "dark:bg-gray-700",
    "dark:text-white",
  ];

  const setActiveItem = (item) => {
    sidebarItems.forEach((el) => {
      el.classList.remove(...activeClasses);
    });

    item?.classList.add(...activeClasses);
  };

  if (savedIndex !== null) {
    setActiveItem(sidebarItems[savedIndex]);
  }

  sidebarItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      setActiveItem(item);
      localStorage.setItem("activeSidebarIndex", index);
    });
  });
}
