# sequelize-mg
[![node version][node-image]]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/sequelize-mg.svg?style=flat-square
[npm-url]: https://npmjs.org/package/sequelize-mg
[download-image]: https://img.shields.io/npm/dm/sequelize-mg.svg?style=flat-square
[download-url]: https://npmjs.org/package/sequelize-mg

> 这个包提供了根据表对象生成对应的model文件的功能，支持部分更新文件和自定义生成文件格式，部分代码参考了[sequelize-auto](https://github.com/sequelize/sequelize-auto)项目

## 需求

- node &gt;=8

## 安装

```sh
npm i sequelize-mg
```
## 使用方法
以下是使用[sequelize-auto](https://github.com/sequelize/sequelize-auto)创建mysql对应表的例子，请确认./models/目录已经存在并且已经安装对应包
```js
'use strict';

const AutoSequelize = require('sequelize-auto');
const sequelizeGen = require('sequelize-mg');
const _ = require('lodash');

const auto = new AutoSequelize('database', 'yourname', 'yourpass', {
  dialect: 'mysql',
  directory: false, // 我们不需要通过sequelize-auto来生成模型文件，因此这里设为false
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
你也可以通过其他方式来获得tables，并且用你自己定义的info来生成模型文件
```js
const sequelizeGen = require('sequelize-mg');

const { tables, info, config} = yourDatabaseReader(params);
sequelizeGen(auto.tables, info, config); // 注意：默认的v2t函数要求info.dialect必须存在并且是一个字符串
```
## Config
| 名字 | 格式 | 描述 |
|:----|:-----|:-----|
| dir | string | 生成的文件存入哪个目录，目录必须存在，默认值是'./models' |
| gt | (table, fields, info, config)=>'' | GenerateTable，生成可替换区域的文本，其中fields是已经处理好的文本 |
| f2t | (table, field, obj, info, config)=>'' | FieldToText，生成表的列信息文本并返回，所有列文本加起来得到fields |
| t2t | (table, field, obj, info, config)=>'' | TypeToText，生成类型文本并返回，返回结果存储到obj.typeText |
| v2t | (table, field, obj, info, config)=>'' | defaultValueToText，生成默认值文本并返回，返回结果储存到obj.defaultValText |
| flagBegin | string | 用于标记可替换区域的起点 |
| flagEnd | string | 用于标记可替换区域的终点，在更新模型文件的时候，只有起点和终点之间的部分会被替换掉 |
| lf | string | 换行标记，默认为'\n' |
| sequelizeText | string | sequelize对象对应的文本，**可替换区域**的sequelize对象都会用这个文本替换掉 |
| fileHead | string | 文件头，可替换区域前面的部分，仅在生成新的模型文件时生效 |
| fileTail | string | 文件尾，可替换区域后面的部分，尽在生成新的模型文件时生效 |
| fileOptions | any | 读写文件时的options，默认为'utf8' |
| rewrite | boolean | 在模型文件已经存在的时候，是否重新生成整个文件，默认是false |
## 执行测试脚本

```sh
npm i sequelize-auto
npm i mysql
npm run test
```

## 作者

 **985ch**

* Github: [@985ch](https://github.com/985ch)

## License

Copyright © 2019 [985ch](https://github.com/985ch).<br />
This project is [MIT](https://github.com/985ch/sequelize-mg/blob/master/LICENSE) licensed.