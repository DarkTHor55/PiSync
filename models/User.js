
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Username is required" },
        len: {
          args: [3, 255],
          msg: "Username must be at least 3 characters",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: "password_digest", // we can use bcrypt for encryption
      allowNull: true,
      validate: {
        len: {
          args: [6, 100],
          msg: "Password must be at least 6 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email already in use",
      },
      validate: {
        notNull: { msg: "Email is required" },
        isEmail: {
          msg: "Invalid email format",
        },
      },
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: {
          msg: "DOB must be a valid date",
        },
        isValidDOB(value) {
          if (value && new Date(value) > new Date()) {
            throw new Error("DOB cannot be a future date");
          }
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
    {
      tableName: "users",
      timestamps: false,
    });

  User.associate = (models) => {
    User.hasMany(models.Device, { foreignKey: "userId" });
  };

  return User;
};
