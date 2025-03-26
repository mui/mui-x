import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { RefObject } from '@mui/x-internals/types';
import {
  DataGridPro,
  GridApi,
  useGridApiRef,
  DataGridProProps,
  GridRowParams,
  gridClasses,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
} from '@mui/x-data-grid-pro';
import { useBasicDemoData } from '@mui/x-data-grid-generator';
import { createRenderer, screen, waitFor, act, reactMajor } from '@mui/internal-test-utils';
import { $, $$, grid, getRow, getCell, getColumnValues } from 'test/utils/helperFn';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';

describe('<DataGridPro /> - Detail panel', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function TestCase({ nbRows = 20, ...other }: Partial<DataGridProProps> & { nbRows?: number }) {
    apiRef = useGridApiRef();
    const data = useBasicDemoData(nbRows, 1);
    return (
      <div style={{ width: 300, height: 302 }}>
        <DataGridPro {...data} apiRef={apiRef} {...other} />
      </div>
    );
  }

  // Needs layout
  testSkipIf(isJSDOM)(
    'should not allow to expand rows that do not specify a detail element',
    async () => {
      const { user } = render(
        <TestCase getDetailPanelContent={({ id }) => (Number(id) === 0 ? null : <div />)} />,
      );
      const cell = getCell(0, 0);
      expect(cell.querySelector('[aria-label="Expand"]')).to.have.attribute('disabled');
      await user.click(cell);
      expect(getRow(0)).toHaveComputedStyle({ marginBottom: '0px' });
    },
  );

  // Needs layout
  testSkipIf(isJSDOM)(
    'should not consider the height of the detail panels when rendering new rows during scroll',
    () => {
      const rowHeight = 50;
      render(
        <TestCase
          getDetailPanelHeight={({ id }) => (Number(id) % 2 === 0 ? 1 : 2) * rowHeight} // 50px for even rows, otherwise 100px
          getDetailPanelContent={() => <div />}
          rowHeight={rowHeight}
          rowBufferPx={0}
          initialState={{
            detailPanel: {
              expandedRowIds: new Set([0, 1]),
            },
          }}
        />,
      );
      expect(getColumnValues(1)[0]).to.equal('0');
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      virtualScroller.scrollTop = 250; // 50 + 50 (detail panel) + 50 + 100 (detail panel * 2)
      act(() => virtualScroller.dispatchEvent(new Event('scroll')));
      expect(getColumnValues(1)[0]).to.equal('2'); // If there was no expanded row, the first rendered would be 5
    },
  );

  // Needs layout
  testSkipIf(isJSDOM)(
    'should derive the height from the content if getDetailPanelHeight returns "auto"',
    async () => {
      const rowHeight = 50;
      const detailPanelHeight = 100;
      const { user } = render(
        <TestCase
          nbRows={1}
          rowHeight={rowHeight}
          getDetailPanelContent={() => <div style={{ height: detailPanelHeight }} />}
          getDetailPanelHeight={() => 'auto'}
        />,
      );
      await user.click(screen.getAllByRole('button', { name: 'Expand' })[0]);
      await waitFor(() =>
        expect(getRow(0).className).to.include(gridClasses['row--detailPanelExpanded']),
      );

      const virtualScrollerContent = $('.MuiDataGrid-virtualScrollerContent')!;

      await waitFor(() => {
        expect(virtualScrollerContent).toHaveComputedStyle({
          height: `${rowHeight + detailPanelHeight}px`,
        });
      });

      expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });

      const detailPanels = $$('.MuiDataGrid-detailPanel');
      expect(detailPanels[0]).toHaveComputedStyle({
        height: `${detailPanelHeight}px`,
      });
    },
  );

  // Needs layout
  testSkipIf(isJSDOM)(
    'should update the detail panel height if the content height changes when getDetailPanelHeight returns "auto"',
    async () => {
      function ExpandableCell() {
        const [expanded, setExpanded] = React.useState(false);
        return (
          <div style={{ height: expanded ? 200 : 100 }}>
            <button onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Decrease' : 'Increase'}
            </button>
          </div>
        );
      }
      const rowHeight = 50;
      const { user } = render(
        <TestCase
          nbRows={1}
          rowHeight={rowHeight}
          getDetailPanelContent={() => <ExpandableCell />}
          getDetailPanelHeight={() => 'auto'}
        />,
      );
      const virtualScrollerContent = grid('virtualScrollerContent')!;
      await user.click(screen.getByRole('button', { name: 'Expand' }));

      await waitFor(() =>
        expect(getRow(0).className).to.include(gridClasses['row--detailPanelExpanded']),
      );

      expect(virtualScrollerContent).toHaveComputedStyle({ height: `${rowHeight + 100}px` });
      expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });

      const detailPanels = $$('.MuiDataGrid-detailPanel');
      expect(detailPanels[0]).toHaveComputedStyle({
        height: `100px`,
      });

      await user.click(screen.getByRole('button', { name: 'Increase' }));

      await waitFor(() => {
        expect(virtualScrollerContent).toHaveComputedStyle({ height: `${rowHeight + 200}px` });
      });
      expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });

      expect(detailPanels[0]).toHaveComputedStyle({
        height: `200px`,
      });
    },
  );

  // Doesn't work with mocked window.getComputedStyle
  testSkipIf(isJSDOM)('should position correctly the detail panels', () => {
    const rowHeight = 50;
    const evenHeight = rowHeight;
    const oddHeight = 2 * rowHeight;
    render(
      <TestCase
        getDetailPanelHeight={({ id }: GridRowParams) =>
          Number(id) % 2 === 0 ? evenHeight : oddHeight
        }
        getDetailPanelContent={() => <div />}
        rowHeight={rowHeight}
        initialState={{
          detailPanel: {
            expandedRowIds: new Set([0, 1]),
          },
        }}
      />,
    );
    const detailPanels = $$('.MuiDataGrid-detailPanel');
    expect(detailPanels[0]).toHaveComputedStyle({
      height: `${evenHeight}px`,
    });
    expect(detailPanels[1]).toHaveComputedStyle({
      height: `${oddHeight}px`,
    });
  });

  it('should not render detail panels for non-visible rows', async () => {
    const { user } = render(
      <TestCase
        getDetailPanelContent={({ id }) => <div>Row {id}</div>}
        pagination
        pageSizeOptions={[1]}
        initialState={{
          detailPanel: { expandedRowIds: new Set([0]) },
          pagination: { paginationModel: { pageSize: 1 } },
        }}
      />,
    );
    expect(screen.queryByText('Row 0')).not.to.equal(null);
    await user.click(screen.getByRole('button', { name: /next page/i }));
    expect(screen.queryByText('Row 0')).to.equal(null);
  });

  // Needs layout
  testSkipIf(isJSDOM)(
    'should consider the height of the detail panel when scrolling to a cell',
    async () => {
      const rowHeight = 50;
      const columnHeaderHeight = 50;
      const { user } = render(
        <TestCase
          getDetailPanelHeight={() => rowHeight}
          getDetailPanelContent={() => <div />}
          rowHeight={rowHeight}
          columnHeaderHeight={columnHeaderHeight}
          initialState={{
            detailPanel: {
              expandedRowIds: new Set([0]),
            },
          }}
          hideFooter
        />,
      );
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      await user.click(getCell(2, 1));
      await user.keyboard('[ArrowDown]');
      expect(virtualScroller.scrollTop).to.equal(0);
      await user.keyboard('[ArrowDown]');
      expect(virtualScroller.scrollTop).to.equal(50);
    },
  );

  // Needs layout
  testSkipIf(isJSDOM)(
    'should not scroll vertically when navigating expanded row cells',
    async () => {
      function Component() {
        const data = useBasicDemoData(10, 4);
        return (
          <TestCase
            {...data}
            getDetailPanelContent={() => <div />}
            initialState={{
              detailPanel: {
                expandedRowIds: new Set([0]),
              },
            }}
            hideFooter
          />
        );
      }
      const { user } = render(<Component />);
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;

      const cell = getCell(0, 0);

      await user.click(cell);

      await user.keyboard('[ArrowRight]');

      await act(() => virtualScroller.dispatchEvent(new Event('scroll')));
      expect(virtualScroller.scrollTop).to.equal(0);

      await user.keyboard('[ArrowRight]');
      await act(() => virtualScroller.dispatchEvent(new Event('scroll')));
      expect(virtualScroller.scrollTop).to.equal(0);

      await user.keyboard('[ArrowRight]');
      await act(() => virtualScroller.dispatchEvent(new Event('scroll')));
      expect(virtualScroller.scrollTop).to.equal(0);
    },
  );

  it('should toggle the detail panel when pressing Space on detail toggle cell', async () => {
    const { user } = render(<TestCase getDetailPanelContent={() => <div>Detail</div>} />);
    expect(screen.queryByText('Detail')).to.equal(null);
    const cell = getCell(0, 0);
    await user.click(cell);
    await user.keyboard('[Space]');
    expect(screen.queryByText('Detail')).not.to.equal(null);
    await user.keyboard('[Space]');
    expect(screen.queryByText('Detail')).to.equal(null);
  });

  it('should allow to pass a custom toggle by adding a column with field=GRID_DETAIL_PANEL_TOGGLE_FIELD', () => {
    render(
      <TestCase
        nbRows={1}
        columns={[
          { field: 'currencyPair' },
          { field: GRID_DETAIL_PANEL_TOGGLE_FIELD, renderCell: () => <button>Toggle</button> },
        ]}
        getDetailPanelContent={() => <div>Detail</div>}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Expand' })).to.equal(null);
    expect(screen.queryByRole('button', { name: 'Toggle' })).not.to.equal(null);
    expect(getCell(0, 1).firstChild).to.equal(screen.queryByRole('button', { name: 'Toggle' }));
  });

  it('should cache the content of getDetailPanelContent', async () => {
    const getDetailPanelContent = spy(() => <div>Detail</div>);
    const { setProps, user } = render(
      <TestCase
        columns={[{ field: 'brand' }]}
        rows={[
          { id: 0, brand: 'Nike' },
          { id: 1, brand: 'Adidas' },
        ]}
        getDetailPanelContent={getDetailPanelContent}
        pagination
        pageSizeOptions={[1]}
        initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}
      />,
    );

    //   2x during state initialization
    // + 2x during state initialization (StrictMode)
    // + 2x when sortedRowsSet is fired
    // + 2x when sortedRowsSet is fired (StrictMode) = 8x
    // Because of https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
    // from React 19 it is:
    //   2x during state initialization
    // + 2x when sortedRowsSet is fired
    const expectedCallCount = reactMajor >= 19 ? 4 : 8;

    expect(getDetailPanelContent.callCount).to.equal(expectedCallCount);
    await user.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getDetailPanelContent.callCount).to.equal(expectedCallCount);

    await user.click(screen.getByRole('button', { name: /next page/i }));
    expect(getDetailPanelContent.callCount).to.equal(expectedCallCount);

    const getDetailPanelContent2 = spy(() => <div>Detail</div>);
    setProps({ getDetailPanelContent: getDetailPanelContent2 });
    await user.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getDetailPanelContent2.callCount).to.equal(2); // Called 2x by the effect
    await user.click(screen.getByRole('button', { name: /previous page/i }));
    expect(getDetailPanelContent2.callCount).to.equal(2);
  });

  it('should cache the content of getDetailPanelHeight', async () => {
    const getDetailPanelHeight = spy(() => 100);
    const { setProps, user } = render(
      <TestCase
        columns={[{ field: 'brand' }]}
        rows={[
          { id: 0, brand: 'Nike' },
          { id: 1, brand: 'Adidas' },
        ]}
        getDetailPanelContent={() => <div>Detail</div>}
        getDetailPanelHeight={getDetailPanelHeight}
        pagination
        pageSizeOptions={[1]}
        initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}
      />,
    );

    //   2x during state initialization
    // + 2x during state initialization (StrictMode)
    // + 2x when sortedRowsSet is fired
    // + 2x when sortedRowsSet is fired (StrictMode) = 8x
    // Because of https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
    // from React 19 it is:
    //   2x during state initialization
    // + 2x when sortedRowsSet is fired
    const expectedCallCount = reactMajor >= 19 ? 4 : 8;

    expect(getDetailPanelHeight.callCount).to.equal(expectedCallCount);
    await user.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getDetailPanelHeight.callCount).to.equal(expectedCallCount);

    await user.click(screen.getByRole('button', { name: /next page/i }));
    expect(getDetailPanelHeight.callCount).to.equal(expectedCallCount);

    const getDetailPanelHeight2 = spy(() => 200);
    setProps({ getDetailPanelHeight: getDetailPanelHeight2 });
    await user.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getDetailPanelHeight2.callCount).to.equal(2); // Called 2x by the effect
    await user.click(screen.getByRole('button', { name: /previous page/i }));
    expect(getDetailPanelHeight2.callCount).to.equal(2);
  });

  // Doesn't work with mocked window.getComputedStyle
  testSkipIf(isJSDOM)(
    'should update the panel height if getDetailPanelHeight is changed while the panel is open',
    async () => {
      const getDetailPanelHeight = spy(() => 100);
      const { setProps, user } = render(
        <TestCase
          columns={[{ field: 'brand' }]}
          rows={[
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
          ]}
          getDetailPanelContent={() => <div>Detail</div>}
          getDetailPanelHeight={getDetailPanelHeight}
          pagination
          pageSizeOptions={[1]}
          initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}
          autoHeight
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Expand' }));
      const detailPanel = $$('.MuiDataGrid-detailPanel')[0];
      expect(detailPanel).toHaveComputedStyle({ height: '100px' });
      const virtualScroller = grid('virtualScroller')!;
      expect(virtualScroller.scrollHeight).to.equal(208);

      const getDetailPanelHeight2 = spy(() => 200);
      setProps({ getDetailPanelHeight: getDetailPanelHeight2 });

      expect(detailPanel).toHaveComputedStyle({ height: '200px' });
      expect(virtualScroller.scrollHeight).to.equal(200 + 52 + 56);
    },
  );

  it('should only call getDetailPanelHeight on the rows that have detail content', () => {
    const getDetailPanelHeight = spy(({ row }) => row.id + 100); // Use `row` to allow to assert its args below
    render(
      <TestCase
        columns={[{ field: 'brand' }]}
        rows={[
          { id: 0, brand: 'Nike' },
          { id: 1, brand: 'Adidas' },
        ]}
        getDetailPanelContent={({ row }) => (row.id === 0 ? <div>Detail</div> : null)}
        getDetailPanelHeight={getDetailPanelHeight}
      />,
    );
    //   1x during state initialization
    // + 1x during state initialization (StrictMode)
    // + 1x when sortedRowsSet is fired
    // + 1x when sortedRowsSet is fired (StrictMode) = 4x
    // Because of https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
    // from React 19 it is:
    //   1x during state initialization
    // + 1x when sortedRowsSet is fired
    const expectedCallCount = reactMajor >= 19 ? 2 : 4;

    expect(getDetailPanelHeight.callCount).to.equal(expectedCallCount);
    expect(getDetailPanelHeight.lastCall.args[0].id).to.equal(0);
  });

  it('should not select the row when opening the detail panel', async () => {
    const handleRowSelectionModelChange = spy();
    const { user } = render(
      <TestCase
        getDetailPanelContent={() => <div>Detail</div>}
        onRowSelectionModelChange={handleRowSelectionModelChange}
        checkboxSelection
      />,
    );
    expect(screen.queryByText('Detail')).to.equal(null);
    await user.click(getCell(1, 0));
    expect(handleRowSelectionModelChange.callCount).to.equal(0);
  });

  // See https://github.com/mui/mui-x/issues/4607
  // Needs layout
  testSkipIf(isJSDOM)('should make detail panel to take full width of the content', async () => {
    const { user } = render(
      <TestCase
        getDetailPanelContent={() => <div>Detail</div>}
        columns={[{ field: 'id', width: 400 }]}
      />,
    );
    await user.click(getCell(1, 0).querySelector('button')!);
    expect(screen.getByText('Detail').offsetWidth).to.equal(50 + 400);
  });

  it('should add an accessible name to the toggle column', () => {
    render(<TestCase getDetailPanelContent={() => <div />} />);
    expect(screen.queryByRole('columnheader', { name: /detail panel toggle/i })).not.to.equal(null);
  });

  it('should add the MuiDataGrid-row--detailPanelExpanded class to the expanded row', async () => {
    const { user } = render(
      <TestCase getDetailPanelContent={({ id }) => (id === 0 ? <div /> : null)} />,
    );
    expect(getRow(0)).not.to.have.class(gridClasses['row--detailPanelExpanded']);
    await user.click(screen.getAllByRole('button', { name: 'Expand' })[0]);
    expect(getRow(0)).to.have.class(gridClasses['row--detailPanelExpanded']);
  });

  // See https://github.com/mui/mui-x/issues/6694
  // Doesn't work with mocked window.getComputedStyle
  testSkipIf(isJSDOM)(
    'should add a bottom margin to the expanded row when using `getRowSpacing`',
    async () => {
      const { user } = render(
        <TestCase
          getDetailPanelContent={({ id }) => (id === 0 ? <div /> : null)}
          getRowSpacing={() => ({ top: 2, bottom: 2 })}
        />,
      );
      await user.click(screen.getAllByRole('button', { name: 'Expand' })[0]);
      expect(getRow(0)).toHaveComputedStyle({ marginBottom: '2px' });
    },
  );

  it('should not reuse detail panel components', () => {
    let counter = 0;
    function DetailPanel() {
      counter += 1;
      return <div data-testid="detail-panel-content">{counter}</div>;
    }
    const { setProps } = render(
      <TestCase
        getDetailPanelContent={() => <DetailPanel />}
        detailPanelExpandedRowIds={new Set([0])}
      />,
    );
    expect(screen.getByTestId(`detail-panel-content`).textContent).to.equal(`${counter}`);
    setProps({ detailPanelExpandedRowIds: new Set([1]) });
    expect(screen.getByTestId(`detail-panel-content`).textContent).to.equal(`${counter}`);
  });

  // Needs layout
  testSkipIf(isJSDOM)(
    "should not render detail panel for the focused row if it's outside of the viewport",
    async () => {
      const { user } = render(
        <TestCase
          getDetailPanelHeight={() => 50}
          getDetailPanelContent={() => <div />}
          rowBufferPx={0}
          nbRows={20}
        />,
      );

      await user.click(screen.getAllByRole('button', { name: 'Expand' })[0]);

      const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
      virtualScroller.scrollTop = 500;
      await act(() => virtualScroller.dispatchEvent(new Event('scroll')));

      const detailPanels = document.querySelectorAll(`.${gridClasses.detailPanel}`);
      expect(detailPanels.length).to.equal(0);
    },
  );

  describe('prop: onDetailPanelsExpandedRowIds', () => {
    it('should call when a row is expanded or closed', async () => {
      const handleDetailPanelsExpandedRowIdsChange = spy();
      const { user } = render(
        <TestCase
          getDetailPanelContent={() => <div>Detail</div>}
          onDetailPanelExpandedRowIdsChange={handleDetailPanelsExpandedRowIdsChange}
        />,
      );
      await user.click(screen.getAllByRole('button', { name: 'Expand' })[0]); // Expand the 1st row
      expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal(new Set([0]));
      await user.click(screen.getAllByRole('button', { name: 'Expand' })[0]); // Expand the 2nd row
      expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal(
        new Set([0, 1]),
      );
      await user.click(screen.getAllByRole('button', { name: 'Collapse' })[0]); // Close the 1st row
      expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal(new Set([1]));
      await user.click(screen.getAllByRole('button', { name: 'Collapse' })[0]); // Close the 2nd row
      expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal(new Set([]));
    });

    it('should not change the open detail panels when called while detailPanelsExpandedRowIds is the same', async () => {
      const handleDetailPanelsExpandedRowIdsChange = spy();
      const { user } = render(
        <TestCase
          getDetailPanelContent={({ id }) => <div>Row {id}</div>}
          detailPanelExpandedRowIds={new Set([0])}
          onDetailPanelExpandedRowIdsChange={handleDetailPanelsExpandedRowIdsChange}
        />,
      );
      expect(screen.getByText('Row 0')).not.to.equal(null);
      await user.click(screen.getByRole('button', { name: 'Collapse' }));
      expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal(new Set([]));
      expect(screen.getByText('Row 0')).not.to.equal(null);
    });
  });

  describe('prop: detailPanelExpandedRowIds', () => {
    it('should open the detail panel of the specified rows', () => {
      render(
        <TestCase
          getDetailPanelContent={({ id }) => <div>Row {id}</div>}
          detailPanelExpandedRowIds={new Set([0, 1])}
        />,
      );
      expect(screen.queryByText('Row 0')).not.to.equal(null);
      expect(screen.queryByText('Row 1')).not.to.equal(null);
      expect(screen.queryByText('Row 2')).to.equal(null);
    });

    it("should not change the open detail panels if the prop didn't change", async () => {
      const { user } = render(
        <TestCase
          getDetailPanelContent={({ id }) => <div>Row {id}</div>}
          detailPanelExpandedRowIds={new Set([0])}
        />,
      );
      expect(screen.queryByText('Row 0')).not.to.equal(null);
      expect(screen.queryByText('Row 1')).to.equal(null);
      await user.click(screen.getAllByRole('button', { name: 'Expand' })[0]); // Expand the second row
      expect(screen.queryByText('Row 0')).not.to.equal(null);
      expect(screen.queryByText('Row 1')).to.equal(null);
    });

    it('should filter out duplicated ids and render only one panel', () => {
      render(
        <TestCase
          getDetailPanelContent={({ id }) => <div>Row {id}</div>}
          detailPanelExpandedRowIds={new Set([0, 0])}
        />,
      );
      expect(screen.queryAllByText('Row 0').length).to.equal(1);
    });
  });

  describe('apiRef', () => {
    describe('toggleDetailPanel', () => {
      it('should toggle the panel of the given row id', () => {
        render(<TestCase getDetailPanelContent={() => <div>Detail</div>} />);
        expect(screen.queryByText('Detail')).to.equal(null);
        act(() => apiRef.current?.toggleDetailPanel(0));
        expect(screen.queryByText('Detail')).not.to.equal(null);
        act(() => apiRef.current?.toggleDetailPanel(0));
        expect(screen.queryByText('Detail')).to.equal(null);
      });

      it('should not toggle the panel of a row without detail component', () => {
        render(
          <TestCase
            rowHeight={50}
            getDetailPanelContent={({ id }) => (id === 0 ? <div>Detail</div> : null)}
          />,
        );
        act(() => apiRef.current?.toggleDetailPanel(1));
        expect(document.querySelector('.MuiDataGrid-detailPanels')).to.equal(null);
        expect(getRow(1)).not.toHaveComputedStyle({ marginBottom: '50px' });
      });

      // See https://github.com/mui/mui-x/pull/8976
      it('should not toggle the panel if the row id is of a different type', () => {
        render(<TestCase getDetailPanelContent={() => <div>Detail</div>} />);
        expect(screen.queryByText('Detail')).to.equal(null);
        // '0' !== 0
        act(() => apiRef.current?.toggleDetailPanel('0'));
        expect(screen.queryByText('Detail')).to.equal(null);
      });
    });

    describe('getExpandedDetailPanels', () => {
      it('should return a set of ids', () => {
        render(
          <TestCase
            getDetailPanelContent={() => <div>Detail</div>}
            initialState={{
              detailPanel: {
                expandedRowIds: new Set([0, 1]),
              },
            }}
          />,
        );
        act(() => expect(apiRef.current?.getExpandedDetailPanels()).to.deep.equal(new Set([0, 1])));
      });
    });

    describe('setExpandedDetailPanels', () => {
      it('should update which detail panels are open', async () => {
        render(
          <TestCase
            getDetailPanelContent={({ id }) => <div>Row {id}</div>}
            initialState={{
              detailPanel: {
                expandedRowIds: new Set([0]),
              },
            }}
          />,
        );
        expect(screen.queryByText('Row 0')).not.to.equal(null);
        expect(screen.queryByText('Row 1')).to.equal(null);
        expect(screen.queryByText('Row 2')).to.equal(null);
        act(() => apiRef.current?.setExpandedDetailPanels(new Set([1, 2])));
        expect(screen.queryByText('Row 0')).to.equal(null);
        expect(screen.queryByText('Row 1')).not.to.equal(null);
        expect(screen.queryByText('Row 2')).not.to.equal(null);
      });
    });
  });

  it('should merge row styles when expanded', async () => {
    const { user } = render(
      <TestCase
        getDetailPanelHeight={() => 0}
        nbRows={1}
        getDetailPanelContent={() => <div />}
        slotProps={{
          row: { style: { color: 'yellow' } },
        }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getRow(0)).toHaveInlineStyle({
      color: 'yellow',
    });
  });
});
