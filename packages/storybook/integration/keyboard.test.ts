import { activeCell, getStoryPage } from './helper-fn';

describe('Keyboard Navigation', () => {
  let page, browser;
  const waitFnOptions = { timeout: 500 };

  beforeEach(async done => {
    const story = await getStoryPage('/story/x-grid-tests-columns--small-col-sizes', true);
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
    await page.waitForFunction(activeCell, waitFnOptions, 0, 1);

    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(activeCell, waitFnOptions, 0, 2);

    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(activeCell, waitFnOptions, 0, 3);

    await page.keyboard.press('ArrowDown');
    await page.waitForFunction(activeCell, waitFnOptions, 1, 3);

    await page.keyboard.press('ArrowDown');
    await page.waitForFunction(activeCell, waitFnOptions, 2, 3);

    await page.keyboard.press('ArrowLeft');
    await page.waitForFunction(activeCell, waitFnOptions, 2, 2);

    await page.keyboard.press('ArrowUp');
    await page.waitForFunction(activeCell, waitFnOptions, 1, 2);

    done();
  });

  test('Home / End navigation', async done => {
    await page.keyboard.press('End');
    await page.waitForFunction(activeCell, waitFnOptions, 0, 19);

    await page.keyboard.press('Home');
    await page.waitForFunction(activeCell, waitFnOptions, 0, 0);

    done();
  });

  test('CTRL Home / End navigation ', async done => {
    await page.keyboard.down('Control');
    await page.waitFor(100);
    await page.keyboard.press('End');
    await page.waitForFunction(activeCell, waitFnOptions, 99, 19);

    await page.keyboard.press('Home');
    await page.waitFor(100);
    await page.keyboard.up('Control');
    await page.waitForFunction(activeCell, waitFnOptions, 0, 0);

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
    await page.waitForFunction(activeCell, waitFnOptions, 15, 0);

    await page.keyboard.press('PageDown');
    await page.waitForFunction(activeCell, waitFnOptions, 30, 0);

    await page.keyboard.press('PageUp');
    await page.waitForFunction(activeCell, waitFnOptions, 15, 0);

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
