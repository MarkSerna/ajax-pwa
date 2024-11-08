const sidebarButton = document.getElementById("sidebarButton");
const sidebarContent = document.getElementById("sidebarContent");
const closeSidebarButton = document.getElementById("closeSidebarButton");

function toggleSidebar() {
  sidebarContent.classList.toggle("-translate-x-full");
}

function closeSidebar(event) {
  if (!sidebarContent.contains(event.target) && !sidebarButton.contains(event.target)) {
    sidebarContent.classList.add("-translate-x-full");
  }
}

sidebarButton.addEventListener("click", toggleSidebar);
closeSidebarButton.addEventListener("click", toggleSidebar);
document.addEventListener("click", closeSidebar);

document.getElementById('currentYear').textContent = new Date().getFullYear();