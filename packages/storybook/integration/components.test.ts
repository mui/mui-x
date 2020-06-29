import { getStoryPage } from './helper-fn';

jest.setTimeout(30000);

const NO_ANIM_CSS = `
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

describe('Components override', () => {
  test('Loading', async done => {
    const {page, browser} = await getStoryPage('/story/x-grid-demos-custom-components--loading');
    await page.addStyleTag({content: NO_ANIM_CSS});

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await page.close();
    await browser.close();
    done();
  });
  test('No rows', async done => {
    const {page, browser} = await getStoryPage('/story/x-grid-demos-custom-components--no-rows');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await page.close();
    await browser.close();
    done();
  });
  test('Icons', async done => {
    const {page, browser} = await getStoryPage('/story/x-grid-demos-custom-components--icons');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await page.close();
    await browser.close();
    done();
  });
  test('Pagination', async done => {
    const {page, browser} = await getStoryPage('/story/x-grid-demos-custom-components--custom-pagination');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await page.close();
    await browser.close();
    done();
  });
  test('Footer', async done => {
    const {page, browser} = await getStoryPage('/story/x-grid-demos-custom-components--custom-footer');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await page.close();
    await browser.close();
    done();
  });
  test('Header & Footer', async done => {
    const {page, browser} = await getStoryPage('/story/x-grid-demos-custom-components--header-and-footer');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await page.close();
    await browser.close();
    done();
  });
  test('Styled Columns', async done => {
    const {page, browser} = await getStoryPage('/story/x-grid-demos-custom-components--styled-columns');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await page.close();
    await browser.close();
    done();
  });
});
