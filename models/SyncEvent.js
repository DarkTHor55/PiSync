module.exports = (sequelize, DataTypes) => {
  const SyncEvent = sequelize.define("SyncEvent", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    deviceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
       defaultValue: DataTypes.NOW,
    },
    totalFileSynced: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalError: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    internetSpeed: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: "sync_events",
    timestamps: false
  });

  SyncEvent.associate = (models) => {
    SyncEvent.belongsTo(models.Device, { foreignKey: "deviceId" });
  };

  return SyncEvent;
};
