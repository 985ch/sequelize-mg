'use strict';

const AutoSequelize = require('sequelize-auto');
const sequelizeGen = require('./');

const auto = new AutoSequelize('database', 'yourname', 'yourpass', {
  dialect: 'mysql',
  directory: false, // we don't use sequelize-auto to generate model files
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});
auto.run().then(data => {
  const tables = {};
  for (const tableName in data.tables) {
    const table = data.tables[tableName];
    for (const fieldName in table) {
      const field = table[fieldName];
      field.isSerialKey = field.foreignKey;
    }
    tables[tableName] = { columns: table, comment: 'sample' };
  }

  sequelizeGen(tables, { dialect: 'mysql' });
});
