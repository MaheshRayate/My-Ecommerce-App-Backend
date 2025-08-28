const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const addressRouter = require("./routes/addressRoutes");
const globalErrorHandler = require("./controllers/errorControllers");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "sucess",
    message: "Hello World",
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/addresses", addressRouter);

app.use(globalErrorHandler);

module.exports = app;
