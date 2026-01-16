const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: DataTypes.STRING
  }, {
    tableName: "Users",
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat',
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  });

  User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};