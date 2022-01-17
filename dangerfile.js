const { markdown } = require('danger');
const fse = require('fs-extra');
const path = require('path');
const prettier = require('prettier');

const dangerCommand = process.env.DANGER_COMMAND;

async function reportBundleSize() {
  const snapshotPath = path.join(__dirname, './performance-snapshot.json');
  const prettierConfigPath = path.join(__dirname, './prettier.config.js');
  const snapshot = await fse.readJSON(snapshotPath);

  const headers = `
| Test case | Unit | Min | Max | Median | Mean | σ |
| --------- | ---- | --- | --- | ------ | ---- | - |`;

  let text = `These are the results for the performance tests:
${headers}\n`;

  const formatter = new Intl.NumberFormat('en');

  Object.entries(snapshot).forEach(([name, values]) => {
    const min = formatter.format(values.min);
    const max = formatter.format(values.max);
    const mean = formatter.format(values.mean);
    const median = formatter.format(values.median);
    const stdDev = formatter.format(values.stdDev);
    text += `| ${name} | ms | ${min} | ${max} | ${median} | ${mean} | ${stdDev} |\n`;
  });

  const prettierConfig = prettier.resolveConfig.sync(snapshotPath, {
    config: prettierConfigPath,
  });

  markdown(prettier.format(text, { prettierConfig, parser: 'markdown' }));
}

async function run() {
  switch (dangerCommand) {
    case 'reportPerformance':
      await reportBundleSize();
      break;
    default:
      throw new TypeError(`Unrecognized danger command '${dangerCommand}'`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
