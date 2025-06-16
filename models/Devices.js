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
        },
        type: {
            type: DataTypes.ENUM("PiBook", "PiBox"),
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        tableName: "devices",
        timestamps: false
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
