const puppeteer = require('puppeteer');

export async function getStoryPage(path: string, withClipboard = false): Promise<{ page: any; browser: any }> {
  const browser = await puppeteer.launch({
    args: ['--disable-lcd-text'],
    defaultViewport: { width: 1600, height: 900 },
    // headless: false
  });
  const url = `http://localhost:6006/iframe.html?path=${path}`;
  if (withClipboard) {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(url, ['clipboard-read']);
  }
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('.grid-root');

  return { page, browser };
}

export const activeCell = (rowIndex: number, colIndex: number): boolean => {
  return (
  	document &&
    document.activeElement?.getAttribute('data-rowindex') === rowIndex.toString() &&
    document.activeElement?.getAttribute('data-colindex') === colIndex.toString()
  );
};
