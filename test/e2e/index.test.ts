import { platform } from 'node:os';
import { expect } from 'chai';
import {
  chromium,
  webkit,
  firefox,
  Page,
  Browser,
  BrowserContext,
  devices,
  BrowserContextOptions,
  BrowserType,
  WebError,
  Locator,
} from '@playwright/test';
import { pickersTextFieldClasses } from '@mui/x-date-pickers/PickersTextField';
import { pickersSectionListClasses } from '@mui/x-date-pickers/PickersSectionList';

function sleep(timeoutMS: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeoutMS);
  });
}

// A simplified version of https://github.com/testing-library/dom-testing-library/blob/main/src/wait-for.js
function waitFor(callback: () => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    let intervalId: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
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

let browser: Browser;
let context: BrowserContext;
let page: Page;
const baseUrl = 'http://localhost:5001';

async function renderFixture(fixturePath: string) {
  if (page.url().includes(fixturePath)) {
    // ensure that the page is reloaded if the it's the same fixture
    // ensures that page is reset on firefox
    await page.reload();
  } else {
    await page.goto(`${baseUrl}/e2e/${fixturePath}#no-dev`);
  }
}

async function initializeEnvironment(
  browserType: BrowserType,
  contextOptions?: BrowserContextOptions,
) {
  browser = await browserType.launch({
    headless: true,
  });
  // eslint-disable-next-line no-console
  console.log(`Running on: ${browserType.name()}, version: ${browser.version()}.`);
  context = await browser.newContext({
    // ensure consistent date formatting regardless of environment
    locale: 'en-US',
    ...contextOptions,
  });
  // Circle CI has low-performance CPUs.
  context.setDefaultTimeout((process.env.CIRCLECI === 'true' ? 4 : 2) * 1000);
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
      `Unable to navigate to ${baseUrl} after multiple attempts. Did you forget to run \`pnpm test:e2e:server\` and \`pnpm test:e2e:build\`?`,
    );
  }
  return { browser, context, page };
}

[chromium, webkit, firefox].forEach((browserType) => {
  describe(`e2e: ${browserType.name()}`, () => {
    before(async function beforeHook() {
      this.timeout(20000);

      await initializeEnvironment(browserType);
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
            'gridcell',
          );
        });
        await page.keyboard.press('ArrowDown');
        await waitFor(async () => {
          expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('Adidas');
          expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
            'gridcell',
          );
        });
        await page.keyboard.press('Tab');
        await waitFor(async () => {
          expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('100');
          expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
            'combobox',
          );
        });
        await page.keyboard.press('Shift+Tab');
        await waitFor(async () => {
          expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('Adidas');
          expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
            'gridcell',
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
        const cells = page.locator('[role="gridcell"]');
        await cells.first().waitFor();
        expect(await cells.allTextContents()).to.deep.equal(['1', '2']);
      });

      it('should work with a select as the edit cell', async () => {
        await renderFixture('DataGrid/SelectEditCell');
        await page.dblclick('"Nike"');
        await page.click('"Gucci"');
        expect(
          await page.evaluate(() => {
            const selector = '[role="row"][data-rowindex="0"] [role="gridcell"][data-colindex="0"]';
            return document.querySelector(selector)!.textContent!;
          }),
        ).to.equal('Gucci');
      });

      it('should reorder columns by dropping into the header', async () => {
        // this test sometimes fails on webkit for some reason
        if (browserType.name() === 'webkit' && process.env.CIRCLECI) {
          return;
        }
        await renderFixture('DataGrid/ColumnReorder');

        expect(await page.locator('[role="row"]').first().textContent()).to.equal('brandyear');

        const brand = page.locator('[role="columnheader"][aria-colindex="1"] > [draggable]');
        const year = page.locator('[role="columnheader"][aria-colindex="2"] > [draggable]');
        await brand.dragTo(year);

        expect(
          await page.evaluate(() => document.querySelector('[role="row"]')!.textContent!),
        ).to.equal('yearbrand');
      });

      it('should reorder columns by dropping into the grid row column', async () => {
        // this test sometimes fails on webkit for some reason
        if (browserType.name() === 'webkit' && process.env.CIRCLECI) {
          return;
        }
        await renderFixture('DataGrid/ColumnReorder');

        expect(await page.locator('[role="row"]').first().textContent()).to.equal('brandyear');

        const brand = page.locator('[role="columnheader"][aria-colindex="1"] > [draggable]');
        const rowColumn1990 = page.locator(
          '[role="row"][data-rowindex="0"] [role="gridcell"][data-colindex="1"]',
        );
        await brand.dragTo(rowColumn1990);

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
        await page.click('[role="row"][data-rowindex="0"] [role="gridcell"] input');
        expect(
          await page.evaluate(
            () => document.querySelector('[role="row"][data-rowindex="0"]')!.className!,
          ),
        ).to.contain('Mui-selected');
      });

      it('should not scroll when changing the selected row', async () => {
        await renderFixture('DataGrid/RowSelection');
        await page.click('[role="row"][data-rowindex="0"] [role="gridcell"]');
        await page.evaluate(() =>
          document
            .querySelector('[role="row"][data-rowindex="3"] [role="gridcell"]')!
            .scrollIntoView(),
        );
        const scrollTop = await page.evaluate(
          () => document.querySelector('.MuiDataGrid-virtualScroller')!.scrollTop!,
        );
        expect(scrollTop).not.to.equal(0);
        await page.click('[role="row"][data-rowindex="3"] [role="gridcell"]');
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
        expect(
          await page.locator('[role="gridcell"][data-field="birthday"]').textContent(),
        ).to.equal('2/29/1984');

        // set 06/25/1986
        await page.dblclick('[role="gridcell"][data-field="birthday"]');
        await page.type('[role="gridcell"][data-field="birthday"] input', '06/25/1986');

        await page.keyboard.press('Enter');

        expect(
          await page.locator('[role="gridcell"][data-field="birthday"]').textContent(),
        ).to.equal('6/25/1986');

        // Edit dateTime column
        expect(
          await page.locator('[role="gridcell"][data-field="lastConnection"]').textContent(),
        ).to.equal('2/20/2022, 6:50:00 AM');

        // start editing lastConnection
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Enter');

        // set 01/31/2025 04:05:00 PM
        const dateTimeInput = page.locator('[role="gridcell"][data-field="lastConnection"] input');
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
          'gridcell',
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

        await page.dblclick('[role="gridcell"][data-field="column0"]');
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

        expect(await page.locator('[role="gridcell"][data-field="brand"]').textContent()).to.equal(
          'Nike',
        );

        await page.click('[role="gridcell"][data-field="brand"]');
        await page.keyboard.press('p');
        if (browserType.name() === 'firefox') {
          // In firefox the test fails without this
          // It works fine when testing manually using the same firefox executable
          await page.keyboard.insertText('p');
        }

        expect(
          await page.locator('[role="gridcell"][data-field="brand"] input').inputValue(),
        ).to.equal('p');
      });

      // https://github.com/mui/mui-x/issues/9281
      it('should return a number value when editing with a digit key press', async () => {
        await renderFixture('DataGrid/KeyboardEditNumber');

        await page.click('[role="gridcell"][data-field="age"]');
        await page.keyboard.press('1');
        if (browserType.name() === 'firefox') {
          // In firefox the test fails without this
          // It works fine when testing manually using the same firefox executable
          await page.keyboard.insertText('1');
        }
        await page.keyboard.press('Enter');

        expect(await page.getByTestId('new-value').textContent()).to.equal('number 1');
      });

      // https://github.com/mui/mui-x/issues/10582
      it('should update input value when editing starts with `0` key press', async () => {
        await renderFixture('DataGrid/KeyboardEditNumber');

        await page.click('[role="gridcell"][data-field="age"]');
        await page.keyboard.press('0');
        if (browserType.name() === 'firefox') {
          // In firefox the test fails without this
          // It works fine when testing manually using the same firefox executable
          await page.keyboard.insertText('0');
        }

        expect(
          await page.locator('[role="gridcell"][data-field="age"] input').inputValue(),
        ).to.equal('0');
      });

      // https://github.com/mui/mui-x/issues/10582
      it('should update input value when editing starts with `-` key press', async () => {
        await renderFixture('DataGrid/KeyboardEditNumber');

        await page.click('[role="gridcell"][data-field="age"]');
        await page.keyboard.press('-');

        expect(
          await page.locator('[role="gridcell"][data-field="age"] input').inputValue(),
        ).to.equal('');
      });

      // https://github.com/mui/mui-x/issues/9195
      it('should not paste "v" on Ctrl+V press', async () => {
        await renderFixture('DataGrid/KeyboardEditInput');

        await page.click('[role="gridcell"][data-field="brand"]');
        await page.keyboard.press('Control+v');

        expect(
          await page.locator('[role="gridcell"][data-field="brand"] input').inputValue(),
        ).not.to.equal('v');
      });

      // https://github.com/mui/mui-x/issues/12705
      it('should not crash if the date is invalid', async () => {
        await renderFixture('DataGrid/KeyboardEditDate');

        await page.hover('div[role="columnheader"][data-field="birthday"]');
        await page.click(
          'div[role="columnheader"][data-field="birthday"] button[aria-label="Menu"]',
        );
        await page.click('"Filter"');
        await page.keyboard.type('08/04/2024', { delay: 10 });

        let thrownError: Error | null = null;
        context.once('weberror', (webError: WebError) => {
          thrownError = webError.error();
          console.error(thrownError);
        });

        await page.keyboard.press('Backspace');

        await sleep(200);
        expect(thrownError).to.equal(null);
      });

      // https://github.com/mui/mui-x/issues/12290
      it('should properly set the width of a group header if the resize happened in a group with fluid columns', async () => {
        await renderFixture('DataGrid/ResizeWithFlex');

        const headers = await page.locator('.MuiDataGrid-columnHeaders > div').all();
        const columnHeader = headers.pop()!;

        const columns = columnHeader.locator('.MuiDataGrid-columnHeader');
        const separators = await columnHeader
          .locator('.MuiDataGrid-columnSeparator--resizable')
          .all();

        const moveSeparator = async (separator: Locator) => {
          const boundingBox = (await separator?.boundingBox())!;
          const x = boundingBox.x + boundingBox.width / 2;
          const y = boundingBox.y + boundingBox.height / 2;

          await page.mouse.move(x, y, { steps: 5 });
          await page.mouse.down();
          await page.mouse.move(x - 20, y, { steps: 5 });
          await page.mouse.up();
        };

        await moveSeparator(separators[0]);
        await moveSeparator(separators[1]);

        const groupHeaderWidth = await headers[0]
          .locator('.MuiDataGrid-columnHeader--filledGroup')
          .first()
          .evaluate((node) => node.clientWidth);
        const subGroupHeaderWidth = await headers[1]
          .locator('.MuiDataGrid-columnHeader--filledGroup')
          .first()
          .evaluate((node) => node.clientWidth);

        const groupHeaderColumnsTotalWidth = await columns.evaluateAll((elements) =>
          // last column is not part of the group
          elements.slice(0, -1).reduce((acc, element) => acc + element.clientWidth, 0),
        );
        const subGroupHeaderColumnsTotalWidth = await columns.evaluateAll((elements) =>
          // first and last columns are not part of the sub-group
          elements.slice(1, -1).reduce((acc, element) => acc + element.clientWidth, 0),
        );

        expect(groupHeaderWidth).to.equal(groupHeaderColumnsTotalWidth);
        expect(subGroupHeaderWidth).to.equal(subGroupHeaderColumnsTotalWidth);
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

          // assert that the dialog closes after selection is complete
          // could run into race condition otherwise
          await page.waitForSelector('[role="dialog"]', { state: 'detached' });
          expect(await page.getByRole('textbox', { includeHidden: true }).inputValue()).to.equal(
            '04/11/2022',
          );
        });

        // assertion for: https://github.com/mui/mui-x/issues/12652
        it('should allow field editing after opening and closing the picker', async () => {
          await renderFixture('DatePicker/BasicClearableDesktopDatePicker');
          // open picker
          await page.getByRole('button').click();
          await page.waitForSelector('[role="dialog"]', { state: 'attached' });
          // close picker
          await page.getByRole('button', { name: 'Choose date' }).click();
          await page.waitForSelector('[role="dialog"]', { state: 'detached' });

          // click on the input to focus it
          await page.getByRole('textbox').click();

          // test that the input value is set after focus
          expect(await page.getByRole('textbox').inputValue()).to.equal('MM/DD/YYYY');
        });

        it('should allow filling in a value and clearing a value', async () => {
          await renderFixture('DatePicker/BasicDesktopDatePicker');

          const input = page.getByRole('textbox', { includeHidden: true });

          await page.locator(`.${pickersSectionListClasses.root}`).click();
          await page.getByRole(`spinbutton`, { name: 'Month' }).fill('04');
          await page.getByRole(`spinbutton`, { name: 'Day' }).fill('11');
          await page.getByRole(`spinbutton`, { name: 'Year' }).fill('2022');

          expect(await input.inputValue()).to.equal('04/11/2022');

          await page.keyboard.press('Control+a');
          expect(await page.evaluate(() => document.getSelection()?.toString())).to.equal(
            '04/11/2022',
          );

          await page.keyboard.press('Delete');
          expect(await input.inputValue()).to.equal('');
        });

        it('should handle change event on the input', async () => {
          await renderFixture('DatePicker/BasicDesktopDatePicker');

          const input = page.getByRole('textbox', { includeHidden: true });

          await page.locator(`.${pickersSectionListClasses.root}`).click();
          await input.fill('02/12/2020');

          expect(
            await page.getByRole('button', { name: /Choose date/ }).getAttribute('aria-label'),
          ).to.equal('Choose date, selected date is Feb 12, 2020');
        });

        it('should allow pasting a section', async () => {
          if (
            // Only firefox is capable of reliably running this test in CI and headless browsers
            (browserType.name() !== 'firefox' && process.env.CIRCLECI) ||
            // chromium seems to fail when running this test locally in headless mode
            (browserType.name() === 'chromium' && !process.env.CIRCLECI)
          ) {
            return;
          }
          await renderFixture('DatePicker/BasicDesktopDatePicker');

          const input = page.getByRole('textbox', { includeHidden: true });

          const isMac = platform() === 'darwin';
          const modifier = isMac ? 'Meta' : 'Control';

          const monthSection = page.getByRole(`spinbutton`, { name: 'Month' });
          const daySection = page.getByRole(`spinbutton`, { name: 'Day' });
          const yearSection = page.getByRole(`spinbutton`, { name: 'Year' });

          await page.locator(`.${pickersSectionListClasses.root}`).click();
          await monthSection.fill('04');
          await daySection.fill('11');
          await yearSection.fill('2022');

          // move to day section
          await yearSection.press('ArrowLeft');
          // copy day section value
          await daySection.press(`${modifier}+KeyC`);
          // move to month section
          await daySection.press('ArrowLeft');
          // initiate search query on month section
          await monthSection.press('1');
          // paste day section value to month section
          await monthSection.press(`${modifier}+KeyV`);

          expect(await input.inputValue()).to.equal('11/11/2022');

          // move back to month section
          await daySection.press('ArrowLeft');
          // check that the search query has been cleared after pasting
          await monthSection.press('2');
          expect(await input.inputValue()).to.equal('02/11/2022');
        });

        it('should focus the first field section after clearing a value', async () => {
          await renderFixture('DatePicker/BasicDesktopDatePicker');

          const monthSection = page.getByRole('spinbutton', { name: 'Month' });
          await monthSection.press('2');
          await page.getByRole('button', { name: 'Clear value' }).click();

          expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('MM');
        });

        it('should focus the first field section after clearing a value in v6 input', async () => {
          await renderFixture('DatePicker/BasicClearableDesktopDatePicker');

          const textbox = page.getByRole('textbox');
          // locator.fill('2') does not work reliably for this case in all browsers
          await textbox.focus();
          await textbox.press('2');
          await page.getByRole('button', { name: 'Clear value' }).click();

          // firefox does not support document.getSelection().toString() on input elements
          if (browserType.name() === 'firefox') {
            expect(
              await page.evaluate(() => {
                return (
                  document.activeElement?.tagName === 'INPUT' &&
                  // only focused input has value set
                  (document.activeElement as HTMLInputElement)?.value === 'MM/DD/YYYY'
                );
              }),
            ).to.equal(true);
          } else {
            expect(await page.evaluate(() => document.getSelection()?.toString())).to.equal('MM');
          }
        });

        it('should submit a form when clicking "Enter" key', async () => {
          await renderFixture('DatePicker/DesktopDatePickerForm');

          const textbox = page.getByRole('textbox');
          await textbox.focus();
          await textbox.press('Enter');

          expect(await page.getByRole('textbox').inputValue()).to.equal('04/17/2022');
          const status = page.getByRole('status');
          expect(await status.isVisible()).to.equal(true);
          expect(await status.textContent()).to.equal('Submitted: 04/17/2022');
        });

        // TODO: enable when v7 fields form submitting is fixed
        // it('should submit a form when clicking "Enter" key with v7 field', async () => {
        //   await renderFixture('DatePicker/DesktopDatePickerFormV7');

        //   const monthSpinbutton = page.getByRole(`spinbutton`, { name: 'Month' });
        //   await monthSpinbutton.focus();
        //   await monthSpinbutton.press('Enter');

        //   expect(await page.getByRole('textbox', { includeHidden: true }).inputValue()).to.equal(
        //     '04/17/2022',
        //   );
        //   const status = page.getByRole('status');
        //   expect(await status.isVisible()).to.equal(true);
        //   expect(await status.textContent()).to.equal('Submitted: 04/17/2022');
        // });

        it('should correctly select a day in a calendar with "AdapterMomentJalaali"', async () => {
          await renderFixture('DatePicker/MomentJalaliDateCalendar');

          await page.getByRole('gridcell', { name: '11' }).click();

          const day11 = page.getByRole('gridcell', { name: '11' });
          expect(await day11.getAttribute('aria-selected')).to.equal('true');
          // check that selecting a day doesn't change the day text
          expect(await day11.textContent()).to.equal('11');
        });
      });

      describe('<MobileDatePicker />', () => {
        it('should allow selecting a value', async () => {
          await renderFixture('DatePicker/BasicMobileDatePicker');

          // Old selector: await page.getByRole('textbox').click({ position: { x: 10, y: 2 } });
          await page
            .locator(`.${pickersTextFieldClasses.root}`)
            .click({ position: { x: 10, y: 2 } });
          await page.getByRole('gridcell', { name: '11' }).click();
          await page.getByRole('button', { name: 'OK' }).click();

          await waitFor(async () => {
            // assert that the dialog has been closed and the focused element is the input
            expect(await page.evaluate(() => document.activeElement?.className)).to.contain(
              pickersSectionListClasses.sectionContent,
            );
          });
          expect(await page.getByRole('textbox', { includeHidden: true }).inputValue()).to.equal(
            '04/11/2022',
          );
        });

        it('should have consistent `placeholder` and `value` behavior', async () => {
          await renderFixture('DatePicker/MobileDatePickerV6WithClearAction');

          const input = page.getByRole('textbox');

          await input.click({ position: { x: 10, y: 2 } });
          await page.getByRole('button', { name: 'Clear' }).click();

          await input.blur();
          expect(await input.getAttribute('placeholder')).to.equal('MM/DD/YYYY');
          expect(await input.inputValue()).to.equal('');
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

        // assert that the dialog closes after selection is complete
        // could run into race condition otherwise
        await page.waitForSelector('[role="dialog"]', { state: 'detached' });
        expect(await page.getByRole('textbox', { includeHidden: true }).inputValue()).to.equal(
          '04/11/2022 03:30 PM',
        );
      });

      it('should allow selecting same view multiple times with keyboard', async () => {
        await renderFixture('DatePicker/BasicDesktopDateTimePicker');

        await page.getByRole('button').click();

        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Enter');

        // move back to date calendar
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Enter');

        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Enter');

        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Enter');

        // check that the picker has not been closed
        await page.waitForSelector('[role="dialog"]', { state: 'visible' });

        // Change the hours
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        // check that the picker has not been closed
        await page.waitForSelector('[role="dialog"]', { state: 'visible' });

        // Change the minutes
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        // Change the meridiem
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        // assert that the dialog closes after selection is complete
        // could run into race condition otherwise
        await page.waitForSelector('[role="dialog"]', { state: 'detached' });
        expect(await page.getByRole('textbox', { includeHidden: true }).inputValue()).to.equal(
          '04/21/2022 02:05 PM',
        );
      });

      it('should correctly select hours section when there are no time renderers', async () => {
        await renderFixture('DatePicker/DesktopDateTimePickerNoTimeRenderers');

        await page.getByRole('button').click();

        await page.getByRole('gridcell', { name: '11' }).click();

        // assert that the hours section has been selected using two APIs
        await waitFor(async () => {
          expect(await page.evaluate(() => document.getSelection()?.toString())).to.equal('12');
          expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('12');
        });
      });

      it('should correctly select hours section when there are no time renderers on v6', async () => {
        // The test is flaky on webkit
        if (browserType.name() === 'webkit') {
          return;
        }
        await renderFixture(
          'DatePicker/DesktopDateTimePickerNoTimeRenderers?enableAccessibleFieldDOMStructure=false',
        );

        await page.getByRole('button').click();
        await page.getByRole('gridcell', { name: '11' }).click();

        // assert that the hours section has been selected using two APIs
        await waitFor(async () => {
          // firefox does not support document.getSelection().toString() on input elements
          if (browserType.name() === 'firefox') {
            expect(
              await page.evaluate(
                () => (document.activeElement as HTMLInputElement | null)?.selectionStart,
              ),
            ).to.equal(11);
          } else {
            expect(await page.evaluate(() => document.getSelection()?.toString())).to.equal('12');
          }
        });
      });
    });

    describe('<DateRangePicker />', () => {
      it('should allow selecting a range value', async () => {
        // firefox in CI is not happy with this test
        if (browserType.name() === 'firefox') {
          return;
        }
        await renderFixture('DatePicker/BasicDesktopDateRangePicker');

        // Old selector: await page.getByRole('textbox', { name: 'Start' }).click();
        await page.locator(`.${pickersSectionListClasses.root}`).first().click();

        await page.getByRole('gridcell', { name: '11' }).first().click();
        await page.getByRole('gridcell', { name: '17' }).last().click();

        // assert that the tooltip closes after selection is complete
        await page.waitForSelector('[role="tooltip"]', { state: 'detached' });

        expect(
          await page.getByRole('textbox', { name: 'Start', includeHidden: true }).inputValue(),
        ).to.equal('04/11/2022');
        expect(
          await page.getByRole('textbox', { name: 'End', includeHidden: true }).inputValue(),
        ).to.equal('05/17/2022');
      });

      it('should not close the tooltip when the focus switches between inputs', async () => {
        // firefox in CI is not happy with this test
        if (browserType.name() === 'firefox') {
          return;
        }
        await renderFixture('DatePicker/BasicDesktopDateRangePicker');

        // Old selector: await page.getByRole('textbox', { name: 'Start' }).click();
        await page.locator(`.${pickersSectionListClasses.root}`).first().click();

        // assert that the tooltip has been opened
        await page.waitForSelector('[role="tooltip"]', { state: 'attached' });

        // Old selector: await page.getByRole('textbox', { name: 'End' }).click();
        await page.locator(`.${pickersSectionListClasses.root}`).last().click();

        // assert that the tooltip has not been closed after changing the active input
        await page.waitForSelector('[role="tooltip"]', { state: 'visible' });

        await page.keyboard.press('Escape');

        await page.waitForSelector('[role="tooltip"]', { state: 'detached' });
      });

      it('should have the same selection process when "readOnly" with single input v7 field', async () => {
        // firefox in CI is not happy with this test
        if (browserType.name() === 'firefox') {
          return;
        }

        await renderFixture('DatePicker/ReadonlyDesktopDateRangePickerSingleV7');

        await page.locator(`.${pickersSectionListClasses.root}`).first().click();

        // assert that the tooltip has been opened
        await page.waitForSelector('[role="tooltip"]', { state: 'attached' });

        await page.getByRole('gridcell', { name: '11' }).first().click();
        await page.getByRole('gridcell', { name: '13' }).first().click();

        // assert that the tooltip closes after selection is complete
        await page.waitForSelector('[role="tooltip"]', { state: 'detached' });

        expect(await page.getByRole('textbox', { includeHidden: true }).inputValue()).to.equal(
          '04/11/2022 – 04/13/2022',
        );
      });

      it('should have the same selection process when "readOnly" with single input v6 field', async () => {
        // firefox in CI is not happy with this test
        if (browserType.name() === 'firefox') {
          return;
        }

        await renderFixture('DatePicker/ReadonlyDesktopDateRangePickerSingleV6');

        await page.getByRole('textbox').click();

        // assert that the tooltip has been opened
        await page.waitForSelector('[role="tooltip"]', { state: 'attached' });

        await page.getByRole('gridcell', { name: '11' }).first().click();
        await page.getByRole('gridcell', { name: '13' }).first().click();

        // assert that the tooltip closes after selection is complete
        await page.waitForSelector('[role="tooltip"]', { state: 'detached' });

        expect(await page.getByRole('textbox').inputValue()).to.equal('04/11/2022 – 04/13/2022');
      });

      it('should not change timezone when changing the start date from non DST to DST', async () => {
        // firefox in CI is not happy with this test
        if (browserType.name() === 'firefox') {
          return;
        }
        const thrownErrors: string[] = [];
        context.on('weberror', (webError) => {
          thrownErrors.push(webError.error().message);
        });

        await renderFixture('DatePicker/SingleDesktopDateRangePickerWithTZ');

        // open the picker
        await page.getByRole('group').click();

        await page.getByRole('spinbutton', { name: 'Month' }).first().press('ArrowDown');

        expect(thrownErrors).not.to.contain(
          'MUI X: The timezone of the start and the end date should be the same.',
        );
      });
    });
  });
});

describe('e2e: chromium on Android', () => {
  before(async function beforeHook() {
    this.timeout(20000);

    await initializeEnvironment(chromium, devices['Pixel 5']);
  });

  after(async () => {
    await context.close();
    await browser.close();
  });

  it('should allow re-selecting value to have the same start and end date', async () => {
    await renderFixture('DatePicker/BasicDesktopDateRangePicker');

    // Old selector: await page.getByRole('textbox', { name: 'Start' }).tap();
    await page.locator(`.${pickersSectionListClasses.root}`).first().tap();

    await page.getByRole('gridcell', { name: '11' }).first().tap();
    await page.getByRole('gridcell', { name: '17' }).first().tap();

    const toolbarButtons = await page.getByRole('button', { name: /Apr/ }).all();
    expect(await toolbarButtons[0].textContent()).to.equal('Apr 11');
    expect(await toolbarButtons[1].textContent()).to.equal('Apr 17');

    // tap twice on the same date to select a range within one day
    const april11 = page.getByRole('gridcell', { name: '11' }).first();
    await april11.tap();
    await april11.tap();

    expect(await toolbarButtons[0].textContent()).to.equal('Apr 11');
    expect(await toolbarButtons[1].textContent()).to.equal('Apr 11');
  });
});
