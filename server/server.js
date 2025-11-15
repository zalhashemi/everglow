require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/business", require("./routes/businessRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/offers", require("./routes/offerRoutes"));
app.use("/api/loyalty", require("./routes/loyaltyRoutes"));
app.use("/api/public/businesses", require("./routes/publicBusinessRoutes"));

app.get("/", (req, res) => {
  res.send("Everglow API Running ✨");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
