module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define("Device", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("PiBook", "PiBox"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    failed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: "devices",
    timestamps: false
  });

  Device.associate = (models) => {
    Device.belongsTo(models.User, { foreignKey: "userId" });
    Device.hasMany(models.SyncEvent, { foreignKey: "deviceId" });
  };

  return Device;
};
