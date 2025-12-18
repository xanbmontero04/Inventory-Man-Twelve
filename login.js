/* ========= DEMO USERS ========= */
const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "staff", password: "staff123", role: "staff" }
];

localStorage.setItem("users", JSON.stringify(users));

/* ========= LOGIN ========= */
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("loginMsg");

  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  const user = storedUsers.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    msg.textContent = "❌ Invalid username or password";
    msg.className = "msg err";
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "index.html";
});
