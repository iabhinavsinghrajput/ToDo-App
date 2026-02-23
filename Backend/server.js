// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// require("dotenv").config();
// require("./db"); // connect to DB

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Serve frontend static files
// const frontendPath = path.join(__dirname, "../Frontend");
// app.use(express.static(frontendPath));

// // API Routes
// const authRoutes = require("./routes/auth");
// const todoRoutes = require("./routes/todos");

// app.use("/api/auth", authRoutes);
// app.use("/api/todos", todoRoutes);

// // Serve HTML pages for frontend routes
// app.get("/", (req, res) => {
//   res.sendFile(path.join(frontendPath, "login.html"));
// });
// app.get("/login.html", (req, res) => {
//   res.sendFile(path.join(frontendPath, "login.html"));
// });
// app.get("/register.html", (req, res) => {
//   res.sendFile(path.join(frontendPath, "register.html"));
// });
// app.get("/forgot.html", (req, res) => {
//   res.sendFile(path.join(frontendPath, "forgot.html"));
// });
// app.get("/otp.html", (req, res) => {
//   res.sendFile(path.join(frontendPath, "otp.html"));
// });
// app.get("/reset.html", (req, res) => {
//   res.sendFile(path.join(frontendPath, "reset.html"));
// });

// // Fallback for any other route (works without error)
// app.use((req, res) => {
//   res.sendFile(path.join(frontendPath, "login.html"));
// });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// API routes only
app.use("/api/auth", require("./routes/auth"));
app.use("/api/todos", require("./routes/todos"));

// Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);