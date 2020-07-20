import { snapshotTest } from './helper-fn';

jest.setTimeout(30000);

const stories = [
  '/story/x-grid-tests-columns--small-col-sizes',
  '/story/x-grid-tests-columns--very-small-col-sizes',
  {
    path: '/story/x-grid-tests-columns--column-description-tooltip',
    beforeTest: async page => {
      await page.hover(
        '.grid-root .columns-container .material-col-cell-wrapper .material-col-cell:nth-child(2) .title',
      );
    },
  },
  '/story/x-grid-tests-columns--hidden-columns',
  '/story/x-grid-tests-columns--update-columns-btn',
  {
    path: '/story/x-grid-tests-columns--update-columns-btn',
    beforeTest: async page => {
      await page.click('#action-btn');
    },
  },
  '/story/x-grid-tests-columns--header-component',
  '/story/x-grid-tests-dataset--no-rows',
  '/story/x-grid-tests-dataset--no-rows-no-cols',
  '/story/x-grid-tests-dataset--loading-rows',
  '/story/x-grid-tests-dataset--no-rows-auto-height',
  '/story/x-grid-tests-dataset--no-rows-no-cols-auto-height',
  '/story/x-grid-tests-dataset--loading-rows-auto-height',
  '/story/x-grid-tests-dataset--vertical-scroll',
  '/story/x-grid-tests-dataset--horizontal-scroll',
  '/story/x-grid-tests-dataset--both-scroll',
  '/story/x-grid-tests-dataset--both-scroll-no-extend-and-borders',
  '/story/x-grid-tests-dataset--grid-20-by-2',
  '/story/x-grid-tests-dataset--grid-100-by-100',

  '/story/x-grid-tests-options--no-row-extend',
  '/story/x-grid-tests-options--no-row-extend-cell-border',
  '/story/x-grid-tests-options--auto-height-small',
  '/story/x-grid-tests-options--auto-height-large',
  '/story/x-grid-tests-options--column-separator',

  '/story/x-grid-tests-pagination--pagination-default',
  '/story/x-grid-tests-pagination--hidden-pagination',
  '/story/x-grid-tests-pagination--page-size-100',
  '/story/x-grid-tests-pagination--hidden-pagination',
  '/story/x-grid-tests-pagination--pagination-api-tests', // TODO click btns',
  '/story/x-grid-tests-pagination--auto-pagination', // TODO click btns',

  '/story/x-grid-tests-resize--resize-small-dataset',
  '/story/x-grid-tests-resize--resize-large-dataset',

  '/story/x-grid-tests-selection--api-pre-selected-rows',

  '/story/x-grid-tests-sorting--string-sorting-desc',
  '/story/x-grid-tests-sorting--string-sorting-asc',

  '/story/x-grid-tests-sorting--number-sorting-asc',
  '/story/x-grid-tests-sorting--number-sorting-desc',
  '/story/x-grid-tests-sorting--date-sorting-asc',
  '/story/x-grid-tests-sorting--date-sorting-desc',
  '/story/x-grid-tests-sorting--date-time-sorting-asc',
  '/story/x-grid-tests-sorting--date-time-sorting-desc',
  '/story/x-grid-tests-sorting--multiple-sorting',
  '/story/x-grid-tests-sorting--multiple-and-sort-index',
  '/story/x-grid-tests-sorting--unsortable-last-col',
  '/story/x-grid-tests-sorting--custom-comparator',
  '/story/x-grid-tests-sorting--sorting-with-formatter',
  '/story/x-grid-tests-sorting--api-single-sorted',
  '/story/x-grid-tests-sorting--api-multiple-sorted',
  '/story/x-grid-tests-sorting--sorted-events-api',

  '/story/x-grid-tests-styling--big-rows-and-header',
  '/story/x-grid-tests-styling--unset',
  '/story/x-grid-tests-styling--small',
  '/story/x-grid-tests-styling--column-cell-class',
  '/story/x-grid-tests-styling--column-header-class',
  '/story/x-grid-tests-styling--column-cell-class-rules',
  '/story/x-grid-tests-styling--column-cell-renderer',
];

describe.only('snapshotTest', () => {
  stories.forEach((config: any) => {
    const path = typeof config === 'string' ? config : config.path;
    const beforeTest = typeof config === 'string' ? undefined : config.beforeTest;

    test(path, async done => {
      await snapshotTest(path, beforeTest);
      done();
    });
  });
});
