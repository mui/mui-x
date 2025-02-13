import * as React from 'react';
import { stub, SinonStub, spy } from 'sinon';
import { expect } from 'chai';
import { RefObject } from '@mui/x-internals/types';
import { spyApi, getCell, grid } from 'test/utils/helperFn';
import { createRenderer, act, screen, waitFor } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
  useGridApiRef,
  gridClasses,
} from '@mui/x-data-grid-premium';
import { getBasicGridData } from '@mui/x-data-grid-generator';
import { isJSDOM, describeSkipIf } from 'test/utils/skipIf';

describe('<DataGridPremium /> - Cell selection', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function TestDataGridSelection({
    rowLength = 4,
    width = 400,
    height = 300,
    ...other
  }: Omit<DataGridPremiumProps, 'rows' | 'columns' | 'apiRef'> &
    Partial<Pick<DataGridPremiumProps, 'rows' | 'columns'>> & {
      rowLength?: number;
      width?: number;
      height?: number;
    }) {
    apiRef = useGridApiRef();

    const data = React.useMemo(() => getBasicGridData(rowLength, 3), [rowLength]);

    return (
      <div style={{ width, height }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          rowSelection={false}
          cellSelection
          disableVirtualization
          hideFooter
          {...other}
        />
      </div>
    );
  }

  it('should select the cell clicked', async () => {
    const { user } = render(<TestDataGridSelection />);
    expect(document.querySelector('.Mui-selected')).to.equal(null);
    const cell = getCell(0, 1);

    await user.click(cell);
    expect(document.querySelector('.Mui-selected')).to.equal(cell);
  });

  it('should unselect already selected cells when selecting a cell', async () => {
    const { user } = render(<TestDataGridSelection />);
    const cell01 = getCell(0, 1);
    await user.click(cell01);
    expect(cell01).to.have.class('Mui-selected');
    const cell11 = getCell(1, 1);
    await user.click(cell11);
    expect(cell01).not.to.have.class('Mui-selected');
    expect(cell11).to.have.class('Mui-selected');
  });

  // https://github.com/mui/mui-x/issues/10777
  it('should work with the paginated grid', async () => {
    const { user } = render(
      <TestDataGridSelection
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 3 }, rowCount: 4 } }}
        rowLength={30}
        pagination
        pageSizeOptions={[3]}
        hideFooter={false}
      />,
    );
    const cell01 = getCell(2, 0);
    await user.click(cell01);
    expect(cell01).to.have.class('Mui-selected');
    await user.click(screen.getByRole('button', { name: /next page/i }));
    const cell02 = getCell(5, 0);
    await user.click(cell02);
    expect(cell02).to.have.class('Mui-selected');
  });

  describe('Ctrl + click', () => {
    it('should add the clicked cells to the selection', async () => {
      const { user } = render(<TestDataGridSelection />);
      expect(document.querySelector('.Mui-selected')).to.equal(null);
      const cell11 = getCell(1, 1);
      await user.click(cell11);
      expect(cell11).to.have.class('Mui-selected');
      const cell21 = getCell(2, 1);
      await user.keyboard('{Control>}');
      await user.click(cell21);
      await user.keyboard('{/Control}');
      expect(cell21).to.have.class('Mui-selected');
      expect(cell11).to.have.class('Mui-selected');
    });

    it('should unselect the cell if the cell is already selected', async () => {
      const { user } = render(<TestDataGridSelection />);
      expect(document.querySelector('.Mui-selected')).to.equal(null);
      const cell = getCell(1, 1);
      await user.click(cell);
      expect(cell).to.have.class('Mui-selected');
      await user.keyboard('{Control>}');
      await user.click(cell);
      await user.keyboard('{/Control}');
      expect(cell).not.to.have.class('Mui-selected');
    });
  });

  describe('Shift + click', () => {
    it('should select all cells between two cells', async () => {
      const { user } = render(<TestDataGridSelection />);
      expect(document.querySelector('.Mui-selected')).to.equal(null);
      const cell = getCell(0, 0);
      cell.focus();
      await user.click(cell);
      await user.keyboard('{Shift>}');
      await user.click(getCell(2, 1));
      await user.keyboard('{/Shift}');
      expect(document.querySelectorAll('.Mui-selected')).to.have.length(3 * 2); // 3 rows with 2 cells each
    });

    it('should call selectCellRange', async () => {
      const { user } = render(<TestDataGridSelection />);
      const spiedSelectCellsBetweenRange = spyApi(apiRef.current!, 'selectCellRange');

      const cell = getCell(0, 0);
      cell.focus();
      await user.click(cell);
      await user.keyboard('{Shift>}');
      await user.click(getCell(2, 1));
      await user.keyboard('{/Shift}');
      expect(spiedSelectCellsBetweenRange.lastCall.args[0]).to.deep.equal({ id: 0, field: 'id' });
      expect(spiedSelectCellsBetweenRange.lastCall.args[1]).to.deep.equal({
        id: 2,
        field: 'currencyPair',
      });
    });

    it('should add classes to the cells that are at the corners of a range', async () => {
      const { user } = render(<TestDataGridSelection />);
      const cell = getCell(0, 0);
      cell.focus();
      await user.click(cell);
      await user.keyboard('{Shift>}');
      await user.click(getCell(2, 2));
      await user.keyboard('{/Shift}');

      expect(getCell(0, 0)).to.have.class(gridClasses['cell--rangeTop']);
      expect(getCell(0, 0)).to.have.class(gridClasses['cell--rangeLeft']);
      expect(getCell(0, 1)).to.have.class(gridClasses['cell--rangeTop']);
      expect(getCell(0, 2)).to.have.class(gridClasses['cell--rangeRight']);
      expect(getCell(0, 2)).to.have.class(gridClasses['cell--rangeTop']);

      expect(getCell(1, 0)).to.have.class(gridClasses['cell--rangeLeft']);
      expect(getCell(1, 2)).to.have.class(gridClasses['cell--rangeRight']);

      expect(getCell(2, 0)).to.have.class(gridClasses['cell--rangeBottom']);
      expect(getCell(2, 0)).to.have.class(gridClasses['cell--rangeLeft']);
      expect(getCell(2, 1)).to.have.class(gridClasses['cell--rangeBottom']);
      expect(getCell(2, 2)).to.have.class(gridClasses['cell--rangeRight']);
      expect(getCell(2, 2)).to.have.class(gridClasses['cell--rangeBottom']);
    });

    it('should keep the focus on first clicked cell', async () => {
      const { user } = render(<TestDataGridSelection />);
      const cell = getCell(0, 0);
      cell.focus();
      expect(cell).toHaveFocus();
      await user.click(cell);
      await user.keyboard('{Shift>}');
      await user.click(getCell(2, 1));
      await user.keyboard('{/Shift}');
      expect(cell).toHaveFocus();
    });
  });

  describe('Shift + arrow keys', () => {
    it('should call selectCellRange when ArrowDown is pressed', async () => {
      const { user } = render(<TestDataGridSelection />);
      const spiedSelectCellsBetweenRange = spyApi(apiRef.current!, 'selectCellRange');
      const cell = getCell(0, 0);
      cell.focus();
      await user.click(cell);
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
      expect(spiedSelectCellsBetweenRange.lastCall.args[0]).to.deep.equal({ id: 0, field: 'id' });
      expect(spiedSelectCellsBetweenRange.lastCall.args[1]).to.deep.equal({ id: 1, field: 'id' });
    });

    it('should call selectCellRange when ArrowUp is pressed', async () => {
      const { user } = render(<TestDataGridSelection />);
      const spiedSelectCellsBetweenRange = spyApi(apiRef.current!, 'selectCellRange');
      const cell = getCell(1, 0);
      await act(() => {
        cell.focus();
      });
      await user.click(cell);
      await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
      expect(spiedSelectCellsBetweenRange.lastCall.args[0]).to.deep.equal({ id: 1, field: 'id' });
      expect(spiedSelectCellsBetweenRange.lastCall.args[1]).to.deep.equal({ id: 0, field: 'id' });
    });

    it('should call selectCellRange when ArrowLeft is pressed', async () => {
      const { user } = render(<TestDataGridSelection />);
      const spiedSelectCellsBetweenRange = spyApi(apiRef.current!, 'selectCellRange');
      const cell = getCell(0, 1);
      cell.focus();
      await user.click(cell);
      await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
      expect(spiedSelectCellsBetweenRange.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'currencyPair',
      });
      expect(spiedSelectCellsBetweenRange.lastCall.args[1]).to.deep.equal({ id: 0, field: 'id' });
    });

    it('should call selectCellRange when ArrowRight is pressed', async () => {
      const { user } = render(<TestDataGridSelection />);
      const spiedSelectCellsBetweenRange = spyApi(apiRef.current!, 'selectCellRange');
      const cell = getCell(0, 0);
      cell.focus();
      await user.click(cell);
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
      expect(spiedSelectCellsBetweenRange.lastCall.args[0]).to.deep.equal({ id: 0, field: 'id' });
      expect(spiedSelectCellsBetweenRange.lastCall.args[1]).to.deep.equal({
        id: 0,
        field: 'currencyPair',
      });
    });

    it('should keep the focus on first clicked cell', async () => {
      const { user } = render(<TestDataGridSelection />);
      const cell = getCell(0, 0);
      cell.focus();
      await user.click(cell);
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
      expect(cell).toHaveFocus();
    });
  });

  describe('onCellSelectionModelChange', () => {
    it('should update the selection state when a cell is selected', async () => {
      const onCellSelectionModelChange = spy();
      const { user } = render(
        <TestDataGridSelection
          cellSelectionModel={{}}
          onCellSelectionModelChange={onCellSelectionModelChange}
        />,
      );
      await user.click(getCell(0, 0));

      expect(onCellSelectionModelChange.callCount).to.equal(1);
      expect(onCellSelectionModelChange.lastCall.args[0]).to.deep.equal({ '0': { id: true } });
    });

    // Context: https://github.com/mui/mui-x/issues/14184
    it('should add the new cell selection range to the existing state', async () => {
      const onCellSelectionModelChange = spy();
      const { user } = render(
        <TestDataGridSelection
          cellSelectionModel={{ '0': { id: true } }}
          onCellSelectionModelChange={onCellSelectionModelChange}
        />,
      );

      // Add a new cell range to the selection
      const isMac = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;

      await user.keyboard(isMac ? '{Meta>}' : '{Control>}');
      await user.pointer([
        // touch the screen at element1
        { keys: '[MouseLeft>]', target: getCell(2, 0) },
        // move the touch pointer to element2
        { target: getCell(3, 0) },
        // release the touch pointer at the last position (element2)
        { keys: '[/MouseLeft]' },
      ]);
      await user.keyboard(isMac ? '{/Meta}' : '{/Control}');

      expect(onCellSelectionModelChange.lastCall.args[0]).to.deep.equal({
        '0': { id: true },
        '2': { id: true },
        '3': { id: true },
      });
    });
  });

  describe('apiRef', () => {
    describe('selectCellRange', () => {
      it('should select all cells within the given arguments if end > start', async () => {
        render(<TestDataGridSelection />);
        act(() =>
          apiRef.current?.selectCellRange({ id: 0, field: 'id' }, { id: 2, field: 'price1M' }),
        );

        expect(getCell(0, 0)).to.have.class('Mui-selected');
        expect(getCell(0, 1)).to.have.class('Mui-selected');
        expect(getCell(0, 2)).to.have.class('Mui-selected');

        expect(getCell(1, 0)).to.have.class('Mui-selected');
        expect(getCell(1, 1)).to.have.class('Mui-selected');
        expect(getCell(1, 2)).to.have.class('Mui-selected');

        expect(getCell(2, 0)).to.have.class('Mui-selected');
        expect(getCell(2, 1)).to.have.class('Mui-selected');
        expect(getCell(2, 2)).to.have.class('Mui-selected');
      });

      it('should select all cells within the given arguments if start > end', async () => {
        render(<TestDataGridSelection />);
        await act(() =>
          apiRef.current?.selectCellRange({ id: 0, field: 'id' }, { id: 2, field: 'price1M' }),
        );

        expect(getCell(0, 0)).to.have.class('Mui-selected');
        expect(getCell(0, 1)).to.have.class('Mui-selected');
        expect(getCell(0, 2)).to.have.class('Mui-selected');

        expect(getCell(1, 0)).to.have.class('Mui-selected');
        expect(getCell(1, 1)).to.have.class('Mui-selected');
        expect(getCell(1, 2)).to.have.class('Mui-selected');

        expect(getCell(2, 0)).to.have.class('Mui-selected');
        expect(getCell(2, 1)).to.have.class('Mui-selected');
        expect(getCell(2, 2)).to.have.class('Mui-selected');
      });

      it('should discard previously selected cells and keep only the ones inside the range', async () => {
        render(
          <TestDataGridSelection
            initialState={{ cellSelection: { 0: { id: true, currencyPair: true, price1M: true } } }}
          />,
        );

        expect(getCell(0, 0)).to.have.class('Mui-selected');
        expect(getCell(0, 1)).to.have.class('Mui-selected');
        expect(getCell(0, 2)).to.have.class('Mui-selected');

        act(() =>
          apiRef.current?.selectCellRange({ id: 1, field: 'id' }, { id: 2, field: 'price1M' }),
        );

        expect(getCell(0, 0)).not.to.have.class('Mui-selected');
        expect(getCell(0, 1)).not.to.have.class('Mui-selected');
        expect(getCell(0, 2)).not.to.have.class('Mui-selected');

        expect(getCell(1, 0)).to.have.class('Mui-selected');
        expect(getCell(1, 1)).to.have.class('Mui-selected');
        expect(getCell(1, 2)).to.have.class('Mui-selected');

        expect(getCell(2, 0)).to.have.class('Mui-selected');
        expect(getCell(2, 1)).to.have.class('Mui-selected');
        expect(getCell(2, 2)).to.have.class('Mui-selected');
      });
    });

    describe('getSelectedCellsAsArray', () => {
      it('should return the selected cells as an array', () => {
        render(
          <TestDataGridSelection
            cellSelectionModel={{ 0: { id: true, currencyPair: true, price1M: false } }}
          />,
        );
        expect(apiRef.current?.getSelectedCellsAsArray()).to.deep.equal([
          { id: 0, field: 'id' },
          { id: 0, field: 'currencyPair' },
        ]);
      });
    });
  });

  // JSDOM doesn't support scroll events
  describeSkipIf(isJSDOM)('Auto-scroll', () => {
    beforeEach(() => {
      stub(window, 'requestAnimationFrame').callsFake(() => 0);
    });

    afterEach(() => {
      (window.requestAnimationFrame as SinonStub).restore();
    });

    it('should auto-scroll when the mouse approaches the bottom edge', async () => {
      const rowHeight = 30;
      const columnHeaderHeight = 50;
      const border = 1;
      const { user } = render(
        <TestDataGridSelection
          rowLength={20}
          rowHeight={30}
          columnHeaderHeight={50}
          height={rowHeight * 8 + columnHeaderHeight + 2 * border}
          width={400}
        />,
      );
      const cell11 = getCell(1, 1);
      const cell71 = getCell(7, 1);
      const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
      const rect = virtualScroller.getBoundingClientRect();
      expect(virtualScroller.scrollTop).to.equal(0);
      await user.pointer([
        { keys: '[MouseLeft>]', target: cell11 },
        // 25=half speed
        { target: cell71, coords: { x: rect.x, y: rect.y + rect.height - 25 } },
        { keys: '[/MouseLeft]' },
      ]);
      expect(virtualScroller.scrollTop).to.equal(10);

      await act(async () => {
        virtualScroller.scrollTop = 0;
        virtualScroller.dispatchEvent(new Event('scroll'));
      });

      expect(virtualScroller.scrollTop).to.equal(0);

      // Test is a bit flaky, so we wrap the pointer in a waitFor to retry
      await waitFor(async () => {
        await user.pointer([
          { keys: '[MouseLeft>]', target: cell11 },
          // 0=full speed
          { target: cell71, coords: { x: rect.x, y: rect.y + rect.height + 0 } },
          { keys: '[/MouseLeft]' },
        ]);

        expect(virtualScroller.scrollTop).to.equal(20);
      });
    });

    it('should auto-scroll when the mouse approaches the top edge', async () => {
      const rowHeight = 30;
      const columnHeaderHeight = 50;
      const border = 1;
      const { user } = render(
        <TestDataGridSelection
          rowLength={20}
          rowHeight={30}
          columnHeaderHeight={50}
          height={rowHeight * 8 + columnHeaderHeight + 2 * border}
          width={400}
        />,
      );
      const cell11 = getCell(1, 1);
      const cell71 = getCell(7, 1);

      const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
      const gridRect = grid('root')!.getBoundingClientRect();

      await act(async () => {
        virtualScroller.scrollTop = 30;
        virtualScroller.dispatchEvent(new Event('scroll'));
      });
      expect(virtualScroller.scrollTop).to.equal(30);

      await user.pointer([
        { keys: '[MouseLeft>]', target: cell71 },
        {
          target: cell11,
          coords: {
            x: gridRect.x,
            // 25=half speed
            y: gridRect.y + border + columnHeaderHeight + 25,
          },
        },
        { keys: '[/MouseLeft]' },
      ]);
      expect(virtualScroller.scrollTop).to.equal(20);

      await user.pointer([
        { keys: '[MouseLeft>]', target: cell71 },
        {
          target: cell11,
          coords: {
            x: gridRect.x,
            // 0=full speed
            y: gridRect.y + border + columnHeaderHeight + 0,
          },
        },
        { keys: '[/MouseLeft]' },
      ]);
      expect(virtualScroller.scrollTop).to.equal(0);
    });
  });
});
