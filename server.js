const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => {
  console.log("DB connection successful!");
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
