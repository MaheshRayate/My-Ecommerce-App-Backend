const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const addressRouter = require("./routes/addressRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const globalErrorHandler = require("./controllers/errorControllers");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:4173",
    // frontend URL
    credentials: true, // allow cookies
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "sucess",
    message: "Hello World",
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(globalErrorHandler);

module.exports = app;
