'use strict';

require('dotenv').config();

const { DB_CONNECTION, DB_HOST, DB_POST, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_CONNECTION,
    dialectOptions: {
        useUTC: false,
        typeCast: function (field, next) {
            if (field.type === 'DATETIME') {
              return new Date(field.string() + 'Z');
            }
            return next()
        }
    },
    timezone: '-03:00'
});

sequelize.authenticate().then(function() {
    console.log("successo");
}).catch(function(erro) {
    console.log("error: " + erro);
});

const ReferenciaParametroExame = sequelize.define('referenciaparametroexame', {
    comparacao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idadeMinima: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idadeMaxima: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    valorMinimo: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    valorMaximo: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    sexo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idParametro: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: 'parametroexame'
            },
            key: 'id'
        }
    },
},
{
  charset: 'utf8',
  collate: 'utf8_general_ci',
  freezeTableName: true,
  tableName: 'referenciaparametroexame'
});

ReferenciaParametroExame.addHook('beforeValidate', (referenciaparametroexame, options) => {
    var data = new Date();
    let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
    var data = data2.toISOString().replace(/\.\d{3}Z$/, '');
    referenciaparametroexame.updatedAt = data;
});

ReferenciaParametroExame.sync({
    force: false
});

module.exports = ReferenciaParametroExame;
