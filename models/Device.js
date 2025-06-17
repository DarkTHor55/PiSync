module.exports = (sequelize, DataTypes) => {
    const Device = sequelize.define("Device", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        deviceName: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue('deviceName', value.trim());
            },
            validate: {
                notNull: { msg: "Device name is required" },
                notEmpty: { msg: "Device name cannot be empty" },
                len: {
                    args: [3, 255],
                    msg: "Device name must be at least 3 characters",
                },
            },
        }
        ,
        type: {
            type: DataTypes.ENUM("pibook", "pibox"),
            allowNull: false,
            validate: {
                notNull: { msg: "Device type is required" },
                isIn: {
                    args: [["pibook", "pibox"]],
                    msg: "Type must be either 'pibook' or 'pibox'",
                },
            },
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: { msg: "User ID is required" },
                isUUID: {
                    args: 4,
                    msg: "Invalid User ID format (must be UUIDv4)",
                },
            },
        },
        FailedCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                isInt: { msg: "FailedCount must be an integer" },
                min: {
                    args: [0],
                    msg: "FailedCount cannot be negative"
                }
            }
        }, consecutiveFailures: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                isInt: { msg: "consecutiveFailures must be an integer" },
                min: {
                    args: [0],
                    msg: "consecutiveFailures cannot be negative"
                }
            }
        }
    }, {
        tableName: "devices",
        timestamps: true,
    });

    Device.associate = (models) => {
        Device.belongsTo(models.User, {
            foreignKey: "userId",
            targetKey: "userId",
        });
        Device.hasMany(models.SyncEvent, { foreignKey: "deviceId" });
    };

    return Device;
};
