import { getStoryPage, startBrowser } from './helper-fn';

describe('Mouse Interactions', () => {
  let page;
  let browser;

  beforeAll(async (done) => {
    browser = await startBrowser();
    done();
  });
  beforeEach(async (done) => {
    page = await getStoryPage(browser, '/story/x-grid-tests-reorder--reorder-small-dataset', true);
    done();
  });

  afterEach(async (done) => {
    await page.close();
    done();
  });

  afterAll(async (done) => {
    await browser.close();
    done();
  });

  test('Column reorder by drag and drop', async (done) => {
    async function dragAndDrop() {
      await page.evaluate(() => {
        const source = document.querySelectorAll('.MuiDataGrid-colCell-draggable')[0];
        const target = document.querySelectorAll('.MuiDataGrid-colCell-draggable')[1];

        // Trigger 'dragstart' event on the source element
        const dragstartEvent: any = document.createEvent('CustomEvent');
        dragstartEvent.initCustomEvent('dragstart', true, true, null);
        dragstartEvent.clientX = source.getBoundingClientRect().top;
        dragstartEvent.clientY = source.getBoundingClientRect().left;
        source.dispatchEvent(dragstartEvent);

        // Trigger 'dragover' event on the target element
        const dragenterEvent: any = document.createEvent('CustomEvent');
        dragenterEvent.initCustomEvent('dragenter', true, true, null);
        dragenterEvent.clientX = target.getBoundingClientRect().top;
        dragenterEvent.clientY = target.getBoundingClientRect().left;
        target.dispatchEvent(dragenterEvent);

        // Trigger 'dragend' event on the target element
        const dragendEvent: any = document.createEvent('CustomEvent');
        dragendEvent.initCustomEvent('dragend', true, true, null);
        dragendEvent.clientX = target.getBoundingClientRect().top;
        dragendEvent.clientY = target.getBoundingClientRect().left;
        target.dispatchEvent(dragendEvent);
      });
    }

    const firstTodo = await page.evaluate(() =>
      document.querySelectorAll('.MuiDataGrid-colCell')[0].getAttribute('data-field'),
    );
    const secondTodo = await page.evaluate(() =>
      document.querySelectorAll('.MuiDataGrid-colCell')[1].getAttribute('data-field'),
    );

    dragAndDrop();
    await page.waitFor(100);

    const newFirstTodo = await page.evaluate(() =>
      document.querySelectorAll('.MuiDataGrid-colCell')[0].getAttribute('data-field'),
    );
    const newSecondTodo = await page.evaluate(() =>
      document.querySelectorAll('.MuiDataGrid-colCell')[1].getAttribute('data-field'),
    );

    expect(newFirstTodo).toEqual(secondTodo);
    expect(newSecondTodo).toEqual(firstTodo);

    done();
  });
});
