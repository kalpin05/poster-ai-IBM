module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Poster", {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: DataTypes.STRING,
    prompt: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: "Posters",
    timestamps: true
  });
};