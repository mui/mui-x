import * as fse from 'fs-extra';
import { expect } from 'chai';
import * as path from 'path';
import * as childProcess from 'child_process';
import { chromium } from '@playwright/test';
import materialPackageJson from '@mui/material/package.json';

function sleep(timeoutMS: number | undefined) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutMS);
  });
}

const isMaterialUIv6 = materialPackageJson.version.startsWith('6.');

// Tests that need a longer timeout.
const timeSensitiveSuites = [
  'ColumnAutosizingAsync',
  'DensitySelectorGrid',
  'DataGridOverlays',
  'PopularFeaturesDemo',
  'ServerSideRowGroupingGroupExpansion',
];

const isConsoleWarningIgnored = (msg?: string) => {
  const isMuiV6Error =
    isMaterialUIv6 &&
    msg?.startsWith(
      'MUI: The Experimental_CssVarsProvider component has been ported into ThemeProvider.',
    );

  const isReactRouterFlagsError = msg?.includes('React Router Future Flag Warning');

  if (isMuiV6Error || isReactRouterFlagsError) {
    return true;
  }
  return false;
};

async function main() {
  const baseUrl = 'http://localhost:5001';
  const screenshotDir = path.resolve(__dirname, './screenshots/chrome');

  const browser = await chromium.launch({
    args: [
      // We could add the hide-scrollbars flag, which should improve argos
      // flaky tests based on the scrollbars.
      // '--hide-scrollbars',
    ],
    headless: false,
  });
  // reuse viewport from `vrtest`
  // https://github.com/nathanmarks/vrtest/blob/1185b852a6c1813cedf5d81f6d6843d9a241c1ce/src/server/runner.js#L44
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });

  // Block images since they slow down tests (need download).
  // They're also most likely decorative for documentation demos
  await page.route(/./, async (route, request) => {
    const type = await request.resourceType();
    // Block all images except the flags
    if (type === 'image' && !request.url().startsWith('https://flagcdn.com')) {
      route.abort();
    } else {
      route.continue();
    }
  });

  let errorConsole: string | undefined;

  page.on('console', (msg) => {
    // Filter out native user-agent errors e.g. "Failed to load resource: net::ERR_FAILED"
    if (msg.args().length > 0 && (msg.type() === 'error' || msg.type() === 'warning')) {
      errorConsole = msg.text();
    }
  });

  // Wait for all requests to finish.
  // This should load shared resources such as fonts.
  await page.goto(`${baseUrl}#no-dev`, { waitUntil: 'networkidle' });

  // Simulate portrait mode for date pickers.
  // See `usePickerOrientation`.
  await page.evaluate(() => {
    Object.defineProperty(window.screen.orientation, 'angle', {
      get() {
        return 0;
      },
    });
  });

  const routes = await page.$$eval('#tests a', (links) => {
    return links.map((link) => {
      return (link as HTMLAnchorElement).href;
    });
  });

  // prepare screenshots
  await fse.emptyDir(screenshotDir);

  function navigateToTest(testIndex: number) {
    // Use client-side routing which is much faster than full page navigation via page.goto().
    // Could become an issue with test isolation.
    // If tests are flaky due to global pollution switch to page.goto(route);
    // puppeteers built-in click() times out
    return page.$eval(`#tests li:nth-of-type(${testIndex}) a`, (link) => {
      (link as HTMLAnchorElement).click();
    });
  }

  describe('visual regressions', () => {
    after(async () => {
      await browser.close();
    });

    it('should have no errors after the initial render', () => {
      const msg = errorConsole;
      errorConsole = undefined;
      if (isConsoleWarningIgnored(msg)) {
        return;
      }
      expect(msg).to.equal(undefined);
    });

    routes.forEach((route, index) => {
      const pathURL = route.replace(baseUrl, '');

      it(`creates screenshots of ${pathURL}`, async function test() {
        // Move cursor offscreen to not trigger unwanted hover effects.
        // This needs to be done before the navigation to avoid hover and mouse enter/leave effects.
        await page.mouse.move(0, 0);

        // With the playwright inspector we might want to call `page.pause` which would lead to a timeout.
        if (process.env.PWDEBUG) {
          this.timeout(0);
        }

        if (pathURL === '/docs-components-data-grid-overview/DataGridProDemo') {
          this.timeout(6000);
        }

        try {
          await navigateToTest(index + 1);
        } catch (error) {
          // When one demo crashes, the page becomes empty and there are no links to demos,
          // so navigation to the next demo throws an error.
          // Reloading the page fixes this.
          await page.reload();
          await navigateToTest(index + 1);
        }

        const screenshotPath = path.resolve(screenshotDir, `${route.replace(baseUrl, '.')}.png`);
        await fse.ensureDir(path.dirname(screenshotPath));

        const testcase = await page.waitForSelector(
          '[data-testid="testcase"]:not([aria-busy="true"])',
        );

        // Wait for the flags to load
        await page.waitForFunction(
          () => {
            const images = Array.from(document.querySelectorAll('img'));
            return images.every((img) => {
              if (!img.complete && img.loading === 'lazy') {
                // Force lazy-loaded images to load
                img.setAttribute('loading', 'eager');
              }
              return img.complete;
            });
          },
          undefined,
          { timeout: 1000 },
        );

        if (/^\docs-charts-.*/.test(pathURL)) {
          // Run one tick of the clock to get the final animation state
          await sleep(10);
        }

        if (timeSensitiveSuites.some((suite) => pathURL.includes(suite))) {
          await sleep(100);
        }

        // Wait for the page to settle after taking the screenshot.
        await page.waitForLoadState();

        await testcase.screenshot({ path: screenshotPath, type: 'png' });
      });

      it(`should have no errors rendering ${pathURL}`, () => {
        const msg = errorConsole;
        errorConsole = undefined;
        if (isConsoleWarningIgnored(msg)) {
          return;
        }
        expect(msg).to.equal(undefined);
      });
    });

    it('should position the headers matching the columns', async () => {
      const route = `${baseUrl}/docs-data-grid-virtualization/ColumnVirtualizationGrid`;
      const screenshotPath = path.resolve(
        screenshotDir,
        `${route.replace(baseUrl, '.')}ScrollLeft400px.png`,
      );
      await fse.ensureDir(path.dirname(screenshotPath));

      const testcaseIndex = routes.indexOf(route);
      await page.$eval(`#tests li:nth-of-type(${testcaseIndex + 1}) a`, (link) => {
        (link as HTMLAnchorElement).click();
      });

      const testcase = await page.waitForSelector(
        '[data-testid="testcase"]:not([aria-busy="true"])',
      );

      await page.evaluate(() => {
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');

        if (!virtualScroller) {
          throw new Error('missing virtualScroller');
        }

        virtualScroller.scrollLeft = 400;
        virtualScroller.dispatchEvent(new Event('scroll'));
      });

      await testcase.screenshot({ path: screenshotPath, type: 'png' });
    });

    it('should take a screenshot of the print preview', async function test() {
      this.timeout(20000);

      const route = `${baseUrl}/docs-data-grid-export/ExportDefaultToolbar`;
      const screenshotPath = path.resolve(screenshotDir, `${route.replace(baseUrl, '.')}Print.png`);
      await fse.ensureDir(path.dirname(screenshotPath));

      const testcaseIndex = routes.indexOf(route);
      await page.$eval(`#tests li:nth-of-type(${testcaseIndex + 1}) a`, (link) => {
        (link as HTMLAnchorElement).click();
      });

      // Click the export button in the toolbar.
      await page.$eval(`button[aria-label="Export"]`, (exportButton) => {
        (exportButton as HTMLAnchorElement).click();
      });

      // Click the print export option from the export menu in the toolbar.
      await page.$eval(`li[role="menuitem"]:last-child`, (printButton) => {
        // Trigger the action async because window.print() is blocking the main thread
        // like window.alert() is.
        setTimeout(() => {
          (printButton as HTMLAnchorElement).click();
        });
      });

      await sleep(4000);

      return new Promise((resolve, reject) => {
        // See https://ffmpeg.org/ffmpeg-devices.html#x11grab
        const args = `-y -f x11grab -framerate 1 -video_size 460x400 -i :99.0+90,95 -vframes 1 ${screenshotPath}`;
        const ffmpeg = childProcess.spawn('ffmpeg', args.split(' '));

        ffmpeg.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(code);
          }
        });
      });
    });

    // describe('DateTimePicker', () => {
    //   it('should handle change in pointer correctly', async () => {
    //     const index = routes.findIndex(
    //         (route) => route === '/regression-pickers/UncontrolledDateTimePicker',
    //     );
    //     const testcase = await renderFixture(index);
    //
    //     await page.click('[aria-label="Choose date"]');
    //     await page.click('[aria-label*="switch to year view"]');
    //     await takeScreenshot({
    //       testcase: await page.waitForSelector('[role="dialog"]'),
    //       route: '/regression-pickers/UncontrolledDateTimePicker-desktop',
    //     });
    //     await page.evaluate(() => {
    //       window.muiTogglePickerMode();
    //     });
    //     await takeScreenshot({
    //       testcase,
    //       route: '/regression-pickers/UncontrolledDateTimePicker-mobile',
    //     });
    //   });
    // });
  });

  run();
}

main().catch((error) => {
  // error during setup.
  // Throwing lets mocha hang.
  console.error(error);
  process.exit(1);
});
