'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const defaultConfig = require('./default');

function generate(tables, info, config) {
  (async function() {
    for (const key in tables) {
      await generateTable(key, tables[key], info, config);
    }
  })();
}

async function generateTable(name, table, info, config) {
  config = _.extend(defaultConfig, config || {});
  let {
    dir,
    gt, t2t, f2t, v2t,
    lf, flagBegin, flagEnd, fileHead, fileTail,
    fileOptions, rewrite,
  } = config;
  flagBegin = flagBegin + lf;
  flagEnd = flagEnd + lf;

  // generate text
  let columns = '';
  for (const field in table) {
    const t = table[field];
    t.typeText = t2t(name, field, table[field], info, config);
    t.defaultValText = v2t(name, field, table[field], info, config);
    columns += f2t(name, field, table[field], info, config);
  }
  const text = flagBegin + gt(name, columns, info, config) + lf + flagEnd;

  // replace or create file
  const filename = path.join(dir, name + '.js');
  if (!rewrite && fs.existsSync(filename)) {
    const rawText = fs.readFileSync(filename, fileOptions);
    const start = rawText.indexOf(flagBegin);
    fileHead = rawText.substring(0, start);

    if (start >= 0) {
      const end = rawText.indexOf(flagEnd, start + flagBegin.length);
      if (end >= start) {
        fileTail = rawText.substring(end + flagEnd.length);
      }
    }
    console.log(`update model file "${filename}"`);
  } else {
    console.log(`create model file "${filename}"`);
  }
  fs.writeFileSync(filename, fileHead + text + fileTail, fileOptions);
}

module.exports = generate;
