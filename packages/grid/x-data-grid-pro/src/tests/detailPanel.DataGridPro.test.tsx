import * as React from 'react';
import {
  DataGridPro,
  GridApiRef,
  useGridApiRef,
  DataGridProProps,
  GridRowParams,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
} from '@mui/x-data-grid-pro';
import { expect } from 'chai';
import { spy } from 'sinon';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, screen } from '@mui/monorepo/test/utils';
import { getRow, getCell, getColumnValues } from 'test/utils/helperFn';
import { useData } from 'storybook/src/hooks/useData';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Detail panel', () => {
  const { render } = createRenderer({ clock: 'fake' });

  let apiRef: GridApiRef;

  const TestCase = ({ nbRows = 20, ...other }: Partial<DataGridProProps> & { nbRows?: number }) => {
    apiRef = useGridApiRef();
    const data = useData(nbRows, 1);
    return (
      <div style={{ width: 300, height: 302 }}>
        <DataGridPro {...data} apiRef={apiRef} {...other} />
      </div>
    );
  };

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
    virtualScroller.scrollTop = 250;
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(getColumnValues(1)[0]).to.equal('2'); // If there was no expanded row, the first rendered would be 5
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
        pageSize={1}
        rowsPerPageOptions={[1]}
        pagination
        initialState={{ detailPanel: { expandedRowIds: [0] } }}
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
    const headerHeight = 50;
    render(
      <TestCase
        getDetailPanelHeight={() => rowHeight}
        getDetailPanelContent={() => <div />}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        initialState={{
          detailPanel: {
            expandedRowIds: [0],
          },
        }}
        hideFooter
      />,
    );
    const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
    fireEvent.mouseUp(getCell(2, 1));
    fireEvent.click(getCell(2, 1));
    fireEvent.keyDown(getCell(2, 1), { key: 'ArrowDown' });
    expect(virtualScroller.scrollTop).to.equal(0);
    fireEvent.keyDown(getCell(3, 1), { key: 'ArrowDown' });
    expect(virtualScroller.scrollTop).to.equal(50);
  });

  it('should toggle the detail panel when pressing Ctrl+Enter', () => {
    render(<TestCase getDetailPanelContent={() => <div>Detail</div>} />);
    expect(screen.queryByText('Detail')).to.equal(null);
    const cell = getCell(1, 1);
    fireEvent.mouseUp(cell);
    fireEvent.click(cell);
    fireEvent.keyDown(cell, { ctrlKey: true, key: 'Enter' });
    expect(screen.queryByText('Detail')).not.to.equal(null);
    fireEvent.keyDown(cell, { ctrlKey: true, key: 'Enter' });
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
        pageSize={1}
        rowsPerPageOptions={[1]}
        pagination
      />,
    );

    //   2x during state initialization
    // + 2x during state initialization (StrictMode)
    // + 2x when sortedRowsSet is fired
    // + 2x when sortedRowsSet is fired (StrictMode)
    // + 2x when the effect runs for the first time = 10x
    expect(getDetailPanelContent.callCount).to.equal(10);
    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getDetailPanelContent.callCount).to.equal(10);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(getDetailPanelContent.callCount).to.equal(10);

    const getDetailPanelContent2 = spy(() => <div>Detail</div>);
    setProps({ getDetailPanelContent: getDetailPanelContent2 });
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
        pageSize={1}
        rowsPerPageOptions={[1]}
        pagination
      />,
    );
    //   2x during state initialization
    // + 2x during state initialization (StrictMode)
    // + 2x when sortedRowsSet is fired
    // + 2x when sortedRowsSet is fired (StrictMode)
    // + 2x when the effect runs for the first time = 10x
    expect(getDetailPanelHeight.callCount).to.equal(10);
    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(getDetailPanelHeight.callCount).to.equal(10);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(getDetailPanelHeight.callCount).to.equal(10);

    const getDetailPanelHeight2 = spy(() => 200);
    setProps({ getDetailPanelHeight: getDetailPanelHeight2 });
    expect(getDetailPanelHeight2.callCount).to.equal(2); // Called 2x by the effect
    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    expect(getDetailPanelHeight2.callCount).to.equal(2);
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
    // + 1x when sortedRowsSet is fired (StrictMode)
    // + 1x when the effect runs for the first time = 5x
    expect(getDetailPanelHeight.callCount).to.equal(5);
    expect(getDetailPanelHeight.lastCall.args[0].id).to.equal(0);
  });

  it('should not select the row when opening the detail panel', () => {
    const handleSelectionModelChange = spy();
    render(
      <TestCase
        getDetailPanelContent={() => <div>Detail</div>}
        onSelectionModelChange={handleSelectionModelChange}
        checkboxSelection
      />,
    );
    expect(screen.queryByText('Detail')).to.equal(null);
    const cell = getCell(1, 0);
    fireEvent.mouseUp(cell);
    fireEvent.click(cell);
    expect(handleSelectionModelChange.callCount).to.equal(0);
  });

  describe('props: onDetailPanelsExpandedRowIds', () => {
    it('shoull call when a row is expanded or closed', () => {
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

    it('shoull not change the open detail panels when called while detailPanelsExpandedRowIds is the same', () => {
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

  describe('props: detailPanelExpandedRowIds', () => {
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

    it("should not change the open detail panels if the prop  didn't change", () => {
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
        apiRef.current.toggleDetailPanel(0);
        expect(screen.queryByText('Detail')).not.to.equal(null);
        apiRef.current.toggleDetailPanel(0);
        expect(screen.queryByText('Detail')).to.equal(null);
      });

      it('should not toggle the panel of a row without detail component', () => {
        render(
          <TestCase
            rowHeight={50}
            getDetailPanelContent={({ id }) => (id === 0 ? <div>Detail</div> : null)}
          />,
        );
        apiRef.current.toggleDetailPanel(1);
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
        expect(apiRef.current.getExpandedDetailPanels()).to.deep.equal([0, 1]);
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
        apiRef.current.setExpandedDetailPanels([1, 2]);
        expect(screen.queryByText('Row 0')).to.equal(null);
        expect(screen.queryByText('Row 1')).not.to.equal(null);
        expect(screen.queryByText('Row 2')).not.to.equal(null);
      });
    });
  });
});
