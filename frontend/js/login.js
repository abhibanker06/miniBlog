const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

  // Handle Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        window.location.href = "index.html"; // redirect to homepage
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  });

  // Handle Register
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = registerForm.username.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! Please login.");
        document.querySelector(".toggle").click(); // flip card to login
      } else {
        alert(data.msg || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  });