import { snapshotTest } from './helper-fn';

jest.setTimeout(30000);

describe('Components override', () => {
  test('Loading', async done => {
    await snapshotTest('/story/x-grid-demos-custom-components--loading');
    done();
  });
  test('No rows', async done => {
    await snapshotTest('/story/x-grid-demos-custom-components--no-rows');
    done();
  });
  test('Icons', async done => {
    await snapshotTest('/story/x-grid-demos-custom-components--icons');
    done();
  });
  test('Pagination', async done => {
    await snapshotTest('/story/x-grid-demos-custom-components--custom-pagination');
    done();
  });
  test('Footer', async done => {
    await snapshotTest('/story/x-grid-demos-custom-components--custom-footer');
    done();
  });
  test('Header & Footer', async done => {
    await snapshotTest('/story/x-grid-demos-custom-components--header-and-footer');
    done();
  });
  test('Styled Columns', async done => {
    await snapshotTest('/story/x-grid-demos-custom-components--styled-columns');
    done();
  });
});
