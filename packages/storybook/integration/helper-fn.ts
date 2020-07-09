const puppeteer = require('puppeteer');

export const NO_ANIM_CSS = `
:not(iframe) *,
:not(iframe) *::before,
:not(iframe) *::after {
    -moz-transition: none !important;
    transition: none !important;
    -moz-animation: none !important;
    animation: none !important;
    caret-color: transparent !important;
}
`;

export async function startBrowser() {
  const browser = await puppeteer.launch({
    args: ['--disable-lcd-text'],
    defaultViewport: { width: 1600, height: 900 },
    // headless: false
  });
  return browser;
}

export async function getStoryPage(
  browser: any,
  path: string,
  withClipboard = false,
): Promise<any> {
  const url = `http://localhost:6006/iframe.html?path=${path}`;
  if (withClipboard) {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(url, ['clipboard-read']);
  }
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('.grid-root');

  return page;
}

export async function snapshotTest(
  path: string,
  beforeTest?: (page) => Promise<void>,
): Promise<void> {
  const browser = await startBrowser();
  const page = await getStoryPage(browser, path);
  await page.addStyleTag({ content: NO_ANIM_CSS });

  if (beforeTest) {
    await beforeTest(page);
  }

  const image = await page.screenshot();
  expect(image).toMatchImageSnapshot();
  await page.close();
  await browser.close();
}

export const activeCell = (rowIndex: number, colIndex: number): boolean => {
  return (
    document &&
    document.activeElement?.getAttribute('data-rowindex') === rowIndex.toString() &&
    document.activeElement?.getAttribute('data-colindex') === colIndex.toString()
  );
};
