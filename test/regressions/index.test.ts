import * as path from 'path';
import * as childProcess from 'child_process';
import { type Browser, chromium, Page } from '@playwright/test';
import fs from 'node:fs/promises';

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

  // prepare screenshots
  await emptyDir(screenshotDir);

  const routes = await page.evaluate(() => window.muiFixture.allTests);

  async function navigateToTest(route: string) {
    // Use client-side routing which is much faster than full page navigation via page.goto().
    return page.evaluate((_route) => {
      window.muiFixture.navigate(_route);
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

    const getTimeout = (route: { url: string }) => {
      // With the playwright inspector we might want to call `page.pause` which would lead to a timeout.
      if (process.env.PWDEBUG) {
        return 0;
      }

      // Some routes are more complex and take longer to render.
      if (route.url.includes('DataGridProDemo')) {
        return 6000;
      }

      return undefined;
    };

    routes.forEach((route) => {
      it(
        `creates screenshots of ${route.url}`,
        {
          timeout: getTimeout(route),
        },
        async () => {
          if (/^\/docs-charts-tooltip\/Interaction/.test(route.url)) {
            // Ignore tooltip interaction demo screenshot.
            // There is a dedicated test for it in this file, and this is why we don't exclude it with the glob pattern in test/regressions/testsBySuite.ts
            return;
          }

          if (/LineChartPointerInteraction/.test(route.url)) {
            // Ignore pointer interaction screenshot — dedicated tests handle mouse positioning.
            return;
          }

          await navigateToTest(route.url);

          // Move cursor offscreen to not trigger unwanted hover effects.
          await page.mouse.move(0, 0);

          const screenshotPath = path.resolve(screenshotDir, `.${route.url}.png`);

          const testcase = await page.waitForSelector(
            `[data-testid="testcase"][data-testpath="${route.url}"]:not([aria-busy="true"])`,
          );

          await page.evaluate(async () => {
            const images = document.querySelectorAll('img');
            if (images.length <= 0) {
              return;
            }
            const promises = [];
            for (const img of images) {
              if (img.complete) {
                continue;
              }
              if (img.loading === 'lazy') {
                // Force lazy-loaded images to load
                img.setAttribute('loading', 'eager');
              }
              const { promise, resolve, reject } = Promise.withResolvers<void>();
              img.onload = () => resolve();
              img.onerror = reject;
              promises.push(promise);
            }
            await Promise.all(promises);
          });

          if (/^\/docs-charts-.*/.test(route.url)) {
            // Run one tick of the clock to get the final animation state
            await sleep(10);
          }

          if (timeSensitiveSuites.some((suite) => route.url.includes(suite))) {
            await sleep(100);
          }

          // Wait for the page to settle after taking the screenshot.
          await page.waitForLoadState();

          await testcase.screenshot({ path: screenshotPath, type: 'png' });
        },
      );

      it(`should have no errors rendering ${route.url}`, () => {
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

      await navigateToTest(route);

      const testcase = await page.waitForSelector(
        `[data-testid="testcase"][data-testpath="${route}"]:not([aria-busy="true"])`,
      );

      await sleep(100);
      await page.evaluate(() => {
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');

        if (!virtualScroller) {
          throw new Error('missing virtualScroller');
        }

        virtualScroller.scrollLeft = 400;
        virtualScroller.dispatchEvent(new Event('scroll'));
      });
      await sleep(100);

      await testcase.screenshot({ path: screenshotPath, type: 'png' });
    });

    it('should clamp the horizontal scroll position in the fluid width column dimensions scenario', async () => {
      const route = '/test-regressions-data-grid/ColumnFluidWidthScrollClamp';
      const screenshotPath = path.resolve(screenshotDir, `.${route}AfterResize.png`);

      await navigateToTest(route);

      const testcase = await page.waitForSelector(
        `[data-testid="testcase"][data-testpath="${route}"]:not([aria-busy="true"])`,
      );

      await page.getByRole('button', { name: 'Scroll to max' }).click();
      await page.getByRole('button', { name: 'Shrink username' }).click();

      await page.waitForFunction(() => {
        const root = document.querySelector<HTMLElement>('.MuiDataGrid-root');
        const virtualScroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller');

        if (!root || !virtualScroller) {
          return false;
        }

        const rowWidth = Number.parseFloat(root.style.getPropertyValue('--DataGrid-rowWidth'));
        const maxScrollLeft = Math.max(0, rowWidth - virtualScroller.clientWidth);

        return maxScrollLeft === 0 && Math.abs(virtualScroller.scrollLeft) === 0;
      });

      const scrollState = await page.evaluate(() => {
        const root = document.querySelector<HTMLElement>('.MuiDataGrid-root');
        const virtualScroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller');

        if (!root || !virtualScroller) {
          throw new Error('missing grid elements');
        }

        const rowWidth = Number.parseFloat(root.style.getPropertyValue('--DataGrid-rowWidth'));

        return {
          hasScrollX: root.style.getPropertyValue('--DataGrid-hasScrollX'),
          maxScrollLeft: Math.max(0, rowWidth - virtualScroller.clientWidth),
          scrollLeft: Math.abs(virtualScroller.scrollLeft),
        };
      });

      expect(scrollState.maxScrollLeft).to.equal(0);
      expect(scrollState.scrollLeft).to.equal(0);
      expect(scrollState.hasScrollX).to.equal('0');

      await testcase.screenshot({ path: screenshotPath, type: 'png' });
    });

    it('should position charts axis tooltip 8px away from the pointer', async () => {
      const route = '/docs-charts-tooltip/Interaction';
      const axisScreenshotPath = path.resolve(screenshotDir, `.${route}AxisTooltip.png`);

      await navigateToTest(route);

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

    it('should highlight line series when pointer is within the proximity threshold', async () => {
      const route = '/test-regressions-charts/LineChartPointerInteraction';
      const screenshotPath = path.resolve(screenshotDir, `.${route}LineHighlight.png`);

      await navigateToTest(route);

      const testcase = await page.waitForSelector(
        `[data-testid="testcase"][data-testpath="${route}"]:not([aria-busy="true"])`,
      );

      await sleep(10);

      await enablePointerDot(page);

      // At index 5: Series C (area)=9, Series A=5, Series B=3. yAxis 0-10.
      // Both tests position the pointer relative to Series A's line.
      // LINE_PROXIMITY_THRESHOLD = 15px.
      const drawingArea = await getDrawingArea(page);
      const pointerX = drawingArea.left + drawingArea.width / 2;
      const seriesAY = drawingArea.top + (drawingArea.height * (10 - 5)) / 10;
      // 13px below Series A → inside area fill, within threshold → line highlighted
      const pointerY = seriesAY + 13;

      await page.mouse.move(pointerX, pointerY);
      await sleep(300);

      await testcase.screenshot({ path: screenshotPath, type: 'png' });
    });

    it('should highlight area series when pointer is inside fill but outside line threshold', async () => {
      const route = '/test-regressions-charts/LineChartPointerInteraction';
      const screenshotPath = path.resolve(screenshotDir, `.${route}AreaHighlight.png`);

      await navigateToTest(route);
      await page.reload(); // Ensure a fresh state since we reuse the same page.

      const testcase = await page.waitForSelector(
        `[data-testid="testcase"][data-testpath="${route}"]:not([aria-busy="true"])`,
      );

      await sleep(10);

      await enablePointerDot(page);

      // Same reference point, but 17px below Series A → outside threshold → area highlighted
      const drawingArea = await getDrawingArea(page);
      const pointerX = drawingArea.left + drawingArea.width / 2;
      const seriesAY = drawingArea.top + (drawingArea.height * (10 - 5)) / 10;
      const pointerY = seriesAY + 17;

      await page.mouse.move(pointerX, pointerY);
      await sleep(300);

      await testcase.screenshot({ path: screenshotPath, type: 'png' });
    });

    it('should export a chart as PNG', async () => {
      const route = '/docs-charts-export/ExportChartAsImage';
      const screenshotPath = path.resolve(screenshotDir, `.${route}PNG.png`);

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
      });

      afterEach(async () => {
        await page.close();
      });

      it('should take a screenshot of the data grid print preview', async () => {
        const route = '/docs-data-grid-export/ExportDefaultToolbar';
        const screenshotPath = path.resolve(screenshotDir, `.${route}Print.png`);

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

        await sleep(5000);

        await screenshotPrintDialogPreview(screenshotPath, {
          x: 72,
          y: 99,
          width: 520,
          height: 400,
        });
      });

      it('should take a screenshot of the print export with dynamic row height', async () => {
        const route = '/test-regressions-data-grid/PrintExportDynamicRowHeight';
        const screenshotPath = path.resolve(screenshotDir, `.${route}Print.png`);

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

        await sleep(5000);

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

    it('should export a chart as PNG when page is zoomed out', async () => {
      const route = '/docs-charts-export/ExportChartAsImage';
      const screenshotPath = path.resolve(screenshotDir, `.${route}ZoomedOutPNG.png`);

      page = await newTestPage(browser, { deviceScaleFactor: 0.8 });
      await navigateToTest(route);

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Export Image' }).click();

      const download = await downloadPromise;

      await download.saveAs(screenshotPath);

      await page.close();
    });

    it('should export a chart as PNG when page is zoomed in', async () => {
      const route = '/docs-charts-export/ExportChartAsImage';
      const screenshotPath = path.resolve(screenshotDir, `.${route}ZoomedInPNG.png`);

      page = await newTestPage(browser, { deviceScaleFactor: 1.25 });
      await navigateToTest(route);

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Export Image' }).click();

      const download = await downloadPromise;

      await download.saveAs(screenshotPath);

      await page.close();
    });
  });
}

function isConsoleWarningIgnored(msg?: string) {
  const isReactRouterFlagsError = msg?.includes('React Router Future Flag Warning');

  const isNoDevRoute = msg?.includes('No routes matched location "/#no-dev"');

  // We use the Tailwind CDN in iframed docs demos to isolate the library and avoid having to bundle it.
  const isTailwindCdnWarning = msg?.includes(
    'The browser build of Tailwind CSS should not be used in production.',
  );

  if (isReactRouterFlagsError || isNoDevRoute || isTailwindCdnWarning) {
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

/** Adds a red dot on the body that follows the mouse cursor. */
async function enablePointerDot(page: Page) {
  await page.evaluate(() => {
    const dot = document.createElement('div');
    Object.assign(dot.style, {
      position: 'fixed',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: 'red',
      pointerEvents: 'none',
      zIndex: '999999',
      transform: 'translate(-50%, -50%)',
    });
    document.body.appendChild(dot);

    document.addEventListener('pointermove', (event) => {
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
    });
  });
}

/**
 * Returns the chart drawing area in viewport coordinates by reading
 * the MuiLineElement path's bounding box and the container position.
 * Falls back to the SVG clipPath rect if available.
 */
async function getDrawingArea(page: Page) {
  return page.evaluate(() => {
    const svg = document.querySelector('svg')!;
    const svgRect = svg.getBoundingClientRect();

    // The clipPath rect defines the drawing area within the SVG.
    const clipRect = svg.querySelector('clipPath rect');
    if (clipRect) {
      const x = Number(clipRect.getAttribute('x'));
      const y = Number(clipRect.getAttribute('y'));
      const width = Number(clipRect.getAttribute('width'));
      const height = Number(clipRect.getAttribute('height'));
      return {
        left: svgRect.left + x,
        top: svgRect.top + y,
        width,
        height,
      };
    }

    return { left: svgRect.left, top: svgRect.top, width: svgRect.width, height: svgRect.height };
  });
}

type NewPageOptions = Parameters<Browser['newPage']>[0];

async function newTestPage(browser: Browser, newPageOptions: NewPageOptions = {}): Promise<Page> {
  // reuse viewport from `vrtest`
  // https://github.com/nathanmarks/vrtest/blob/1185b852a6c1813cedf5d81f6d6843d9a241c1ce/src/server/runner.js#L44
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 }, ...newPageOptions });

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

  // Skip animations
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Simulate portrait mode for date pickers.
  // See `usePickerOrientation`.
  await page.evaluate(() => {
    Object.defineProperty(window.screen.orientation, 'angle', {
      get() {
        return 0;
      },
    });
  });

  const baseUrl = 'http://localhost:5001';
  // Wait for all requests to finish.
  // This should load shared resources such as fonts.
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  await page.waitForFunction(() => window.muiFixture?.isReady);

  return page;
}

async function emptyDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
  const items = await fs.readdir(dir);
  await Promise.all(items.map((item) => fs.rm(path.join(dir, item), { recursive: true })));
}
