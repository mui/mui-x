import * as fse from 'fs-extra';
import { expect } from 'chai';
import * as path from 'path';
import * as childProcess from 'child_process';
import * as playwright from 'playwright';

function sleep(timeoutMS) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeoutMS);
  });
}

async function main() {
  const baseUrl = 'http://localhost:5001';
  const screenshotDir = path.resolve(__dirname, './screenshots/chrome');

  const browser = await playwright.chromium.launch({
    args: ['--font-render-hinting=none'],
    // otherwise the loaded google Roboto font isn't applied
    headless: false,
  });
  // reuse viewport from `vrtest`
  // https://github.com/nathanmarks/vrtest/blob/1185b852a6c1813cedf5d81f6d6843d9a241c1ce/src/server/runner.js#L44
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });

  // Block images since they slow down tests (need download).
  // They're also most likely decorative for documentation demos
  await page.route(/./, async (route, request) => {
    const type = await request.resourceType();
    if (type === 'image') {
      route.abort();
    } else {
      route.continue();
    }
  });

  let errorConsole;

  page.on('console', (msg) => {
    // Filter out native user-agent errors e.g. "Failed to load resource: net::ERR_FAILED"
    if (msg.args().length > 0 && (msg.type() === 'error' || msg.type() === 'warning')) {
      errorConsole = msg.text();
    }
  });

  // Wait for all requests to finish.
  // This should load shared ressources such as fonts.
  await page.goto(`${baseUrl}#no-dev`, { waitUntil: 'networkidle0' });

  // Simulate portrait mode for date pickers.
  // See `useIsLandscape`.
  await page.evaluate(() => {
    Object.defineProperty(window.screen.orientation, 'angle', {
      get() {
        return 0;
      },
    });
  });

  const routes = await page.$$eval('#tests a', (links) => {
    return links.map((link) => {
      return link.href;
    });
  });

  // prepare screenshots
  await fse.emptyDir(screenshotDir);

  describe('visual regressions', () => {
    after(async () => {
      await browser.close();
    });

    it('should have no errors after the initial render', () => {
      const msg = errorConsole;
      errorConsole = undefined;
      expect(msg).to.equal(undefined);
    });

    routes.forEach((route, index) => {
      const pathURL = route.replace(baseUrl, '');

      it(`creates screenshots of ${pathURL}`, async function test() {
        // With the playwright inspector we might want to call `page.pause` which would lead to a timeout.
        if (process.env.PWDEBUG) {
          this.timeout(0);
        }

        if (pathURL === '/docs-components-data-grid-overview/DataGridProDemo') {
          this.timeout(6000);
        }

        // Use client-side routing which is much faster than full page navigation via page.goto().
        // Could become an issue with test isolation.
        // If tests are flaky due to global pollution switch to page.goto(route);
        // puppeteers built-in click() times out
        await page.$eval(`#tests li:nth-of-type(${index + 1}) a`, (link) => {
          link.click();
        });
        // Move cursor offscreen to not trigger unwanted hover effects.
        page.mouse.move(0, 0);

        const screenshotPath = path.resolve(screenshotDir, `${route.replace(baseUrl, '.')}.png`);
        await fse.ensureDir(path.dirname(screenshotPath));

        const testcase = await page.waitForSelector(
          '[data-testid="testcase"]:not([aria-busy="true"])',
        );

        await testcase.screenshot({ path: screenshotPath, type: 'png' });
      });

      it(`should have no errors rendering ${pathURL}`, () => {
        const msg = errorConsole;
        errorConsole = undefined;
        expect(msg).to.equal(undefined);
      });
    });

    it('should position the headers matching the columns', async function test() {
      const route = `${baseUrl}/docs-components-data-grid-virtualization/ColumnVirtualizationGrid`;
      const screenshotPath = path.resolve(
        screenshotDir,
        `${route.replace(baseUrl, '.')}ScrollLeft400px.png`,
      );
      await fse.ensureDir(path.dirname(screenshotPath));

      const testcaseIndex = routes.indexOf(route);
      await page.$eval(`#tests li:nth-of-type(${testcaseIndex + 1}) a`, (link) => {
        link.click();
      });

      const testcase = await page.waitForSelector(
        '[data-testid="testcase"]:not([aria-busy="true"])',
      );

      await page.evaluate(() => {
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
        virtualScroller.scrollLeft = 400;
        virtualScroller.dispatchEvent(new Event('scroll'));
      });

      await testcase.screenshot({ path: screenshotPath, type: 'png' });
    });

    it('should take a screenshot of the print preview', async function test() {
      this.timeout(10000);

      const route = `${baseUrl}/stories-grid-toolbar/PrintExportSnap`;
      const screenshotPath = path.resolve(screenshotDir, `${route.replace(baseUrl, '.')}Print.png`);
      await fse.ensureDir(path.dirname(screenshotPath));

      const testcaseIndex = routes.indexOf(route);
      await page.$eval(`#tests li:nth-of-type(${testcaseIndex + 1}) a`, (link) => {
        link.click();
      });

      // Click the export button in the toolbar.
      await page.$eval(`button[aria-label="Export"]`, (exportButton) => {
        exportButton.click();
      });

      // Click the print export option from the export menu in the toolbar.
      await page.$eval(`li[role="menuitem"]:last-child`, (printButton) => {
        printButton.click();
      });

      await sleep(2000);

      return new Promise((resolve, reject) => {
        // See https://ffmpeg.org/ffmpeg-devices.html#x11grab
        const args = `-y -f x11grab -framerate 1 -video_size 460x400 -i :99.0+90,81 -vframes 1 ${screenshotPath}`;
        const ffmpeg = childProcess.spawn('ffmpeg', args.split(' '));

        ffmpeg.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject();
          }
        });
      });
    });
  });

  run();
}

main().catch((error) => {
  // error during setup.
  // Throwing lets mocha hang.
  console.error(error);
  process.exit(1);
});
