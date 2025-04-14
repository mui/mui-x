import * as fse from 'fs-extra';
import { expect } from 'chai';
import * as path from 'path';
import * as childProcess from 'child_process';
import { chromium } from '@playwright/test';
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

// Pick the new/fake "now" for you test pages.
const fakeNow = new Date('Mon Aug 18 14:11:54 2014 -0500').valueOf();

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
  // reuse viewport from `vrtest`
  // https://github.com/nathanmarks/vrtest/blob/1185b852a6c1813cedf5d81f6d6843d9a241c1ce/src/server/runner.js#L44
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });

  // taken from: https://github.com/microsoft/playwright/issues/6347#issuecomment-1085850728
  // Update the Date accordingly in your test pages
  await page.addInitScript(`{
    // Extend Date constructor to default to fakeNow
    Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          super(${fakeNow});
        } else {
          super(...args);
        }
      }
    }
    // Override Date.now() to start from fakeNow
    const __DateNowOffset = ${fakeNow} - Date.now();
    const __DateNow = Date.now;
    Date.now = () => __DateNow() + __DateNowOffset;
  }`);

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

    routes.forEach((route) => {
      it(`creates screenshots of ${route}`, async function test() {
        // Move cursor offscreen to not trigger unwanted hover effects.
        // This needs to be done before the navigation to avoid hover and mouse enter/leave effects.
        await page.mouse.move(0, 0);

        // Skip animations
        await page.emulateMedia({ reducedMotion: 'reduce' });

        // With the playwright inspector we might want to call `page.pause` which would lead to a timeout.
        if (process.env.PWDEBUG) {
          this.timeout(0);
        }

        if (route.includes('DataGridProDemo')) {
          this.timeout(6000);
        }

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
      });

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

    it('should take a screenshot of the print preview', async function test() {
      this.timeout(20000);

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

      return new Promise((resolve, reject) => {
        // See https://ffmpeg.org/ffmpeg-devices.html#x11grab
        const args = `-y -f x11grab -framerate 1 -video_size 460x400 -i :99.0+90,95 -vframes 1 ${screenshotPath}`;
        const ffmpeg = childProcess.spawn('ffmpeg', args.split(' '));

        ffmpeg.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`ffmpeg exited with code ${code}`));
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
