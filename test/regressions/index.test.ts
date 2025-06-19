import * as fse from 'fs-extra';
import * as path from 'path';
import * as childProcess from 'child_process';
import { type Browser, chromium } from '@playwright/test';
import { major } from '@mui/material/version';

const isMaterialUIv6 = major === 6;
const isMaterialUIv7 = major === 7;

// Tests that need a longer timeout.
const timeSensitiveSuites = [
  'ColumnAutosizingAsync',
  'DensitySelectorGrid',
  'DataGridOverlays',
  'GridToolbarFilterBar',
  'ColumnSpanningDerived',
  'PopularFeaturesDemo',
  'ServerSideRowGroupingGroupExpansion',
  'RowSpanningClassSchedule',
  'ListView',
  'RowSpanningCalendar',
];

await main();

async function main() {
  const baseUrl = 'http://localhost:5001';
  const screenshotDir = path.resolve(import.meta.dirname, './screenshots/chrome');

  const browser = await chromium.launch({
    args: [
      // We could add the hide-scrollbars flag, which should improve argos
      // flaky tests based on the scrollbars.
      // '--hide-scrollbars',
    ],
    headless: false,
  });

  let page = await newTestPage(browser);

  let errorConsole: string | undefined;

  page.on('console', (msg) => {
    // Filter out native user-agent errors e.g. "Failed to load resource: net::ERR_FAILED"
    if (msg.args().length > 0 && (msg.type() === 'error' || msg.type() === 'warning')) {
      errorConsole = msg.text();
    }
  });

  // Wait for all requests to finish.
  // This should load shared resources such as fonts.
  await page.goto(`${baseUrl}#dev`, { waitUntil: 'networkidle' });

  // Simulate portrait mode for date pickers.
  // See `usePickerOrientation`.
  await page.evaluate(() => {
    Object.defineProperty(window.screen.orientation, 'angle', {
      get() {
        return 0;
      },
    });
  });

  let routes = await page.$$eval('#tests a', (links) => {
    return links.map((link) => {
      return (link as HTMLAnchorElement).href;
    });
  });
  routes = routes.map((route) => route.replace(baseUrl, ''));

  // prepare screenshots
  await fse.emptyDir(screenshotDir);

  async function navigateToTest(route: string) {
    // Use client-side routing which is much faster than full page navigation via page.goto().
    await page.waitForFunction(() => window.muiFixture.isReady());
    return page.evaluate((_route) => {
      window.muiFixture.navigate(`${_route}#no-dev`);
    }, route);
  }

  describe('visual regressions', () => {
    afterAll(async () => {
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

    const getTimeout = (route: string) => {
      // With the playwright inspector we might want to call `page.pause` which would lead to a timeout.
      if (process.env.PWDEBUG) {
        return 0;
      }

      // Some routes are more complex and take longer to render.
      if (route.includes('DataGridProDemo')) {
        return 6000;
      }

      return undefined;
    };

    routes.forEach((route) => {
      it(
        `creates screenshots of ${route}`,
        {
          timeout: getTimeout(route),
        },
        async () => {
          if (/^\/docs-charts-tooltip.*/.test(route)) {
            // Ignore tooltip demo. Since they require some interaction they get tested in dedicated tests.
            return;
          }

          // Move cursor offscreen to not trigger unwanted hover effects.
          // This needs to be done before the navigation to avoid hover and mouse enter/leave effects.
          await page.mouse.move(0, 0);

          // Skip animations
          await page.emulateMedia({ reducedMotion: 'reduce' });

          try {
            await navigateToTest(route);
          } catch (error) {
            // When one demo crashes, the page becomes empty and there are no links to demos,
            // so navigation to the next demo throws an error.
            // Reloading the page fixes this.
            await page.reload();
            await navigateToTest(route);
          }

          const screenshotPath = path.resolve(screenshotDir, `.${route}.png`);
          await fse.ensureDir(path.dirname(screenshotPath));

          const testcase = await page.waitForSelector(
            `[data-testid="testcase"][data-testpath="${route}"]:not([aria-busy="true"])`,
          );

          const images = await page.evaluate(() => document.querySelectorAll('img'));
          if (images.length > 0) {
            await page.evaluate(() => {
              images.forEach((img) => {
                if (!img.complete && img.loading === 'lazy') {
                  // Force lazy-loaded images to load
                  img.setAttribute('loading', 'eager');
                }
              });
            });
            // Wait for the flags to load
            await page.waitForFunction(() => [...images].every((img) => img.complete), undefined, {
              timeout: 2000,
            });
          }

          if (/^\/docs-charts-.*/.test(route)) {
            // Run one tick of the clock to get the final animation state
            await sleep(10);
          }

          if (timeSensitiveSuites.some((suite) => route.includes(suite))) {
            await sleep(100);
          }

          // Wait for the page to settle after taking the screenshot.
          await page.waitForLoadState();

          await testcase.screenshot({ path: screenshotPath, type: 'png' });
        },
      );

      it(`should have no errors rendering ${route}`, () => {
        const msg = errorConsole;
        errorConsole = undefined;
        if (isConsoleWarningIgnored(msg)) {
          return;
        }
        expect(msg).to.equal(undefined);
      });
    });

    it('should position the headers matching the columns', async () => {
      const route = '/docs-data-grid-virtualization/ColumnVirtualizationGrid';
      const screenshotPath = path.resolve(screenshotDir, `.${route}ScrollLeft400px.png`);
      await fse.ensureDir(path.dirname(screenshotPath));

      await navigateToTest(route);

      const testcase = await page.waitForSelector(
        `[data-testid="testcase"][data-testpath="${route}"]:not([aria-busy="true"])`,
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

    it('should position charts axis tooltip 8px away from the pointer', async () => {
      const route = '/docs-charts-tooltip/Interaction';
      const axisScreenshotPath = path.resolve(screenshotDir, `.${route}AxisTooltip.png`);
      const itemScreenshotPath = path.resolve(screenshotDir, `.${route}ItemTooltip.png`);
      await fse.ensureDir(path.dirname(axisScreenshotPath));
      await fse.ensureDir(path.dirname(itemScreenshotPath));

      await navigateToTest(route);

      // Skip animations
      await page.emulateMedia({ reducedMotion: 'reduce' });

      // Make sure demo got loaded
      await page.waitForSelector(
        `[data-testid="testcase"][data-testpath="${route}"]:not([aria-busy="true"])`,
      );

      const charts = await page.locator('svg').all();

      await charts[0].click();
      // Should also trigger the item in charts[1]. But did not succeed to trigger the react `onPointerEnter`

      // Need to screenshot the body because the tooltip is outside of the testcase div
      const body = await page.waitForSelector(`body`);
      await body.screenshot({ path: axisScreenshotPath, type: 'png' });
    });

    it('should export a chart as PNG', async () => {
      const route = '/docs-charts-export/ExportChartAsImage';
      const screenshotPath = path.resolve(screenshotDir, `.${route}PNG.png`);
      await fse.ensureDir(path.dirname(screenshotPath));

      await navigateToTest(route);

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Export Image' }).click();

      const download = await downloadPromise;

      await download.saveAs(screenshotPath);
    });

    describe('print preview', () => {
      /* These tests do not properly clean up after themselves, so moving them to their own describe block to close the
       * page after every test. */

      beforeEach(async () => {
        page = await newTestPage(browser);

        // Wait for all requests to finish.
        // This should load shared resources such as fonts.
        await page.goto(`${baseUrl}#dev`, { waitUntil: 'networkidle' });
      });

      afterEach(async () => {
        await page.close();
      });

      it('should take a screenshot of the data grid print preview', async () => {
        const route = '/docs-data-grid-export/ExportDefaultToolbar';
        const screenshotPath = path.resolve(screenshotDir, `.${route}Print.png`);
        await fse.ensureDir(path.dirname(screenshotPath));

        await navigateToTest(route);

        // Click the export button in the toolbar.
        await page.getByRole('button', { name: 'Export' }).click();

        const printButton = page.getByRole('menuitem', { name: 'Print' });
        // Click the print export option from the export menu in the toolbar.
        // Trigger the action async because window.print() is blocking the main thread
        // like window.alert() is.
        setTimeout(() => {
          printButton.click();
        });

        await sleep(4000);

        await screenshotPrintDialogPreview(screenshotPath, {
          x: 72,
          y: 99,
          width: 520,
          height: 400,
        });
      });

      it('should take a screenshot of the charts print preview', async () => {
        const route = '/docs-charts-export/PrintChart';
        const screenshotPath = path.resolve(screenshotDir, `.${route}Print.png`);
        await fse.ensureDir(path.dirname(screenshotPath));

        await navigateToTest(route);

        const printButton = page.getByRole('button', { name: 'Print' });

        // Trigger the action async because window.print() is blocking the main thread
        // like window.alert() is.
        setTimeout(() => {
          printButton.click();
        });

        await sleep(4000);

        await screenshotPrintDialogPreview(screenshotPath, {
          x: 94,
          y: 107,
          width: 490,
          height: 200,
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
}

function isConsoleWarningIgnored(msg?: string) {
  const isMuiV6Error =
    isMaterialUIv6 &&
    msg?.startsWith(
      'MUI: The Experimental_CssVarsProvider component has been ported into ThemeProvider.',
    );

  const isMuiLoadingButtonWarning =
    (isMaterialUIv6 || isMaterialUIv7) &&
    msg?.includes(
      'MUI: The LoadingButton component functionality is now part of the Button component from Material UI.',
    );

  const isReactRouterFlagsError = msg?.includes('React Router Future Flag Warning');

  const isNoDevRoute = msg?.includes('No routes matched location "/#no-dev"');

  // We use the Tailwind CDN in iframed docs demos to isolate the library and avoid having to bundle it.
  const isTailwindCdnWarning = msg?.includes(
    'The browser build of Tailwind CSS should not be used in production.',
  );

  if (
    isMuiV6Error ||
    isReactRouterFlagsError ||
    isNoDevRoute ||
    isTailwindCdnWarning ||
    isMuiLoadingButtonWarning
  ) {
    return true;
  }
  return false;
}

function sleep(timeoutMS: number | undefined) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutMS);
  });
}

function screenshotPrintDialogPreview(
  screenshotPath: string,
  { x, y, width, height }: { x: number; y: number; width: number; height: number },
) {
  return new Promise<void>((resolve, reject) => {
    // See https://ffmpeg.org/ffmpeg-devices.html#x11grab
    const args = `-y -f x11grab -framerate 1 -video_size ${width}x${height} -i :99.0+${x},${y} -vframes 1 ${screenshotPath}`;
    const ffmpeg = childProcess.spawn('ffmpeg', args.split(' '));

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
}

async function newTestPage(browser: Browser) {
  // reuse viewport from `vrtest`
  // https://github.com/nathanmarks/vrtest/blob/1185b852a6c1813cedf5d81f6d6843d9a241c1ce/src/server/runner.js#L44
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });

  // Block images since they slow down tests (need download).
  // They're also most likely decorative for documentation demos
  await page.route(/./, async (route, request) => {
    const type = request.resourceType();
    // Block all images except the flags
    if (type === 'image' && !request.url().startsWith('https://flagcdn.com')) {
      route.abort();
    } else {
      route.continue();
    }
  });

  return page;
}
