const puppeteer = require('puppeteer');
jest.setTimeout(30000);

async function getStoryPage(path: string) {
  const browser = await puppeteer.launch({
    args: ['--disable-lcd-text'],
    defaultViewport: { width: 1600, height: 900 },
    // headless: false
  });
  const url = `http://localhost:6006/iframe.html?path=${path}`;
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(url, ['clipboard-read']);

  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('.grid-root');

  return { page, browser };
}

describe('Keyboard Navigation', () => {
  let page, browser;

  beforeEach(async done => {
    const story = await getStoryPage('/story/x-grid-tests-columns--small-col-sizes');
    page = story.page;
    browser = story.browser;
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.waitFor(100);
    done();
  });

  afterEach(async done => {
    await page.close();
    await browser.close();
    done();
  });

  test('Cell navigation with arrows ', async done => {
    await page.keyboard.press('ArrowRight');
    await page.waitFor(100);
    await page.keyboard.press('ArrowRight');
    await page.waitFor(100);
    await page.keyboard.press('ArrowRight');
    await page.waitFor(100);
    await page.keyboard.press('ArrowDown');
    await page.waitFor(100);
    await page.keyboard.press('ArrowDown');
    await page.waitFor(100);
    await page.keyboard.press('ArrowLeft');
    await page.waitFor(100);
    await page.keyboard.press('ArrowUp');
    await page.waitFor(100);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    done();
  });

  test('Home / End navigation', async done => {
    await page.keyboard.press('End');
    await page.waitFor(100);
    const imageEnd = await page.screenshot();
    expect(imageEnd).toMatchImageSnapshot();
    await page.keyboard.press('Home');
    await page.waitFor(100);

    const imageHome = await page.screenshot();
    expect(imageHome).toMatchImageSnapshot();
    done();
  });

  test('CTRL Home / End navigation ', async done => {
    await page.keyboard.down('Control');
    await page.waitFor(100);
    await page.keyboard.press('End');
    await page.waitFor(100);
    const imageEnd = await page.screenshot();
    expect(imageEnd).toMatchImageSnapshot();

    await page.keyboard.press('Home');
    await page.keyboard.up('Control');
    await page.waitFor(100);

    const imageHome = await page.screenshot();
    expect(imageHome).toMatchImageSnapshot();
    done();
  });

  test('CTRL A to select all rows', async done => {
    await page.keyboard.down('Control');
    await page.waitFor(100);
    await page.keyboard.press('a');
    await page.waitFor(100);
    const imageEnd = await page.screenshot();
    expect(imageEnd).toMatchImageSnapshot();
    done();
  });

  test('Shift space + arrows to select rows ', async done => {
    await page.keyboard.down('Shift');
    await page.waitFor(100);
    await page.keyboard.press('Space');
    await page.waitFor(100);
    const imageEnd = await page.screenshot();
    expect(imageEnd).toMatchImageSnapshot();

    await page.keyboard.press('ArrowDown');
    await page.waitFor(100);
    await page.keyboard.press('ArrowDown');
    await page.waitFor(100);
    const selectedScreen = await page.screenshot();

    expect(selectedScreen).toMatchImageSnapshot();
    done();
  });

  test('Next/Previous page', async done => {
    await page.keyboard.press('Space');
    await page.waitFor(100);
    const spaceNavImage = await page.screenshot();
    expect(spaceNavImage).toMatchImageSnapshot();

    await page.keyboard.press('PageDown');
    await page.waitFor(100);
    const pageDownNavImage = await page.screenshot();
    expect(pageDownNavImage).toMatchImageSnapshot();

    await page.keyboard.press('PageUp');
    await page.waitFor(100);
    const pageUpImage = await page.screenshot();
    expect(pageUpImage).toMatchImageSnapshot();
    done();
  });

  test('Copy to clipboard', async done => {
    await page.keyboard.down('Shift');
    await page.waitFor(100);
    await page.keyboard.press('Space');
    await page.waitFor(100);
    await page.keyboard.down('Control');
    await page.waitFor(100);
    await page.keyboard.press('c');

    expect(await page.evaluate(() => navigator.clipboard.readText())).toEqual(
      '0\n' +
        'USDGBP\n' +
        '0, 1\n' +
        '0, 2\n' +
        '0, 3\n' +
        '0, 4\n' +
        '0, 5\n' +
        '0, 6\n' +
        '0, 7\n' +
        '0, 8\n' +
        '0, 9\n' +
        '0, 10\n' +
        '0, 11\n' +
        '0, 12\n' +
        '0, 13\n' +
        '0, 14\n' +
        '0, 15\n' +
        '0, 16\n' +
        '0, 17\n' +
        '0, 18\n',
    );
    done();
  });
});
