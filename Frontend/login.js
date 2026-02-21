const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    message.style.color = "green";
    message.innerText = "Login successful! Redirecting...";
    localStorage.setItem("token", data.token);
    setTimeout(() => window.location.href = "index.html", 1500);
  } else {
    message.style.color = "red";
    message.innerText = data.message || "Login failed";
  }
});