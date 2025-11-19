require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DEBUG ROUTE (optional)
app.get("/debug/uploads", (req, res) => {
  const dir = path.join(__dirname, "uploads");
  try {
    const files = fs.readdirSync(dir);
    res.json({ uploadsDir: dir, files });
  } catch (err) {
    res.status(500).json({ error: err.message, dir });
  }
});

// MAIN ROUTES
app.use("/api/business", require("./routes/businessRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/offers", require("./routes/offerRoutes"));
app.use("/api/loyalty", require("./routes/loyaltyRoutes"));

// PUBLIC ROUTE USED BY HOMEPAGE
app.use("/api/public/businesses", require("./routes/publicBusinessRoutes"));

// HOME
app.get("/", (req, res) => {
  res.send("Everglow API Running ✨");
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
