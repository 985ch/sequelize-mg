'use strict';

const AutoSequelize = require('sequelize-auto');
const sequelizeGen = require('./');
const _ = require('lodash');

const auto = new AutoSequelize('database', 'yourname', 'yourpass', {
  dialect: 'mysql',
  directory: false, // we don't use sequelize-auto to generate model files
  tables: [ 'users' ],
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});
auto.run(err => {
  if (err) throw err;

  for (const tableName in auto.tables) {
    for (const fieldName in auto.tables[tableName]) {
      const field = auto.tables[tableName][fieldName];
      field.isSerialKey = field.foreignKey && _.isFunction(auto.dialect.isSerialKey) && auto.dialect.isSerialKey(field.foreignKey);
    }
  }

  sequelizeGen(auto.tables, { dialect: 'mysql' });
});
