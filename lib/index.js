'use strict';

const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const defaultConfig = require('./default');

async function generate(tables, info, config) {
  const state = { ignore: 0, update: 0, create: 0 };
  for (const key in tables) {
    const flag = await generateTable(key, tables[key], info, config);
    state[flag]++;
  }
  return state;
}

async function generateTable(name, table, info, config) {
  config = _.extend({}, defaultConfig, config || {});
  let {
    dir, gfn,
    gt, t2t, f2t, v2t,
    lf, flagBegin, flagEnd, fileHead, fileTail,
    fileOptions, rewrite,
  } = config;

  // generate text
  let columns = '';
  for (const field in table) {
    const t = table[field];
    t.typeText = t2t(name, field, table[field], info, config);
    t.defaultValText = v2t(name, field, table[field], info, config);
    columns += f2t(name, field, table[field], info, config);
  }
  let text = flagBegin + lf + gt(name, columns, info, config) + lf + flagEnd;

  // replace or create file
  let flag = 'create';
  fs.ensureDirSync(dir);
  const filename = path.join(dir, gfn(name) + '.js');
  if (!rewrite && fs.existsSync(filename)) {
    const rawText = fs.readFileSync(filename, fileOptions);
    const start = rawText.indexOf(flagBegin);
    fileHead = rawText.substring(0, start);

    if (start >= 0) {
      const end = rawText.indexOf(flagEnd, start + flagBegin.length);
      if (end >= start) {
        fileTail = rawText.substring(end + flagEnd.length);
      }
      if (text === rawText.substring(start, end + flagEnd.length)) {
        // console.log(`ignore model file "${filename}"`);
        return 'ignore';
      }
    }
    console.log(`update model file "${filename}"`);
    flag = 'update';
  } else {
    text += lf;
    console.log(`create model file "${filename}"`);
  }
  fs.writeFileSync(filename, fileHead + text + fileTail, fileOptions);
  return flag;
}

module.exports = generate;
