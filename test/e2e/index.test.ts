import { expect } from 'chai';
import { chromium, webkit, firefox, Page, Browser, BrowserContext } from '@playwright/test';

function sleep(timeoutMS: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeoutMS);
  });
}

// A simplified version of https://github.com/testing-library/dom-testing-library/blob/main/src/wait-for.js
function waitFor(callback: () => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    let intervalId: NodeJS.Timer | null = null;
    let timeoutId: NodeJS.Timer | null = null;
    let lastError: any = null;

    function handleTimeout() {
      clearTimeout(timeoutId!);
      clearInterval(intervalId!);
      reject(lastError);
    }

    async function checkCallback() {
      try {
        await callback();
        clearTimeout(timeoutId!);
        clearInterval(intervalId!);
        resolve();
      } catch (error) {
        lastError = error;
      }
    }

    timeoutId = setTimeout(handleTimeout, 1000);
    intervalId = setTimeout(checkCallback, 50);
  });
}

/**
 * Attempts page.goto with retries
 *
 * @remarks The server and runner can be started up simultaneously
 * @param page
 * @param url
 */
async function attemptGoto(page: Page, url: string): Promise<boolean> {
  const maxAttempts = 10;
  const retryTimeoutMS = 250;

  let didNavigate = false;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await page.goto(url);
      didNavigate = true;
    } catch (error) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(retryTimeoutMS);
    }
  }

  return didNavigate;
}

// Pick the new/fake "now" for you test pages.
const fakeNow = new Date('2022-04-17T13:37:11').valueOf();

[chromium, webkit, firefox].forEach((browserType) => {
  describe(`e2e: ${browserType.name()}`, () => {
    const baseUrl = 'http://localhost:5001';
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    async function renderFixture(fixturePath: string) {
      if (page.url().includes(fixturePath)) {
        // ensure that the page is reloaded if the it's the same fixture
        // ensures that page is reset on firefox
        await page.reload();
      } else {
        await page.goto(`${baseUrl}/e2e/${fixturePath}#no-dev`);
      }
    }

    before(async function beforeHook() {
      this.timeout(20000);

      browser = await browserType.launch({
        headless: true,
      });
      // eslint-disable-next-line no-console
      console.log(`Running on: ${browserType.name()}, version: ${browser.version()}.`);
      context = await browser.newContext({
        // ensure consistent date formatting regardless or environment
        locale: 'en-US',
      });
      page = await context.newPage();
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
      const isServerRunning = await attemptGoto(page, `${baseUrl}#no-dev`);
      if (!isServerRunning) {
        throw new Error(
          `Unable to navigate to ${baseUrl} after multiple attempts. Did you forget to run \`yarn test:e2e:server\` and \`yarn test:e2e:build\`?`,
        );
      }
    });

    after(async () => {
      await context.close();
      await browser.close();
    });

    describe('<DataGrid />', () => {
      it('should select the first column header when pressing tab key', async () => {
        await renderFixture('DataGrid/KeyboardNavigationFocus');

        const button = page.locator('text=initial focus');
        expect(await button.evaluate((node) => document.activeElement === node));

        await page.keyboard.press('Tab');
        expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('brand');
      });

      it('should implement the roving tabindex pattern', async () => {
        await renderFixture('DataGrid/KeyboardNavigationFocus');

        const button = page.locator('text=initial focus');
        expect(await button.evaluate((node) => document.activeElement === node));

        await page.keyboard.press('Tab');
        await waitFor(async () => {
          expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('brand');
          expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
            'columnheader',
          );
        });
        await page.keyboard.press('ArrowDown');
        await waitFor(async () => {
          expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('Nike');
          expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
            'cell',
          );
        });
        await page.keyboard.press('ArrowDown');
        await waitFor(async () => {
          expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('Adidas');
          expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
            'cell',
          );
        });
        await page.keyboard.press('Tab');
        await waitFor(async () => {
          expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('100');
          expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
            'button',
          );
        });
        await page.keyboard.press('Shift+Tab');
        await waitFor(async () => {
          expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('Adidas');
          expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
            'cell',
          );
        });
        // WebKit does not focus on buttons by default when pressing tab.
        // https://github.com/microsoft/playwright/issues/5609#issuecomment-832684772
        await page.keyboard.press(browserType.name() === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab');
        await waitFor(async () => {
          expect(
            await page.evaluate(() => document.activeElement?.getAttribute('data-testid')),
          ).to.equal('initial-focus');
        });
      });

      it('should display the rows', async () => {
        await renderFixture('DataGrid/ConcurrentReactUpdate');
        const cells = page.locator('[role="cell"]');
        await cells.first().waitFor();
        expect(await cells.allTextContents()).to.deep.equal(['1', '2']);
      });

      it('should work with a select as the edit cell', async () => {
        await renderFixture('DataGrid/SelectEditCell');
        await page.dblclick('"Nike"');
        await page.click('"Gucci"');
        expect(
          await page.evaluate(() => {
            const selector = '[role="row"][data-rowindex="0"] [role="cell"][data-colindex="0"]';
            return document.querySelector(selector)!.textContent!;
          }),
        ).to.equal('Gucci');
      });

      it('should reorder columns by dropping into the header', async () => {
        await renderFixture('DataGrid/ColumnReorder');

        expect(await page.locator('[role="row"]').first().textContent()).to.equal('brandyear');

        const brand = page.locator('[role="columnheader"][aria-colindex="1"] > [draggable]');
        const year = page.locator('[role="columnheader"][aria-colindex="2"] > [draggable]');
        await brand.dragTo(year, { timeout: 1000 });

        expect(
          await page.evaluate(() => document.querySelector('[role="row"]')!.textContent!),
        ).to.equal('yearbrand');
      });

      it('should reorder columns by dropping into the grid row column', async () => {
        await renderFixture('DataGrid/ColumnReorder');

        expect(await page.locator('[role="row"]').first().textContent()).to.equal('brandyear');

        const brand = page.locator('[role="columnheader"][aria-colindex="1"] > [draggable]');
        const rowColumn1990 = page.locator(
          '[role="row"][data-rowindex="0"] [role="cell"][data-colindex="1"]',
        );
        await brand.dragTo(rowColumn1990, { timeout: 1000 });

        expect(await page.locator('[role="row"]').first().textContent()).to.equal('yearbrand');
      });

      // https://github.com/mui/mui-x/pull/9117
      it('should not trigger sorting after resizing', async () => {
        await renderFixture('DataGridPro/NotResize');

        const separator = page.locator('.MuiDataGrid-columnSeparator--resizable').first();
        const boundingBox = (await separator?.boundingBox())!;

        const x = boundingBox.x + boundingBox.width / 2;
        const y = boundingBox.y + boundingBox.height / 2;

        await page.mouse.move(x, y, { steps: 5 });
        await page.mouse.down();
        await page.mouse.move(x - 20, y, { steps: 5 });
        await page.mouse.up();

        expect(
          await page.evaluate(
            () =>
              document
                .querySelector('.MuiDataGrid-columnHeader--sorted')!
                .getAttribute('data-field')!,
          ),
        ).to.equal('brand');
      });

      it('should select one row', async () => {
        await renderFixture('DataGrid/CheckboxSelection');
        await page.click('[role="row"][data-rowindex="0"] [role="cell"] input');
        expect(
          await page.evaluate(
            () => document.querySelector('[role="row"][data-rowindex="0"]')!.className!,
          ),
        ).to.contain('Mui-selected');
      });

      it('should not scroll when changing the selected row', async () => {
        await renderFixture('DataGrid/RowSelection');
        await page.click('[role="row"][data-rowindex="0"] [role="cell"]');
        await page.evaluate(() =>
          document.querySelector('[role="row"][data-rowindex="3"] [role="cell"]')!.scrollIntoView(),
        );
        const scrollTop = await page.evaluate(
          () => document.querySelector('.MuiDataGrid-virtualScroller')!.scrollTop!,
        );
        expect(scrollTop).not.to.equal(0);
        await page.click('[role="row"][data-rowindex="3"] [role="cell"]');
        expect(
          await page.evaluate(
            () => document.querySelector('.MuiDataGrid-virtualScroller')!.scrollTop!,
          ),
        ).to.equal(scrollTop);
      });

      // if this test fails locally on chromium, be aware that it uses system locale format,
      // instead of one specified by the `locale`
      it('should edit date cells', async () => {
        // webkit has issues with date input locale on circleci
        if (browserType.name() === 'webkit' && process.env.CIRCLECI) {
          return;
        }
        await renderFixture('DataGrid/KeyboardEditDate');

        // Edit date column
        expect(await page.locator('[role="cell"][data-field="birthday"]').textContent()).to.equal(
          '2/29/1984',
        );

        // set 06/25/1986
        await page.dblclick('[role="cell"][data-field="birthday"]');
        await page.type('[role="cell"][data-field="birthday"] input', '06/25/1986');

        await page.keyboard.press('Enter');

        expect(await page.locator('[role="cell"][data-field="birthday"]').textContent()).to.equal(
          '6/25/1986',
        );

        // Edit dateTime column
        expect(
          await page.locator('[role="cell"][data-field="lastConnection"]').textContent(),
        ).to.equal('2/20/2022, 6:50:00 AM');

        // start editing lastConnection
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Enter');

        // set 01/31/2025 04:05:00 PM
        const dateTimeInput = page.locator('[role="cell"][data-field="lastConnection"] input');
        if (browserType.name() === 'firefox') {
          // firefox seems to break the section jumping if the section is edited without firstly clearing it
          dateTimeInput.press('Backspace');
          await dateTimeInput.type('01/31/2025');
          // only reliable way on firefox to move to time section is via arrow key
          await dateTimeInput.press('ArrowRight');
          await dateTimeInput.type('4:5');
          await dateTimeInput.press('ArrowRight');
          await dateTimeInput.type('p');
        } else {
          await dateTimeInput.type('01/31/2025,4:5:p');
        }

        await page.keyboard.press('Enter');

        expect(page.getByText('1/31/2025, 4:05:00 PM')).not.to.equal(null);
      });

      // https://github.com/mui/mui-x/issues/3613
      it('should not lose cell focus when scrolling with arrow down', async () => {
        await renderFixture('DataGridPro/KeyboardNavigationFocus');

        async function keyDown() {
          await page.keyboard.down('ArrowDown');
          // wait between keydown events for virtualization
          await sleep(100);
        }

        const button = page.locator('text=initial focus');
        expect(await button.evaluate((node) => document.activeElement === node));

        await page.keyboard.down('Tab');

        await keyDown(); // 0
        await keyDown(); // 1
        await keyDown(); // 2
        await keyDown(); // 3

        expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
          'cell',
          'Expected cell to be focused',
        );
        expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('3');
      });

      // https://github.com/mui/mui-x/issues/3795#issuecomment-1025628771
      it('should allow horizontal scroll when there are more columns and no rows', async () => {
        await renderFixture('DataGrid/EmptyGrid');
        await page.mouse.move(150, 150);
        await page.mouse.wheel(50, 0);
        await sleep(50);

        const scrollLeft = await page.evaluate(() => {
          return document.querySelector('.MuiDataGrid-virtualScroller')!.scrollLeft;
        });
        expect(scrollLeft).not.to.equal(0);
      });

      // https://github.com/mui/mui-x/issues/4190
      it('should move the focus from left pinned column to the cell in main render zone after pressing Tab during row editing', async () => {
        await renderFixture('DataGridPro/RowEditingWithPinnedColumns');

        await page.dblclick('[role="cell"][data-field="column0"]');
        await page.keyboard.down('Tab');

        expect(
          await page.evaluate(() => (document.activeElement as HTMLInputElement).value),
        ).to.equal('0-1');
      });

      // https://github.com/mui/mui-x/issues/5590
      it('should allow to click a button in NoRowsOverlay', async () => {
        await renderFixture('DataGrid/NoRowsOverlayWithButton');

        await page.click('[data-testid="refresh"]');

        expect(
          await page.evaluate(() => document.querySelector('[data-testid="refresh"]')!.textContent),
        ).to.equal('Clicked');
      });

      it('should start editing a cell when a printable char is pressed', async () => {
        await renderFixture('DataGrid/KeyboardEditInput');

        expect(await page.locator('[role="cell"][data-field="brand"]').textContent()).to.equal(
          'Nike',
        );

        await page.click('[role="cell"][data-field="brand"]');
        await page.type('[role="cell"][data-field="brand"]', 'p');

        expect(await page.locator('[role="cell"][data-field="brand"] input').inputValue()).to.equal(
          'p',
        );
      });
    });

    describe('<DatePicker />', () => {
      describe('<DesktopDatePicker />', () => {
        it('should allow selecting a value', async () => {
          await renderFixture('DatePicker/BasicDesktopDatePicker');

          await page.getByRole('button').click();
          expect(
            await page.getByRole('gridcell', { name: '17' }).getAttribute('aria-current'),
          ).to.equal('date');
          await page.getByRole('gridcell', { name: '11' }).click();

          // assert that the tooltip closes after selection is complete
          // could run into race condition otherwise
          await page.waitForSelector('[role="tooltip"]', { state: 'detached' });
          expect(await page.getByRole('textbox').inputValue()).to.equal('04/11/2022');
        });

        it('should allow filling in a value and clearing a value', async () => {
          await renderFixture('DatePicker/BasicDesktopDatePicker');
          const input = page.getByRole('textbox');

          await input.fill('04/11/2022');

          expect(await input.inputValue()).to.equal('04/11/2022');

          await input.blur();
          await input.fill('');

          expect(await input.inputValue()).to.equal('MM/DD/YYYY');
        });

        it('should allow typing in a value', async () => {
          await renderFixture('DatePicker/BasicDesktopDatePicker');
          const input = page.getByRole('textbox');

          await input.focus();
          await input.type('04/11/2022');

          expect(await input.inputValue()).to.equal('04/11/2022');
        });
      });
      describe('<MobileDatePicker />', () => {
        it('should allow selecting a value', async () => {
          await renderFixture('DatePicker/BasicMobileDatePicker');

          await page.getByRole('textbox').click({ position: { x: 10, y: 2 } });

          await page.getByRole('gridcell', { name: '11' }).click();
          await page.getByRole('button', { name: 'OK' }).click();

          await waitFor(async () => {
            // assert that the dialog has been closed and the focused element is the input
            expect(await page.evaluate(() => document.activeElement?.nodeName)).to.equal('INPUT');
          });
          expect(await page.getByRole('textbox').inputValue()).to.equal('04/11/2022');
        });
      });
    });
    describe('<DesktopDateTimePicker />', () => {
      it('should allow selecting a value', async () => {
        await renderFixture('DatePicker/BasicDesktopDateTimePicker');

        await page.getByRole('button').click();

        await page.getByRole('gridcell', { name: '11' }).click();
        await page.getByRole('option', { name: '3 hours' }).click();
        await page.getByRole('option', { name: '30 minutes' }).click();
        await page.getByRole('option', { name: 'PM' }).click();

        // assert that the tooltip closes after selection is complete
        // could run into race condition otherwise
        await page.waitForSelector('[role="tooltip"]', { state: 'detached' });
        expect(await page.getByRole('textbox').inputValue()).to.equal('04/11/2022 03:30 PM');
      });
      it('should correctly select hours section when there are no time renderers', async () => {
        await renderFixture('DatePicker/DesktopDateTimePickerNoTimeRenderers');

        await page.getByRole('button').click();

        await page.getByRole('gridcell', { name: '11' }).click();

        // assert that the hours section has been selected using two APIs
        await waitFor(async () => {
          // Firefox does not resolve selection inside of an input component
          // https://stackoverflow.com/questions/20419515/window-getselection-of-textarea-not-working-in-firefox#comment52700249_20419515
          if (browserType.name() !== 'firefox') {
            expect(await page.evaluate(() => window.getSelection()?.toString())).to.equal('12');
          }
          expect(
            await page.evaluate(() => (document.activeElement as HTMLInputElement).selectionStart),
          ).to.equal(11);
          expect(
            await page.evaluate(() => (document.activeElement as HTMLInputElement).selectionEnd),
          ).to.equal(13);
        });
      });
    });
    describe('<DateRangePicker />', () => {
      it('should allow selecting a range value', async () => {
        // firefox in CI is not happy with this test
        if (browserType.name() === 'firefox' && process.env.CIRCLECI) {
          return;
        }
        await renderFixture('DatePicker/BasicDesktopDateRangePicker');

        await page.getByRole('textbox', { name: 'Start' }).click();

        await page.getByRole('gridcell', { name: '11' }).first().click();
        await page.getByRole('gridcell', { name: '17' }).last().click();

        // assert that the tooltip closes after selection is complete
        await page.waitForSelector('[role="tooltip"]', { state: 'detached' });

        expect(await page.getByRole('textbox', { name: 'Start' }).inputValue()).to.equal(
          '04/11/2022',
        );
        expect(await page.getByRole('textbox', { name: 'End' }).inputValue()).to.equal(
          '05/17/2022',
        );
      });

      it('should not close the tooltip when the focus switches between inputs', async () => {
        // firefox in CI is not happy with this test
        if (browserType.name() === 'firefox' && process.env.CIRCLECI) {
          return;
        }
        await renderFixture('DatePicker/BasicDesktopDateRangePicker');

        await page.getByRole('textbox', { name: 'Start' }).click();

        // assert that the tooltip has been opened
        await page.waitForSelector('[role="tooltip"]', { state: 'attached' });

        await page.getByRole('textbox', { name: 'End' }).click();

        // assert that the tooltip has not been closed after changing the active input
        await page.waitForSelector('[role="tooltip"]', { state: 'visible' });

        await page.keyboard.press('Escape');

        await page.waitForSelector('[role="tooltip"]', { state: 'detached' });
      });
    });
  });
});
