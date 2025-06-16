const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./models");

app.use(express.json());

// Routes
app.use("/api/", require("./routes"));

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  console.log("PostgreSQL Connected & Models Synced!");
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
});
