const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'processo_digital',
    'postgres',
    'admin',
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
    }
);

module.exports = sequelize;
