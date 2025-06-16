const express = require("express");
const app = express();
const db = require("./models");

app.use(express.json());

db.sequelize.sync({ alter: true }).then(() => {
  console.log(" PostgreSQL Connected & Models Synced!");
});

app.listen(3000, () => {
  console.log(" Server running on port 3000");
});