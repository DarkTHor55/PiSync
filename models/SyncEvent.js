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
      validate: {
        notNull: { msg: "Device ID is required" },
        isUUID: {
          args: 4,
          msg: "Device ID must be a valid UUIDv4",
        },
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        notNull: { msg: "Timestamp is required" },
        isDate: { msg: "Timestamp must be a valid date" },
      },
    },
    totalFileSynced: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: { msg: "Total files synced must be an integer" },
        min: {
          args: [0],
          msg: "Total files synced cannot be negative",
        },
      },
    },
    totalError: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: { msg: "Total errors must be an integer" },
        min: {
          args: [0],
          msg: "Total errors cannot be negative",
        },
      },
    },
    internetSpeed: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isFloat: { msg: "Internet speed must be a number" },
        min: {
          args: [0],
          msg: "Internet speed cannot be negative",
        },
      },
    },

    internetSpeedUnit: {
      type: DataTypes.ENUM("kbps", "mbps", "gbps"),
      allowNull: false,
      defaultValue: "mbps",
      validate: {
        notNull: { msg: "Internet speed unit is required" },
        isIn: {
          args: [["kbps", "mbps", "gbps"]],
          msg: "Internet speed unit must be 'kbps', 'mbps', or 'gbps'",
        },
      },
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: "CreatedAt must be a valid date" },
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: "UpdatedAt must be a valid date" },
      },
    },
  }, {
    tableName: "sync_events",
    timestamps: false,
  });

  SyncEvent.associate = (models) => {
    SyncEvent.belongsTo(models.Device, { foreignKey: "deviceId" });
  };

  return SyncEvent;
};
