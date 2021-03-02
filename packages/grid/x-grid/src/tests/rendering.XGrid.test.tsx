import { useDemoData } from '@material-ui/x-grid-data-generator';
import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
import { expect } from 'chai';
import { XGrid } from '@material-ui/x-grid';

describe('<XGrid /> - Rendering', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  let rendering: any;
  let containerSizes: any;
  let viewportSizes: any;
  let scrollBar: any;

  function RenderingTest(props) {
    const { data } = useDemoData({
      dataSet: 'Commodity',
      rowLength: 500,
    });

    return (
      <div style={{ width: 600, height: 600 }}>
        <XGrid
          rows={data.rows}
          columns={data.columns}
          onStateChange={(params) => {
            rendering = params.state.rendering;
            containerSizes = params.state.containerSizes;
            viewportSizes = params.state.viewportSizes;
            scrollBar = params.state.scrollBar;
          }}
          {...props}
        />
      </div>
    );
  }

  beforeEach(() => {
    rendering = null;
    containerSizes = null;
    viewportSizes = null;
    scrollBar = null;
  });

  it('should render properly', async () => {
    render(<RenderingTest />);
    await waitFor(() => expect(containerSizes).to.not.be.null);

    const expectedRendering = {
      realScroll: { left: 0, top: 0 },
      renderContext: {
        leftEmptyWidth: 0,
        rightEmptyWidth: 2730,
        firstColIdx: 0,
        lastColIdx: 6,
        page: 0,
        firstRowIdx: 0,
        lastRowIdx: 18,
        paginationCurrentPage: 0,
        pageSize: 100,
      },
      renderingZoneScroll: { left: 0, top: 0 },
      virtualPage: 0,
      virtualRowsCount: 0,
      renderedSizes: {
        virtualRowsCount: 500,
        renderingZonePageSize: 18,
        viewportPageSize: 9,
        totalSizes: { width: 3630, height: 26443.77777777778 },
        dataContainerSizes: { width: 3615, height: 26443.77777777778 },
        renderingZone: { width: 3615, height: 1003 },
        windowSizes: { width: 598, height: 490 },
        lastPage: 56,
      },
    };
    const expectedContainerSizes = {
      virtualRowsCount: 500,
      renderingZonePageSize: 18,
      viewportPageSize: 9,
      totalSizes: { width: 3630, height: 26443.77777777778 },
      dataContainerSizes: { width: 3615, height: 26443.77777777778 },
      renderingZone: { width: 3615, height: 1003 },
      windowSizes: { width: 598, height: 490 },
      lastPage: 56,
    };

    const expectedViewportSize = { width: 583, height: 475 };
    const expectedScrollbar = {
      hasScrollX: true,
      hasScrollY: true,
      scrollBarSize: { y: 15, x: 15 },
    };
    expect(rendering).to.deep.equal(expectedRendering);
    expect(containerSizes).to.deep.equal(expectedContainerSizes);
    expect(viewportSizes).to.deep.equal(expectedViewportSize);
    expect(scrollBar).to.deep.equal(expectedScrollbar);
  });
  it('should render properly with pagination and pagesize 100', async () => {
    render(<RenderingTest pagination pageSize={100} />);
    await waitFor(() => expect(containerSizes).to.not.be.null);

    const expectedRendering = {
      realScroll: { left: 0, top: 0 },
      renderContext: {
        leftEmptyWidth: 0,
        rightEmptyWidth: 2730,
        firstColIdx: 0,
        lastColIdx: 6,
        page: 0,
        firstRowIdx: 0,
        lastRowIdx: 18,
        paginationCurrentPage: 0,
        pageSize: 100,
      },
      renderingZoneScroll: { left: 0, top: 0 },
      virtualPage: 0,
      virtualRowsCount: 0,
      renderedSizes: {
        virtualRowsCount: 100,
        renderingZonePageSize: 18,
        viewportPageSize: 9,
        totalSizes: { width: 3630, height: 5333.555555555555 },
        dataContainerSizes: { width: 3615, height: 5333.555555555555 },
        renderingZone: { width: 3615, height: 1003 },
        windowSizes: { width: 598, height: 490 },
        lastPage: 12,
      },
    };
    const expectedContainerSizes = {
      virtualRowsCount: 100,
      renderingZonePageSize: 18,
      viewportPageSize: 9,
      totalSizes: { width: 3630, height: 5333.555555555555 },
      dataContainerSizes: { width: 3615, height: 5333.555555555555 },
      renderingZone: { width: 3615, height: 1003 },
      windowSizes: { width: 598, height: 490 },
      lastPage: 12,
    };
    const expectedViewportSize = { width: 583, height: 475 };
    const expectedScrollbar = {
      hasScrollX: true,
      hasScrollY: true,
      scrollBarSize: { y: 15, x: 15 },
    };
    expect(rendering).to.deep.equal(expectedRendering);
    expect(containerSizes).to.deep.equal(expectedContainerSizes);
    expect(viewportSizes).to.deep.equal(expectedViewportSize);
    expect(scrollBar).to.deep.equal(expectedScrollbar);
  });

  it('should render properly with pagination and autosize', async () => {
    render(<RenderingTest pagination autoPageSize />);
    await waitFor(() => expect(containerSizes).to.not.be.null);

    const expectedRendering = {
      realScroll: { left: 0, top: 0 },
      renderContext: {
        leftEmptyWidth: 0,
        rightEmptyWidth: 2730,
        firstColIdx: 0,
        lastColIdx: 6,
        page: 0,
        firstRowIdx: 0,
        lastRowIdx: 9,
        paginationCurrentPage: 0,
        pageSize: 9,
      },
      renderingZoneScroll: { left: 0, top: 0 },
      virtualPage: 0,
      virtualRowsCount: 0,
      renderedSizes: {
        virtualRowsCount: 9,
        renderingZonePageSize: 18,
        viewportPageSize: 9,
        totalSizes: { width: 3630, height: 475 },
        dataContainerSizes: { width: 3630, height: 475 },
        renderingZone: { width: 3630, height: 1003 },
        windowSizes: { width: 598, height: 490 },
        lastPage: 1,
      },
    };
    const expectedContainerSizes = {
      virtualRowsCount: 9,
      renderingZonePageSize: 18,
      viewportPageSize: 9,
      totalSizes: { width: 3630, height: 475 },
      dataContainerSizes: { width: 3630, height: 475 },
      renderingZone: { width: 3630, height: 1003 },
      windowSizes: { width: 598, height: 490 },
      lastPage: 1,
    };
    const expectedViewportSize = { width: 598, height: 475 };
    const expectedScrollbar = {
      hasScrollX: true,
      hasScrollY: false,
      scrollBarSize: { y: 0, x: 15 },
    };

    expect(rendering).to.deep.equal(expectedRendering);
    expect(containerSizes).to.deep.equal(expectedContainerSizes);
    expect(viewportSizes).to.deep.equal(expectedViewportSize);
    expect(scrollBar).to.deep.equal(expectedScrollbar);
  });
});
