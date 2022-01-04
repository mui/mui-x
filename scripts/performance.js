/* eslint-disable no-await-in-loop */
const yargs = require('yargs');
const playwright = require('playwright');
const capitalize = require('lodash/capitalize');
const path = require('path');
const fse = require('fs-extra');

const PORT = 5001;

const workspaceRoot = path.join(__dirname, '../');
const snapshotDestPath = path.join(workspaceRoot, 'performance-snapshot.json');

let browser;

function getMedian(values) {
  const length = values.length;
  values.sort();
  if (length % 2 === 0) {
    return (values[length / 2] + values[length / 2 - 1]) / 2;
  }
  return values[parseInt(length / 2, 10)];
}

function getMean(values) {
  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

function getMeasures(samples) {
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const median = getMedian(samples);
  const mean = getMean(samples);
  return { min, max, median, mean };
}

function createLabelNameEngine() {
  const getControlOfLabel = (label, root) => {
    const htmlFor = label.getAttribute('for');
    return root.getElementById(htmlFor);
  };

  return {
    query(root, selector) {
      const label = Array.from(root.querySelectorAll('label')).find(
        (el) => el.innerText.trim() === selector,
      );
      return getControlOfLabel(label, root);
    },
    queryAll(root, selector) {
      const labels = Array.from(root.querySelectorAll('label')).filter(
        (el) => el.innerText.trim() === selector,
      );
      return labels.map((label) => getControlOfLabel(label, root));
    },
  };
}

async function testFilter100000Rows(page) {
  const baseUrl = `http://localhost:${PORT}/performance/DataGrid/FilterRows100000`;
  await page.goto(baseUrl);

  await page.selectOption('label=Columns', 'currencyPair');
  await page.selectOption('label=Operators >> nth=1', 'startsWith');
  const t0 = await page.evaluate(() => performance.now());
  await page.type('label=Value', 'usd');

  // Ensure that the filter icon is not in the DOM.
  await page.waitForSelector('.MuiDataGrid-filterIcon', { state: 'detached' });

  // We use "attached", instead of the default "visible", because the icon is in the DOM but hidden.
  await page.waitForSelector('.MuiDataGrid-filterIcon', { state: 'attached' });
  const t1 = await page.evaluate(() => performance.now());

  return t1 - t0 - 500; // Subtract the debounce time
}

async function testSort100000Rows(page) {
  const baseUrl = `http://localhost:${PORT}/performance/DataGrid/SortRows100000`;
  await page.goto(baseUrl);

  const t0 = await page.evaluate(() => performance.now());
  await page.click('text="Currency Pair"');
  const t1 = await page.evaluate(() => performance.now());
  return t1 - t0;
}

async function testSelect100000Rows(page) {
  const baseUrl = `http://localhost:${PORT}/performance/DataGrid/SelectRows100000`;
  await page.goto(baseUrl);

  const t0 = await page.evaluate(() => performance.now());
  await page.click('[aria-label="Select All Rows checkbox"]');
  const t1 = await page.evaluate(() => performance.now());
  return t1 - t0;
}

async function testDeselect100000Rows(page) {
  const baseUrl = `http://localhost:${PORT}/performance/DataGrid/SelectRows100000`;
  await page.goto(baseUrl);

  await page.click('[aria-label="Select All Rows checkbox"]');
  const t0 = await page.evaluate(() => performance.now());
  await page.click('[aria-label="Select All Rows checkbox"]');
  const t1 = await page.evaluate(() => performance.now());
  return t1 - t0;
}

async function run() {
  await playwright.selectors.register('label', createLabelNameEngine);

  browser = await playwright.chromium.launch({
    args: ['--font-render-hinting=none'],
    headless: false,
  });

  const cases = [
    testFilter100000Rows,
    testSort100000Rows,
    testSelect100000Rows,
    testDeselect100000Rows,
  ];

  const results = cases.map(async (testCase) => {
    const samples = [];

    for (let j = 0; j < 4; j += 1) {
      const page = await browser.newPage();
      const time = await testCase(page);
      await page.close();
      samples.push(time);
    }

    const name = capitalize(
      testCase.name
        .replace(/([A-Z]|[0-9]+)/g, ' $1')
        .replace(/^test/, '')
        .trim(),
    );

    return [name, getMeasures(samples)];
  });

  const allResults = await Promise.all(results);

  const snapshot = allResults.reduce((acc, [name, values]) => {
    acc[name] = values;
    return acc;
  }, {});

  await browser.close();

  await fse.writeJSON(snapshotDestPath, snapshot, { spaces: 2 });
}

yargs
  .command({
    command: '$0',
    description: 'Runs the performance tests.',
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
