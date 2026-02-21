const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // ✅ LOGOUT
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}