const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: [process.env.FRONTEND_URL, "https://shelf-sigma-hazel.vercel.app", "http://localhost:3000"].filter(Boolean), 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/listings", require("./modules/listings/listing.routes"));
app.use("/api/users", require("./modules/users/user.routes"));
app.use("/api/conversations", require("./modules/conversations/conversation.routes"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
