const express = require("express");
const sequelize = require("./config/database");
const routes = require("./routes");
require("dotenv").config();
const path = require("path");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8001;
app.use(
  cors({
    origin: ["http://cobain.test", "http://localhost:3000"],
  })
);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json());
app.use("/api/products", routes);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
