#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const program = require('commander');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

program
  .arguments('<dataset>')
  .option('-s, --size <size>', 'The number of rows to generate', '100')
  .option('-o, --out <output>', 'The output file', './output.json')
  .action(async function(dataset) {
    console.log('size: %s dataset: %s', program.size, dataset);
    const data = await dataGenerator.getRealData(
      Number(program.size),
      dataset.toLowerCase() === 'commodity'
        ? dataGenerator.commodityColumns
        : dataGenerator.binemployeeColumns,
    );
    fs.writeFile(program.output, JSON.stringify(data, null, 2));
  })
  .parse(process.argv);
