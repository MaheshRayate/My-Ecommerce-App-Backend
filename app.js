const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const addressRouter = require("./routes/addressRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const globalErrorHandler = require("./controllers/errorControllers");

const app = express();

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_PROD_URL
    : process.env.FRONTEND_DEV_URL;

// ✅ CORS (must come before routes)
app.use(
  cors({
    origin: API_URL,
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello World",
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(globalErrorHandler);

module.exports = app;
