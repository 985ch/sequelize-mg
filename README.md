# sequelize-mg
![node version][node-image]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/sequelize-mg.svg?style=flat-square
[npm-url]: https://npmjs.org/package/sequelize-mg
[download-image]: https://img.shields.io/npm/dm/sequelize-mg.svg?style=flat-square
[download-url]: https://npmjs.org/package/sequelize-mg

> This package provides the function of generating the sequelize model file according to the table, supports partial update files and custom generated file formats, and some codes refer to [sequelize-auto](https://github.com/sequelize/sequelize-auto).

### [中文说明](./README.zh_CN.md)
## Prerequisites

- node &gt;=8

## Install

```sh
npm i sequelize-mg
```
## Usage
The following is an example of creating a mysql correspondence table using [sequelize-auto](https://github.com/sequelize/sequelize-auto). Please confirm that the ./models/ directory already exists and the corresponding package has been installed.
```js
'use strict';

const AutoSequelize = require('sequelize-auto');
const sequelizeGen = require('sequelize-mg');
const _ = require('lodash');

const auto = new AutoSequelize('database', 'yourname', 'yourpass', {
  dialect: 'mysql',
  directory: false, // we don't need to generate the model file via sequelize-auto, so set it to false here.
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
```
You can also get tables in other ways, and generate your own model files with your own defined info like this.
```js
const sequelizeGen = require('sequelize-mg');

const { tables, info, config} = yourDatabaseReader(params);
sequelizeGen(tables, info, config); // Note: The default v2t function requires info.dialect to be present and is a string
```
## Config
| name | format | description |
|:-----|:-------|:------------|
| dir | string | Specify the storage path of the model file. The default value is './models'. |
| gfn | (table)=>'' | GenerateFileName，Generate a file name based on the table name. By default, the table name is the file name. |
| gt | (table, fields, info, config)=>'' | GenerateTable，Generate text for the replaceable area, where fields are already processed text |
| f2t | (table, field, obj, info, config)=>'' | FieldToText，Generate field text for the table |
| t2t | (table, field, obj, info, config)=>'' | TypeToText，Generate type text and return, the result is stored to obj.typeText |
| v2t | (table, field, obj, info, config)=>'' | defaultValueToText，Generate defaultValue text and return, return the result to obj.defaultValText |
| flagBegin | string | The starting point for marking the replaceable area |
| flagEnd | string | Used to mark the end point of the replaceable area. When updating the model file, only the part between the start point and the end point will be replaced. |
| lf | string | Newline, default is '\n' |
| sequelizeText | string | The corresponding text of the sequelize object, only for replaceable areas |
| fileHead | string | File header, the part before the replaceable area, only valid when creating a new model file |
| fileTail | string | End of file, the part after the replaceable area, only valid when creating a new model file |
| fileOptions | any | Options when reading and writing files, defaults to 'utf8' |
| rewrite | boolean | Force the entire file to be regenerated, the default is false |

## Default configuration
The external incoming configuration will be merged with the default configuration, you can view the default configuration in [here] (./lib/default)
## Run tests

```sh
npm i sequelize-auto
npm i mysql
npm run test
```

## Author

 **985ch**

* Github: [@985ch](https://github.com/985ch)

## License

Copyright © 2019 [985ch](https://github.com/985ch).<br />
This project is [MIT](https://github.com/985ch/sequelize-mg/blob/master/LICENSE) licensed.<br />
This README was translate by [google](https://translate.google.cn)

