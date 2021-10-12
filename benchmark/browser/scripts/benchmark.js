/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
const path = require('path');
const playwright = require('playwright');
const handler = require('serve-handler');
const http = require('http');

const PORT = 1122;

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createServer(options) {
  const { port } = options;
  const server = http.createServer((request, response) => {
    return handler(request, response, { public: path.resolve(__dirname, '../dist') });
  });

  function close() {
    return new Promise((resolve, reject) => {
      server.close((error) => {
        if (error !== undefined) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve({ close });
    });
  });
}

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

function getStdDev(values) {
  const mean = getMean(values);

  const squareDiffs = values.map((value) => {
    const diff = value - mean;
    return diff * diff;
  });

  return Math.sqrt(getMean(squareDiffs));
}

const formatter = new Intl.NumberFormat('en');

async function printMeasure(name, samples) {
  const mins = samples.map((result) => result.min);
  const maxs = samples.map((result) => result.max);
  const medians = samples.map((result) => result.median);
  const means = samples.map((result) => result.mean);
  const min = getMean(mins);
  const minStd = getStdDev(mins);
  const max = getMean(maxs);
  const maxStd = getStdDev(maxs);
  const median = getMean(medians);
  const medianStd = getStdDev(medians);
  const mean = getMean(means);
  const meanStd = getStdDev(means);

  console.log(`  ${name}:`);
  console.log(`       Min: ${formatter.format(min)} fps (σ = ${formatter.format(minStd)})`);
  console.log(`       Max: ${formatter.format(max)} fps (σ = ${formatter.format(maxStd)})`);
  console.log(`    Median: ${formatter.format(median)} fps (σ = ${formatter.format(medianStd)})`);
  console.log(`      Mean: ${formatter.format(mean)} fps (σ = ${formatter.format(meanStd)})`);
}

async function simulateScroll(
  page,
  {
    duration = 0, // How long to scroll for [ms]
    deltaX = 0, // How much to scroll horizontally on each tick [px]
    deltaY = 0, // How much to scroll vertically on each tick [px]
    interval = 16, // Tick interval [ms]
    easingCycle = 0, // ease in/out scrolling in cycles of this duration [ms]
  } = {},
) {
  const startTime = Date.now();
  const cycles = easingCycle / interval;
  let i = 0;

  return new Promise((resolve) => {
    const scroll = async () => {
      if (Date.now() < startTime + duration) {
        const fraction = cycles ? (Math.sin((2 * i * Math.PI) / cycles - Math.PI / 2) + 1) / 2 : 1;
        i += 1;
        await Promise.race([
          page.mouse.wheel(fraction * deltaX, fraction * deltaY),
          delay(interval),
        ]);
        scroll();
      } else {
        resolve();
      }
    };
    scroll();
  });
}

// Inspired by
// https://github.com/Janpot/mui-plus/blob/master/scripts/benchmark.ts
async function runFPSMeasure(browser, testCaseName, testCase, setupTest) {
  const samples = [];

  for (let i = 0; i < 4; i += 1) {
    const baseUrl = `http://localhost:${PORT}/?${testCase}`;
    const page = await browser.newPage();
    await page.goto(baseUrl);
    await delay(1000);

    const devtools = await page.context().newCDPSession(page);
    await devtools.send('Overlay.setShowFPSCounter', { show: true });

    page.evaluate(() => {
      window.__fps = [];
      let lastFrameTime;
      const loop = (frameTime) => {
        if (typeof lastFrameTime === 'number') {
          const fps = 1 / ((window.performance.now() - lastFrameTime) / 1000);
          window.__fps.push(fps);
        }
        lastFrameTime = frameTime;
        window.requestAnimationFrame(loop);
      };
      window.requestAnimationFrame(loop);
    });

    if (typeof setupTest === 'function') {
      await setupTest(page);
    }

    const fps = await page.evaluate(() => window.__fps);
    await page.close();

    samples.push({
      min: Math.min(...fps),
      max: Math.max(...fps),
      median: getMedian(fps),
      mean: getMean(fps),
    });
  }

  printMeasure(testCaseName, samples);
}

async function main() {
  const server = await createServer({ port: PORT });
  const browser = await playwright.chromium.launch({
    args: ['--font-render-hinting=none'],
    headless: false,
  });

  const cases = [
    { name: 'React Virtualized', path: './react-virtualized/index.js' },
    { name: 'AG Grid', path: './ag-grid/index.js' },
    { name: 'MUI+', path: './mui-plus/index.js' },
    { name: 'DataGridPro', path: './data-grid-pro/index.js' },
  ];

  for (let i = 0; i < cases.length; i += 1) {
    console.log(`${cases[i].name}:`);

    await runFPSMeasure(browser, 'Vertical scroll', cases[i].path, async (page) => {
      await page.mouse.move(200, 200);
      await simulateScroll(page, { duration: 5000, deltaY: 100 });
    });

    await runFPSMeasure(browser, 'Horizontal scroll', cases[i].path, async (page) => {
      await page.mouse.move(200, 200);
      await simulateScroll(page, { duration: 5000, deltaX: 100 });
    });
  }

  await browser.close();
  await server.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
