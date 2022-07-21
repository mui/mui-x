import * as React from 'react';
import { DataGridPro, gridClasses, useGridApiRef, GridApi } from '@mui/x-data-grid-pro';
import { expect } from 'chai';
// @ts-expect-error Remove once the test utils are typed
import { createRenderer, waitFor, fireEvent } from '@mui/monorepo/test/utils';
import { getData } from 'storybook/src/data/data-service';
import { getActiveColumnHeader, getCell, getColumnHeaderCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Row pinning', () => {
  const { render } = createRenderer({ clock: 'fake' });

  function getRowById(id: number | string) {
    return document.querySelector(`[data-id="${id}"]`);
  }

  function getTopPinnedRowsContainer() {
    return document.querySelector(`.${gridClasses['pinnedRows--top']}`) as HTMLElement;
  }
  function getBottomPinnedRowsContainer() {
    return document.querySelector(`.${gridClasses['pinnedRows--bottom']}`) as HTMLElement;
  }

  function isRowPinned(row: Element | null, section: 'top' | 'bottom') {
    const container =
      section === 'top' ? getTopPinnedRowsContainer() : getBottomPinnedRowsContainer();
    if (!row || !container) {
      return false;
    }
    return container.contains(row);
  }

  it('should render pinned rows in pinned containers', () => {
    const TestCase = () => {
      const data = getData(20, 5);

      const [pinnedRow0, pinnedRow1, ...rows] = data.rows;
      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
          />
        </div>
      );
    };

    render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should keep rows pinned on rows scroll', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }

    const TestCase = () => {
      const data = getData(20, 5);

      const [pinnedRow0, pinnedRow1, ...rows] = data.rows;
      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
          />
        </div>
      );
    };

    render(<TestCase />);

    const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
    expect(virtualScroller.scrollTop).to.equal(0);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    // scroll to the very bottom
    virtualScroller.scrollTop = 1000;
    virtualScroller.dispatchEvent(new Event('scroll'));

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should update pinned rows when `pinnedRows` prop change', () => {
    const data = getData(20, 5);
    const TestCase = (props: any) => {
      const [pinnedRow0, pinnedRow1, ...rows] = data.rows;
      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
            {...props}
          />
        </div>
      );
    };

    const { setProps } = render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    const pinnedRows = { top: [data.rows[11]], bottom: [data.rows[3]] };
    const rows = data.rows.filter((row) => row.id !== 11 && row.id !== 3);

    setProps({ pinnedRows, rows });

    expect(isRowPinned(getRowById(0), 'top')).to.equal(false, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(false, '#1 pinned bottom');

    expect(isRowPinned(getRowById(11), 'top')).to.equal(true, '#11 pinned top');
    expect(isRowPinned(getRowById(3), 'bottom')).to.equal(true, '#3 pinned bottom');
  });

  it('should update pinned rows when calling `apiRef.current.setPinnedRows` method', async () => {
    const data = getData(20, 5);
    let apiRef!: React.MutableRefObject<GridApi>;

    const TestCase = (props: any) => {
      const [pinnedRow0, pinnedRow1, ...rows] = data.rows;
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
            apiRef={apiRef}
            {...props}
          />
        </div>
      );
    };

    render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    let pinnedRows = { top: [data.rows[11]], bottom: [data.rows[3]] };
    let rows = data.rows.filter((row) => row.id !== 11 && row.id !== 3);

    // should work when calling `setPinnedRows` before `setRows`
    apiRef.current.unstable_setPinnedRows(pinnedRows);
    apiRef.current.setRows(rows);

    await waitFor(() => {
      expect(isRowPinned(getRowById(0), 'top')).to.equal(false, '#0 pinned top');
      expect(isRowPinned(getRowById(1), 'bottom')).to.equal(false, '#1 pinned bottom');

      expect(isRowPinned(getRowById(11), 'top')).to.equal(true, '#11 pinned top');
      expect(isRowPinned(getRowById(3), 'bottom')).to.equal(true, '#3 pinned bottom');
    });

    pinnedRows = { top: [data.rows[8]], bottom: [data.rows[5]] };
    rows = data.rows.filter((row) => row.id !== 8 && row.id !== 5);

    // should work when calling `setPinnedRows` after `setRows`
    apiRef.current.setRows(rows);
    apiRef.current.unstable_setPinnedRows(pinnedRows);

    await waitFor(() => {
      expect(isRowPinned(getRowById(11), 'top')).to.equal(false, '#11 pinned top');
      expect(isRowPinned(getRowById(3), 'bottom')).to.equal(false, '#3 pinned bottom');

      expect(isRowPinned(getRowById(8), 'top')).to.equal(true, '#8 pinned top');
      expect(isRowPinned(getRowById(5), 'bottom')).to.equal(true, '#5 pinned bottom');
    });
  });

  it('should work with `getRowId`', () => {
    const TestCase = () => {
      const data = getData(20, 5);

      const rowsData = data.rows.map((row) => {
        const { id, ...rowData } = row;
        return {
          ...rowData,
          productId: id,
        };
      });

      const [pinnedRow0, pinnedRow1, ...rows] = rowsData;

      const getRowId = React.useCallback((row) => row.productId, []);

      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
            getRowId={getRowId}
          />
        </div>
      );
    };

    render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should not be impacted by sorting', () => {
    const TestCase = () => {
      const data = getData(20, 5);

      const [pinnedRow0, pinnedRow1, ...rows] = data.rows;
      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
          />
        </div>
      );
    };

    render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    fireEvent.click(getColumnHeaderCell(1));

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    fireEvent.click(getColumnHeaderCell(1));

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should not be impacted by filtering', () => {
    const TestCase = (props: any) => {
      const data = getData(20, 5);

      const [pinnedRow0, pinnedRow1, ...rows] = data.rows;
      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
            {...props}
          />
        </div>
      );
    };

    const { setProps } = render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    setProps({
      filterModel: {
        items: [{ columnField: 'currencyPair', operatorValue: 'equals', value: 'GBPEUR' }],
      },
    });

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    // should show pinned rows even if there's no filtering results
    setProps({
      filterModel: {
        items: [{ columnField: 'currencyPair', operatorValue: 'equals', value: 'whatever' }],
      },
    });

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should work when there is no rows data', () => {
    const TestCase = () => {
      const data = getData(20, 5);
      const [pinnedRow0, pinnedRow1] = data.rows;

      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={[]}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
          />
        </div>
      );
    };

    render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  describe('keyboard navigation', () => {
    function fireClickEvent(cell: HTMLElement) {
      fireEvent.mouseUp(cell);
      fireEvent.click(cell);
    }

    function getActiveCellRowId() {
      const cell = document.activeElement;
      if (!cell || cell.getAttribute('role') !== 'cell') {
        return undefined;
      }
      return cell.parentElement!.getAttribute('data-id');
    }

    it('should work with top pinned rows', () => {
      const TestCase = () => {
        const data = getData(20, 5);
        const [pinnedRow0, pinnedRow1, ...rows] = data.rows;

        return (
          <div style={{ width: 302, height: 300 }}>
            <DataGridPro
              {...data}
              rows={rows}
              pinnedRows={{
                top: [pinnedRow1, pinnedRow0],
              }}
            />
          </div>
        );
      };

      render(<TestCase />);

      expect(isRowPinned(getRowById(1), 'top')).to.equal(true, '#1 pinned top');
      expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');

      fireClickEvent(getCell(0, 0));
      // first top pinned row
      expect(getActiveCellRowId()).to.equal('1');

      fireEvent.keyDown(getCell(0, 0), { key: 'ArrowDown' });
      // second top pinned row
      expect(getActiveCellRowId()).to.equal('0');

      fireEvent.keyDown(getCell(1, 0), { key: 'ArrowDown' });
      // first non-pinned row
      expect(getActiveCellRowId()).to.equal('2');

      fireEvent.keyDown(getCell(2, 0), { key: 'ArrowRight' });
      fireEvent.keyDown(getCell(2, 1), { key: 'ArrowUp' });
      fireEvent.keyDown(getCell(1, 1), { key: 'ArrowUp' });
      fireEvent.keyDown(getCell(0, 1), { key: 'ArrowUp' });
      expect(getActiveColumnHeader()).to.equal('1');
    });

    it('should work with bottom pinned rows', () => {
      const TestCase = () => {
        const data = getData(5, 5);
        const [pinnedRow0, pinnedRow1, ...rows] = data.rows;

        return (
          <div style={{ width: 302, height: 300 }}>
            <DataGridPro
              {...data}
              rows={rows}
              pinnedRows={{
                bottom: [pinnedRow0, pinnedRow1],
              }}
            />
          </div>
        );
      };

      render(<TestCase />);

      expect(isRowPinned(getRowById(0), 'bottom')).to.equal(true, '#0 pinned top');
      expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned top');

      fireClickEvent(getCell(0, 0));
      expect(getActiveCellRowId()).to.equal('2');

      fireEvent.keyDown(getCell(0, 0), { key: 'ArrowDown' });
      expect(getActiveCellRowId()).to.equal('3');

      fireEvent.keyDown(getCell(1, 0), { key: 'ArrowDown' });
      expect(getActiveCellRowId()).to.equal('4');

      fireEvent.keyDown(getCell(2, 0), { key: 'ArrowDown' });
      expect(getActiveCellRowId()).to.equal('0');

      fireEvent.keyDown(getCell(3, 0), { key: 'ArrowDown' });
      expect(getActiveCellRowId()).to.equal('1');
    });
  });

  it('should work with variable row height', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }

    const TestCase = () => {
      const data = getData(20, 5);

      const [pinnedRow0, pinnedRow1, ...rows] = data.rows;
      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
            getRowHeight={(row) => {
              if (row.id === 0) {
                return 100;
              }
              if (row.id === 1) {
                return 20;
              }
              return undefined;
            }}
          />
        </div>
      );
    };

    render(<TestCase />);

    expect(getRowById(0)?.clientHeight).to.equal(100);
    expect(getRowById(1)?.clientHeight).to.equal(20);
  });
});
