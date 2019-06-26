'use strict';

const SqlString = require('./sql-string');
const _ = require('lodash');

const fileHead = `'use strict';

module.exports = function(sequelize, DataTypes) {
`;

const fileTail = `
  return model;
};
`;

function gt(table, fields, info, config) {
  const { camelCase, sequelizeText } = config;
  const tableName = camelCase ? _.camelCase(table) : table;
  const tableHead = `  const model = ${sequelizeText}.define('${tableName}', {
`;
  const tableTail = `  }, {
    tableName: '${tableName}',
  });`;
  return tableHead + fields + tableTail;
}

function spaces(n) {
  let t = '';
  for (let i = 0; i < n; i++) {
    t += '  ';
  }
  return t;
}

function f2t(table, field, obj, info, config) {
  const { lf, camelCase } = config;
  const fieldName = camelCase ? _.camelCase(field) : field;
  let text = spaces(2) + fieldName + ': {' + lf;

  const { defaultValText, foreignKey, primaryKey, allowNull, typeText, isSerialKey } = obj;

  const isUnique = foreignKey && foreignKey.isUnique;

  text += spaces(3) + 'type: DataTypes.' + typeText + ',' + lf;
  text += spaces(3) + 'allowNull: ' + allowNull + ',' + lf;
  if (defaultValText) {
    text += spaces(3) + 'defaultValue: ' + defaultValText + ',' + lf;
  }
  if (primaryKey && (!foreignKey || (foreignKey && !!foreignKey.isPrimaryKey))) {
    text += spaces(3) + 'primaryKey: true,' + lf;
  }
  if (foreignKey) {
    if (isSerialKey) {
      text += spaces(3) + 'autoIncrement: true,' + lf;
    } else if (foreignKey.isForeignKey) {
      text += spaces(3) + 'references: {' + lf;
      text += spaces(4) + "model: '" + foreignKey.foreignSources.target_table + "'," + lf;
      text += spaces(4) + "key: '" + foreignKey.foreignSources.target_column + "'" + lf;
      text += spaces(3) + '},' + lf;
    }
  }
  if (isUnique) {
    text += spaces(3) + 'unique: true,' + lf;
  }
  if (camelCase) {
    text += spaces(3) + "field: '" + field + "'," + lf;
  }

  text += spaces(2) + '},' + lf;
  return text;
}

function t2t(table, field, { type }) {
  if (type.indexOf('ENUM') === 0) {
    return type;
  }
  const _attr = (type || '').toLowerCase();
  let val = '"' + type + '"';

  if (_attr === 'boolean' || _attr === 'bit(1)' || _attr === 'bit') {
    val = 'BOOLEAN';
  } else if (_attr.match(/^(smallint|mediumint|tinyint|int)/)) {
    const length = _attr.match(/\(\d+\)/);
    val = 'INTEGER' + (!_.isNull(length) ? length : '');

    const unsigned = _attr.match(/unsigned/i);
    if (unsigned) val += '.UNSIGNED';

    const zero = _attr.match(/zerofill/i);
    if (zero) val += '.ZEROFILL';
  } else if (_attr.match(/^bigint/)) {
    val = 'BIGINT';
  } else if (_attr.match(/^varchar/)) {
    const length = _attr.match(/\(\d+\)/);
    val = 'STRING' + (!_.isNull(length) ? length : '');
  } else if (_attr.match(/^string|varying|nvarchar/)) {
    val = 'STRING';
  } else if (_attr.match(/^char/)) {
    const length = _attr.match(/\(\d+\)/);
    val = 'CHAR' + (!_.isNull(length) ? length : '');
  } else if (_attr.match(/^real/)) {
    val = 'REAL';
  } else if (_attr.match(/text|ntext$/)) {
    val = 'TEXT';
  } else if (_attr === 'date') {
    val = 'DATEONLY';
  } else if (_attr.match(/^(date|timestamp)/)) {
    val = 'DATE';
  } else if (_attr.match(/^(time)/)) {
    val = 'TIME';
  } else if (_attr.match(/^(float|float4)/)) {
    val = 'FLOAT';
  } else if (_attr.match(/^decimal/)) {
    val = 'DECIMAL';
  } else if (_attr.match(/^(float8|double precision|numeric)/)) {
    val = 'DOUBLE';
  } else if (_attr.match(/^uuid|uniqueidentifier/)) {
    val = 'UUIDV4';
  } else if (_attr.match(/^jsonb/)) {
    val = 'JSONB';
  } else if (_attr.match(/^json/)) {
    val = 'JSON';
  } else if (_attr.match(/^geometry/)) {
    val = 'GEOMETRY';
  }
  return val;
}

function v2t(table, field, { isSerialKey, type, defaultValue }, { dialect }, { sequelizeText }) {
  let defaultVal = defaultValue;

  if (dialect === 'mssql' && defaultVal && defaultVal.toLowerCase() === '(newid())') {
    defaultVal = null; // disable adding "default value" attribute for UUID fields if generating for MS SQL
  }

  let val_text = defaultVal;

  if (isSerialKey) return null;

  // mySql Bit fix
  if (type.toLowerCase() === 'bit(1)') val_text = (defaultVal === "b'1'") ? 1 : 0;

  // mssql bit fix
  else if (dialect === 'mssql' && type.toLowerCase() === 'bit') {
    val_text = (defaultVal === '((1))') ? 1 : 0;
  }

  if (_.isString(defaultVal)) {
    const field_type = type.toLowerCase();
    if (_.endsWith(defaultVal, '()')) {
      val_text = sequelizeText + ".fn('" + defaultVal.replace(/\(\)$/, '') + "')";
    } else if (field_type.indexOf('date') === 0 || field_type.indexOf('timestamp') === 0) {
      if (_.includes([ 'current_timestamp', 'current_date', 'current_time', 'localtime', 'localtimestamp' ], defaultVal.toLowerCase())) {
        val_text = sequelizeText + ".literal('" + defaultVal + "')";
      } else {
        val_text = '"' + val_text + '"';
      }
    } else {
      val_text = '"' + val_text + '"';
    }
  }

  if (defaultVal === null || defaultVal === undefined) {
    return null;
  }
  val_text = _.isString(val_text) && !val_text.match(new RegExp('^' + sequelizeText + '\\.[^(]+\\(.*\\)$')) ? SqlString.escape(_.trim(val_text, '"'), null, dialect) : val_text;

  // don't prepend N for MSSQL when building models...
  val_text = _.trimStart(val_text, 'N');

  return val_text;
}

module.exports = {
  dir: './models',
  gt,
  t2t,
  f2t,
  v2t,
  flagBegin: '  // -------- begin sequelize-mg replace --------',
  flagEnd: '  // -------- end sequelize-mg replace --------',
  lf: '\n',
  sequelizeText: 'sequelize',
  fileHead,
  fileTail,
  fileOptions: 'utf8',
  rewrite: false,
};
