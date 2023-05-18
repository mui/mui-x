import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
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
import {
  createRenderer,
  fireEvent,
  screen,
  waitFor,
  act,
  userEvent,
} from '@mui/monorepo/test/utils';
import { getRow, getCell, getColumnValues, getRows } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Detail panel', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  function TestCase({ nbRows = 20, ...other }: Partial<DataGridProProps> & { nbRows?: number }) {
    apiRef = useGridApiRef();
    const data = useBasicDemoData(nbRows, 1);
    return (
      <div style={{ width: 300, height: 302 }}>
        <DataGridPro {...data} apiRef={apiRef} {...other} />
      </div>
    );
  }

  it('should add a bottom margin to the expanded row', function test() {
    if (isJSDOM) {
      this.skip(); // Doesn't work with mocked window.getComputedStyle
    }

    render(<TestCase getDetailPanelContent={({ id }) => (id === 0 ? <div /> : null)} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Expand' })[0]);
    expect(getRow(0)).toHaveComputedStyle({ marginBottom: '500px' });
  });

  it('should not allow to expand rows that do not specify a detail element', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    render(<TestCase getDetailPanelContent={({ id }) => (Number(id) === 0 ? null : <div />)} />);
    const cell = getCell(0, 0);
    expect(cell.querySelector('[aria-label="Expand"]')).to.have.attribute('disabled');
    fireEvent.click(cell);
    expect(getRow(0)).toHaveComputedStyle({ marginBottom: '0px' });
  });

  it('should not consider the height of the detail panels when rendering new rows during scroll', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    const rowHeight = 50;
    render(
      <TestCase
        getDetailPanelHeight={({ id }) => (Number(id) % 2 === 0 ? 1 : 2) * rowHeight} // 50px for even rows, otherwise 100px
        getDetailPanelContent={() => <div />}
        rowHeight={rowHeight}
        rowBuffer={0}
        rowThreshold={0}
        initialState={{
          detailPanel: {
            expandedRowIds: [0, 1],
          },
        }}
      />,
    );
    expect(getColumnValues(1)[0]).to.equal('0');
    const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
    virtualScroller.scrollTop = 250; // 50 + 50 (detail panel) + 50 + 100 (detail panel * 2)
    act(() => virtualScroller.dispatchEvent(new Event('scroll')));
    expect(getColumnValues(1)[0]).to.equal('2'); // If there was no expanded row, the first rendered would be 5
  });

  it('should only render detail panels for the rows that are rendered', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    render(
      <TestCase
        getDetailPanelHeight={() => 50}
        getDetailPanelContent={() => <div />}
        rowBuffer={0}
        rowThreshold={0}
        nbRows={10}
        initialState={{
          detailPanel: {
            expandedRowIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        }}
      />,
    );
    const rows = getRows();
    const detailPanels = document.querySelectorAll('.MuiDataGrid-detailPanel');
    expect(detailPanels.length).to.equal(rows.length);
  });

  it('should derive the height from the content if getDetailPanelHeight returns "auto"', async function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    const rowHeight = 50;
    const detailPanelHeight = 100;
    render(
      <TestCase
        nbRows={1}
        rowHeight={rowHeight}
        getDetailPanelContent={() => <div style={{ height: detailPanelHeight }} />}
        getDetailPanelHeight={() => 'auto'}
      />,
    );
    fireEvent.click(screen.getAllByRole('button', { name: 'Expand' })[0]);

    await waitFor(() => {
      expect(getRow(0)).toHaveComputedStyle({ marginBottom: `${detailPanelHeight}px` });
    });

    const virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent')!;
    expect(virtualScrollerContent).toHaveInlineStyle({
      width: 'auto',
      height: `${rowHeight + detailPanelHeight}px`,
    });

    const detailPanels = document.querySelector('.MuiDataGrid-detailPanels');
    expect(detailPanels!.children[0]).toHaveComputedStyle({
      top: `${rowHeight}px`,
      height: `${detailPanelHeight}px`,
    });
  });

  it('should update the detail panel height if the content height changes when getDetailPanelHeight returns "auto"', async function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
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
    render(
      <TestCase
        nbRows={1}
        rowHeight={rowHeight}
        getDetailPanelContent={() => <ExpandableCell />}
        getDetailPanelHeight={() => 'auto'}
      />,
    );
    const virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent')!;
    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));

    await waitFor(() => {
      expect(getRow(0)).toHaveComputedStyle({ marginBottom: '100px' });
    });

    expect(virtualScrollerContent).toHaveInlineStyle({
      width: 'auto',
      height: `${rowHeight + 100}px`,
    });

    const detailPanels = document.querySelector('.MuiDataGrid-detailPanels');
    expect(detailPanels!.children[0]).toHaveComputedStyle({
      top: `${rowHeight}px`,
      height: `100px`,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));

    await waitFor(() => {
      expect(getRow(0)).toHaveComputedStyle({ marginBottom: '200px' });
    });

    expect(virtualScrollerContent).toHaveInlineStyle({
      width: 'auto',
      height: `${rowHeight + 200}px`,
    });

    expect(detailPanels!.children[0]).toHaveComputedStyle({
      top: `${rowHeight}px`,
      height: `200px`,
    });
  });

  it('should position correctly the detail panels', function test() {
    if (isJSDOM) {
      this.skip(); // Doesn't work with mocked window.getComputedStyle
    }

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
            expandedRowIds: [0, 1],
          },
        }}
      />,
    );
    const detailPanels = document.querySelector('.MuiDataGrid-detailPanels');
    expect(detailPanels!.children[0]).toHaveComputedStyle({
      top: `${rowHeight}px`,
      height: `${evenHeight}px`,
    });
    expect(detailPanels!.children[1]).toHaveComputedStyle({
      top: `${rowHeight + evenHeight + rowHeight}px`,
      height: `${oddHeight}px`,
    });
  });

  it('should not render detail panels for non-visible rows', () => {
    render(
      <TestCase
        getDetailPanelContent={({ id }) => <div>Row {id}</div>}
        pagination
        pageSizeOptions={[1]}
        initialState={{
          detailPanel: { expandedRowIds: [0] },
          pagination: { paginationModel: { pageSize: 1 } },
        }}
      />,
    );
    expect(screen.queryByText('Row 0')).not.to.equal(null);
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(screen.queryByText('Row 0')).to.equal(null);
  });

  it('should consider the height of the detail panel when scrolling to a cell', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    const rowHeight = 50;
    const columnHeaderHeight = 50;
    render(
      <TestCase
        getDetailPanelHeight={() => rowHeight}
        getDetailPanelContent={() => <div />}
        rowHeight={rowHeight}
        columnHeaderHeight={columnHeaderHeight}
        initialState={{
          detailPanel: {
            expandedRowIds: [0],
          },
        }}
        hideFooter
      />,
    );
    const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
    userEvent.mousePress(getCell(2, 1));
    fireEvent.keyDown(getCell(2, 1), { key: 'ArrowDown' });
    expect(virtualScroller.scrollTop).to.equal(0);
    fireEvent.keyDown(getCell(3, 1), { key: 'ArrowDown' });
    expect(virtualScroller.scrollTop).to.equal(50);
  });

  it('should not scroll vertically when navigating expanded row cells', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    function Component() {
      const data = useBasicDemoData(10, 4);
      return (
        <TestCase
          {...data}
          getDetailPanelContent={() => <div />}
          initialState={{
            detailPanel: {
              expandedRowIds: [0],
            },
          }}
          hideFooter
        />
      );
    }
    render(<Component />);
    const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;

    const cell = getCell(0, 0);

    userEvent.mousePress(cell);

    fireEvent.keyDown(cell, { key: 'ArrowRight' });
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(virtualScroller.scrollTop).to.equal(0);

    fireEvent.keyDown(getCell(0, 1), { key: 'ArrowRight' });
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(virtualScroller.scrollTop).to.equal(0);

    fireEvent.keyDown(getCell(0, 2), { key: 'ArrowRight' });
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(virtualScroller.scrollTop).to.equal(0);
  });

  it('should toggle the detail panel when pressing Space on detail toggle cell', () => {
    render(<TestCase getDetailPanelContent={() => <div>Detail</div>} />);
    expect(screen.queryByText('Detail')).to.equal(null);
    const cell = getCell(0, 0);
    userEvent.mousePress(cell);
    fireEvent.keyDown(cell, { key: ' ' });
    expect(screen.queryByText('Detail')).not.to.equal(null);
    fireEvent.keyDown(cell, { key: ' ' });
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

  it('should cache the content of getDetailPanelContent', () => {
    const getDetailPanelContent = spy(() => <div>Detail</div>);
    const { setProps } = render(
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
    expect(getDetailPanelContent.callCount).to.equal(8);
    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getDetailPanelContent.callCount).to.equal(8);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(getDetailPanelContent.callCount).to.equal(8);

    const getDetailPanelContent2 = spy(() => <div>Detail</div>);
    setProps({ getDetailPanelContent: getDetailPanelContent2 });
    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getDetailPanelContent2.callCount).to.equal(2); // Called 2x by the effect
    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    expect(getDetailPanelContent2.callCount).to.equal(2);
  });

  it('should cache the content of getDetailPanelHeight', () => {
    const getDetailPanelHeight = spy(() => 100);
    const { setProps } = render(
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
    expect(getDetailPanelHeight.callCount).to.equal(8);
    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getDetailPanelHeight.callCount).to.equal(8);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(getDetailPanelHeight.callCount).to.equal(8);

    const getDetailPanelHeight2 = spy(() => 200);
    setProps({ getDetailPanelHeight: getDetailPanelHeight2 });
    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getDetailPanelHeight2.callCount).to.equal(2); // Called 2x by the effect
    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    expect(getDetailPanelHeight2.callCount).to.equal(2);
  });

  it('should update the panel height if getDetailPanelHeight is changed while the panel is open', function test() {
    if (isJSDOM) {
      this.skip(); // Doesn't work with mocked window.getComputedStyle
    }

    const getDetailPanelHeight = spy(() => 100);
    const { setProps } = render(
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

    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
    const detailPanel = document.querySelector('.MuiDataGrid-detailPanels')!.firstChild;
    expect(detailPanel).toHaveComputedStyle({ top: `52px`, height: `100px` });
    const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
    expect(virtualScroller.scrollHeight).to.equal(100 + 52);

    const getDetailPanelHeight2 = spy(() => 200);
    setProps({ getDetailPanelHeight: getDetailPanelHeight2 });
    expect(detailPanel).toHaveComputedStyle({ top: `52px`, height: `200px` });
    expect(virtualScroller.scrollHeight).to.equal(200 + 52);
  });

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
    expect(getDetailPanelHeight.callCount).to.equal(4);
    expect(getDetailPanelHeight.lastCall.args[0].id).to.equal(0);
  });

  it('should not select the row when opening the detail panel', () => {
    const handleRowSelectionModelChange = spy();
    render(
      <TestCase
        getDetailPanelContent={() => <div>Detail</div>}
        onRowSelectionModelChange={handleRowSelectionModelChange}
        checkboxSelection
      />,
    );
    expect(screen.queryByText('Detail')).to.equal(null);
    const cell = getCell(1, 0);
    userEvent.mousePress(cell);
    expect(handleRowSelectionModelChange.callCount).to.equal(0);
  });

  // See https://github.com/mui/mui-x/issues/4607
  it('should make detail panel to take full width of the content', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    render(
      <TestCase
        getDetailPanelContent={() => <div>Detail</div>}
        columns={[{ field: 'id', width: 400 }]}
      />,
    );
    fireEvent.click(getCell(1, 0).querySelector('button')!);
    expect(screen.getByText('Detail').offsetWidth).to.equal(50 + 400);
  });

  it('should add an accessible name to the toggle column', () => {
    render(<TestCase getDetailPanelContent={() => <div />} />);
    expect(screen.queryByRole('columnheader', { name: /detail panel toggle/i })).not.to.equal(null);
  });

  it('should add the MuiDataGrid-row--detailPanelExpanded class to the expanded row', () => {
    render(<TestCase getDetailPanelContent={({ id }) => (id === 0 ? <div /> : null)} />);
    expect(getRow(0)).not.to.have.class(gridClasses['row--detailPanelExpanded']);
    fireEvent.click(screen.getAllByRole('button', { name: 'Expand' })[0]);
    expect(getRow(0)).to.have.class(gridClasses['row--detailPanelExpanded']);
  });

  // See https://github.com/mui/mui-x/issues/6694
  it('should add a bottom margin to the expanded row when using `getRowSpacing`', function test() {
    if (isJSDOM) {
      this.skip(); // Doesn't work with mocked window.getComputedStyle
    }

    render(
      <TestCase
        getDetailPanelContent={({ id }) => (id === 0 ? <div /> : null)}
        getRowSpacing={() => ({ top: 2, bottom: 2 })}
      />,
    );
    fireEvent.click(screen.getAllByRole('button', { name: 'Expand' })[0]);
    expect(getRow(0)).toHaveComputedStyle({ marginBottom: '502px' }); // 500px + 2px spacing
  });

  it('should not reuse detail panel components', () => {
    let counter = 0;
    function DetailPanel() {
      const [number] = React.useState((counter += 1));
      return <div data-testid="detail-panel-content">{number}</div>;
    }
    const { setProps } = render(
      <TestCase getDetailPanelContent={() => <DetailPanel />} detailPanelExpandedRowIds={[0]} />,
    );
    expect(screen.getByTestId(`detail-panel-content`).textContent).to.equal(`${counter}`);
    act(() => {
      setProps({ detailPanelExpandedRowIds: [1] });
    });
    expect(screen.getByTestId(`detail-panel-content`).textContent).to.equal(`${counter}`);
  });

  describe('prop: onDetailPanelsExpandedRowIds', () => {
    it('should call when a row is expanded or closed', () => {
      const handleDetailPanelsExpandedRowIdsChange = spy();
      render(
        <TestCase
          getDetailPanelContent={() => <div>Detail</div>}
          onDetailPanelExpandedRowIdsChange={handleDetailPanelsExpandedRowIdsChange}
        />,
      );
      fireEvent.click(screen.getAllByRole('button', { name: 'Expand' })[0]); // Expand the 1st row
      expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal([0]);
      fireEvent.click(screen.getAllByRole('button', { name: 'Expand' })[0]); // Expand the 2nd row
      expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal([0, 1]);
      fireEvent.click(screen.getAllByRole('button', { name: 'Collapse' })[0]); // Close the 1st row
      expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal([1]);
      fireEvent.click(screen.getAllByRole('button', { name: 'Collapse' })[0]); // Close the 2nd row
      expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal([]);
    });

    it('should not change the open detail panels when called while detailPanelsExpandedRowIds is the same', () => {
      const handleDetailPanelsExpandedRowIdsChange = spy();
      render(
        <TestCase
          getDetailPanelContent={({ id }) => <div>Row {id}</div>}
          detailPanelExpandedRowIds={[0]}
          onDetailPanelExpandedRowIdsChange={handleDetailPanelsExpandedRowIdsChange}
        />,
      );
      expect(screen.getByText('Row 0')).not.to.equal(null);
      fireEvent.click(screen.getByRole('button', { name: 'Collapse' }));
      expect(handleDetailPanelsExpandedRowIdsChange.lastCall.args[0]).to.deep.equal([]);
      expect(screen.getByText('Row 0')).not.to.equal(null);
    });
  });

  describe('prop: detailPanelExpandedRowIds', () => {
    it('should open the detail panel of the specified rows', () => {
      render(
        <TestCase
          getDetailPanelContent={({ id }) => <div>Row {id}</div>}
          detailPanelExpandedRowIds={[0, 1]}
        />,
      );
      expect(screen.queryByText('Row 0')).not.to.equal(null);
      expect(screen.queryByText('Row 1')).not.to.equal(null);
      expect(screen.queryByText('Row 2')).to.equal(null);
    });

    it("should not change the open detail panels if the prop didn't change", () => {
      render(
        <TestCase
          getDetailPanelContent={({ id }) => <div>Row {id}</div>}
          detailPanelExpandedRowIds={[0]}
        />,
      );
      expect(screen.queryByText('Row 0')).not.to.equal(null);
      expect(screen.queryByText('Row 1')).to.equal(null);
      fireEvent.click(screen.getAllByRole('button', { name: 'Expand' })[0]); // Expand the second row
      expect(screen.queryByText('Row 0')).not.to.equal(null);
      expect(screen.queryByText('Row 1')).to.equal(null);
    });

    it('should filter out duplicated ids and render only one panel', () => {
      render(
        <TestCase
          getDetailPanelContent={({ id }) => <div>Row {id}</div>}
          detailPanelExpandedRowIds={[0, 0]}
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
        act(() => apiRef.current.toggleDetailPanel(0));
        expect(screen.queryByText('Detail')).not.to.equal(null);
        act(() => apiRef.current.toggleDetailPanel(0));
        expect(screen.queryByText('Detail')).to.equal(null);
      });

      it('should not toggle the panel of a row without detail component', () => {
        render(
          <TestCase
            rowHeight={50}
            getDetailPanelContent={({ id }) => (id === 0 ? <div>Detail</div> : null)}
          />,
        );
        act(() => apiRef.current.toggleDetailPanel(1));
        expect(document.querySelector('.MuiDataGrid-detailPanels')).to.equal(null);
        expect(getRow(1)).not.toHaveComputedStyle({ marginBottom: '50px' });
      });
    });

    describe('getExpandedDetailPanels', () => {
      it('should return an array of ids', () => {
        render(
          <TestCase
            getDetailPanelContent={() => <div>Detail</div>}
            initialState={{
              detailPanel: {
                expandedRowIds: [0, 1],
              },
            }}
          />,
        );
        act(() => expect(apiRef.current.getExpandedDetailPanels()).to.deep.equal([0, 1]));
      });
    });

    describe('setExpandedDetailPanels', () => {
      it('should update which detail panels are open', () => {
        render(
          <TestCase
            getDetailPanelContent={({ id }) => <div>Row {id}</div>}
            initialState={{
              detailPanel: {
                expandedRowIds: [0],
              },
            }}
          />,
        );
        expect(screen.queryByText('Row 0')).not.to.equal(null);
        expect(screen.queryByText('Row 1')).to.equal(null);
        expect(screen.queryByText('Row 2')).to.equal(null);
        act(() => apiRef.current.setExpandedDetailPanels([1, 2]));
        expect(screen.queryByText('Row 0')).to.equal(null);
        expect(screen.queryByText('Row 1')).not.to.equal(null);
        expect(screen.queryByText('Row 2')).not.to.equal(null);
      });
    });
  });

  it('should merge row styles when expanded', () => {
    render(
      <TestCase
        getDetailPanelHeight={() => 0}
        nbRows={1}
        getDetailPanelContent={() => <div />}
        componentsProps={{
          row: { style: { color: 'yellow' } },
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getRow(0)).toHaveInlineStyle({
      color: 'yellow',
      marginBottom: '0px', // added when expanded
    });
  });
});
