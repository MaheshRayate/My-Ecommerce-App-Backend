const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "config.env" });

const app = require("./app");

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE_STRING)
  .then((con) => {
    console.log("Database Connection Successfull");
  })
  .catch((err) => {
    console.log("Database Connection Error - ", err);
  });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
