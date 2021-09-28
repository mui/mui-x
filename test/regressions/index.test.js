import * as fse from 'fs-extra';
import { expect } from 'chai';
import * as path from 'path';
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
  // If we still get flaky fonts after awaiting this try `document.fonts.ready`
  await page.waitForSelector('[data-webfontloader="active"]', { state: 'attached' });

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

        let testcase;
        if (pathURL === '/stories-grid-toolbar/PrintExportSnap') {
          // Capture the content of the print dialog. Because there is no easy way to navigate the.
          // print window/dialog with playwrite a hacky aproach is needed.
          this.timeout(6000);
          let printGrid;
          // Click the export button in the toolbar.
          await page.$eval(`button[aria-label="Export"]`, (exportButton) => {
            exportButton.click();
          });
          // Click the print export option from the export menu in the toolbar.
          await page.$eval(`li[role="menuitem"]:last-child`, (printButton) => {
            printButton.click();
          });
          // Delay the main thread with some time to alow the iframe content to be loaded.
          await sleep(2000);
          // Grab the content of the print iframe.
          await page.$eval(`#grid-print-window`, (printWindow) => {
            printGrid = printWindow.contentWindow.document.querySelector('[role="grid"]');
          });
          // Append the content of the print iframe to a element in the page.
          await page.$eval(`#grid-print-container`, (printContainer) => {
            printContainer.appendChild(printGrid);
          });
          // Because there is now other way of closing the iframe, set the src back to ''.
          // This will close the print dialog/window. If not done the test will timeout.
          await page.$eval(`#grid-print-window`, (printWindow) => {
            printWindow.src = '';
          });

          // Select the element from the page that has the print iframe contant and
          // make the screenshot.
          testcase = await page.waitForSelector('#grid-print-container');
          await testcase.screenshot({ path: screenshotPath, type: 'png' });
        } else {
          testcase = await page.waitForSelector('[data-testid="testcase"]:not([aria-busy="true"])');
          await testcase.screenshot({ path: screenshotPath, type: 'png' });
        }
      });

      it(`should have no errors rendering ${pathURL}`, () => {
        const msg = errorConsole;
        errorConsole = undefined;
        expect(msg).to.equal(undefined);
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
