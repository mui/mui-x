import { expect } from 'chai';
import * as playwright from 'playwright';

function sleep(timeoutMS: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeoutMS);
  });
}

/**
 * Attempts page.goto with retries
 *
 * @remarks The server and runner can be started up simultaneously
 * @param page
 * @param url
 */
async function attemptGoto(page: playwright.Page, url: string): Promise<boolean> {
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

describe('e2e', () => {
  const baseUrl = 'http://localhost:5001';
  let browser: playwright.Browser;
  let page: playwright.Page;

  async function renderFixture(fixturePath: string) {
    await page.goto(`${baseUrl}/e2e/${fixturePath}#no-dev`);
  }

  before(async function beforeHook() {
    this.timeout(20000);

    browser = await playwright.chromium.launch({
      headless: true,
    });
    page = await browser.newPage();
    const isServerRunning = await attemptGoto(page, `${baseUrl}#no-dev`);
    if (!isServerRunning) {
      throw new Error(
        `Unable to navigate to ${baseUrl} after multiple attempts. Did you forget to run \`yarn test:e2e:server\` and \`yarn test:e2e:build\`?`,
      );
    }
  });

  after(async () => {
    await browser.close();
  });

  describe('<DataGrid />', () => {
    it('should select the first column header when pressing tab key', async () => {
      await renderFixture('DataGrid/KeyboardNavigationFocus');

      expect(
        await page.evaluate(() => document.activeElement?.getAttribute('data-testid')),
      ).to.equal('initial-focus');

      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('brand');
    });

    it('should implement the roving tabindex pattern', async () => {
      await renderFixture('DataGrid/KeyboardNavigationFocus');

      expect(
        await page.evaluate(() => document.activeElement?.getAttribute('data-testid')),
      ).to.equal('initial-focus');
      await page.keyboard.press('Tab');
      await page.keyboard.press('ArrowDown');
      expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('Nike');
      expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
        'cell',
      );
      await page.keyboard.press('ArrowDown');
      expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('Adidas');
      expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
        'cell',
      );
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('100');
      expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
        'button',
      );
      await page.keyboard.press('Shift+Tab');
      expect(await page.evaluate(() => document.activeElement?.textContent)).to.equal('Adidas');
      expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).to.equal(
        'cell',
      );
      await page.keyboard.press('Shift+Tab');
      expect(
        await page.evaluate(() => document.activeElement?.getAttribute('data-testid')),
      ).to.equal('initial-focus');
    });
  });
});
