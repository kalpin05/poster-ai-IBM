const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Poster = require('./poster')(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Poster, { foreignKey: 'userId' });
db.Poster.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;