const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.User = require("./User")(sequelize, Sequelize.DataTypes);
db.Device = require("./Devices")(sequelize, Sequelize.DataTypes);
db.SyncEvent = require("./SyncEvent")(sequelize, Sequelize.DataTypes);

// Set associations
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
