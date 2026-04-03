import * as React from 'react';
import { stub, type SinonStub, spy } from 'sinon';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { type RefObject } from '@mui/x-internals/types';
import { spyApi, getCell, grid } from 'test/utils/helperFn';
import { createRenderer, act, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  type DataGridPremiumProps,
  type GridApi,
  type GridColDef,
  useGridApiRef,
  gridClasses,
} from '@mui/x-data-grid-premium';
import { getBasicGridData } from '@mui/x-data-grid-generator';
import { isJSDOM } from 'test/utils/skipIf';

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

  function renderRtl(node: React.ReactElement) {
    const rtlTheme = createTheme({ direction: 'rtl' });

    return render(
      <ThemeProvider theme={rtlTheme}>
        <div dir="rtl">{node}</div>
      </ThemeProvider>,
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

  describe('Editing', () => {
    // https://github.com/mui/mui-x/issues/20542
    it('should not clear cell selection (from shift key) when pressing space in edit mode', async () => {
      const columns = [{ field: 'id' }, { field: 'name', editable: true }, { field: 'age' }];
      const rows = [
        { id: 0, name: 'Alice', age: 30 },
        { id: 1, name: 'Bob', age: 25 },
        { id: 2, name: 'Charlie', age: 35 },
      ];
      const { user } = render(<TestDataGridSelection columns={columns} rows={rows} />);

      // Click the editable cell first, then Shift+click to extend selection
      const editableCell = getCell(0, 1); // name column (editable)
      await user.click(editableCell);
      await user.keyboard('{Shift>}');
      await user.click(getCell(1, 1));
      await user.keyboard('{/Shift}');

      expect(document.querySelectorAll('.Mui-selected')).to.have.length(2);

      // Start typing to enter edit mode and type **space** character
      // Focus is on the editable cell, so typing will start editing
      await user.keyboard('Hello World');

      expect(document.querySelectorAll('.Mui-selected')).to.have.length(2);
    });

    it('should not clear cell selection (from dragging) when pressing space in edit mode', async () => {
      const columns = [{ field: 'id' }, { field: 'name', editable: true }, { field: 'age' }];
      const rows = [
        { id: 0, name: 'Alice', age: 30 },
        { id: 1, name: 'Bob', age: 25 },
        { id: 2, name: 'Charlie', age: 35 },
      ];
      const { user } = render(<TestDataGridSelection columns={columns} rows={rows} />);

      // Drag to select cells
      await user.pointer([
        { keys: '[MouseLeft>]', target: getCell(0, 1) },
        { target: getCell(1, 1) },
        { keys: '[/MouseLeft]' },
      ]);

      expect(document.querySelectorAll('.Mui-selected')).to.have.length(2);

      // Start typing to enter edit mode and type **space** character
      // Focus is on the editable cell, so typing will start editing
      await user.keyboard('Hello World');

      expect(document.querySelectorAll('.Mui-selected')).to.have.length(2);
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

  describe('Fill down', () => {
    it('should emit clipboard paste events once for a multi-column Ctrl+D fill', async () => {
      const onClipboardPasteStart = spy();
      const onClipboardPasteEnd = spy();
      const columns: GridColDef[] = [
        { field: 'id' },
        { field: 'name', editable: true },
        { field: 'quantity', editable: true, type: 'number' },
      ];
      const rows = [
        { id: 0, name: 'Keyboard', quantity: 10 },
        { id: 1, name: 'Mouse', quantity: 20 },
      ];
      const { user } = render(
        <TestDataGridSelection
          rows={rows}
          columns={columns}
          cellSelectionFillHandle
          onClipboardPasteStart={onClipboardPasteStart}
          onClipboardPasteEnd={onClipboardPasteEnd}
        />,
      );

      const startCell = getCell(0, 1);
      startCell.focus();
      await user.click(startCell);
      await user.keyboard('{Shift>}');
      await user.click(getCell(1, 2));
      await user.keyboard('{/Shift}');

      fireEvent.keyDown(startCell, { key: 'd', keyCode: 68, ctrlKey: true });

      await waitFor(() => {
        expect(onClipboardPasteStart.callCount).to.equal(1);
        expect(onClipboardPasteEnd.callCount).to.equal(1);
      });

      expect(onClipboardPasteStart.lastCall.args[0]).to.deep.equal({
        data: [['Keyboard', '10']],
      });
      expect(getCell(1, 1)).to.have.text('Keyboard');
      expect(getCell(1, 2)).to.have.text('10');
    });

    it('should use clipboard serialization when filling down complex values', async () => {
      const columns: GridColDef[] = [
        { field: 'id' },
        {
          field: 'status',
          editable: true,
          valueFormatter: (value: { label: string } | null) => value?.label ?? '',
          pastedValueParser: (value: string) => ({ label: value }),
          renderCell: (params) => params.value?.label ?? '',
        },
      ];
      const rows = [
        { id: 0, status: { label: 'Open' } },
        { id: 1, status: { label: 'Closed' } },
      ];
      const { user } = render(
        <TestDataGridSelection rows={rows} columns={columns} cellSelectionFillHandle />,
      );

      const startCell = getCell(0, 1);
      startCell.focus();
      await user.click(startCell);
      await user.keyboard('{Shift>}');
      await user.click(getCell(1, 1));
      await user.keyboard('{/Shift}');

      fireEvent.keyDown(startCell, { key: 'd', keyCode: 68, ctrlKey: true });

      await waitFor(() => {
        expect(getCell(1, 1)).to.have.text('Open');
      });
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
  describe.skipIf(isJSDOM)('Auto-scroll', () => {
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
        virtualScroller.scrollTo({ top: 30 });
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

  describe('Fill handle', () => {
    const fillColumns = [
      { field: 'id', type: 'number' as const },
      { field: 'name', editable: true },
      { field: 'value', type: 'number' as const, editable: true },
      { field: 'category', editable: true },
      { field: 'readOnly' },
    ];
    const fillRows = [
      { id: 0, name: 'Alice', value: 10, category: 'A', readOnly: 'x' },
      { id: 1, name: 'Bob', value: 20, category: 'B', readOnly: 'y' },
      { id: 2, name: 'Charlie', value: 30, category: 'C', readOnly: 'z' },
      { id: 3, name: '', value: 0, category: '', readOnly: 'w' },
      { id: 4, name: '', value: 0, category: '', readOnly: 'v' },
      { id: 5, name: '', value: 0, category: '', readOnly: 'u' },
    ];

    describe('Fill handle visibility', () => {
      it('should not show fill handle when `cellSelectionFillHandle` is false', async () => {
        const { user } = render(<TestDataGridSelection columns={fillColumns} rows={fillRows} />);
        await user.click(getCell(0, 1)); // editable 'name' column
        expect(document.querySelector(`.${gridClasses['cell--withFillHandle']}`)).to.equal(null);
      });

      it('should show fill handle on the bottom-right cell of selection', async () => {
        const { user } = render(
          <TestDataGridSelection columns={fillColumns} rows={fillRows} cellSelectionFillHandle />,
        );
        await user.click(getCell(0, 1)); // editable 'name' column
        expect(getCell(0, 1)).to.have.class(gridClasses['cell--withFillHandle']);
      });

      it('should show fill handle on the bottom-right cell of a multi-cell selection', async () => {
        const { user } = render(
          <TestDataGridSelection columns={fillColumns} rows={fillRows} cellSelectionFillHandle />,
        );
        await user.click(getCell(0, 1));
        await user.keyboard('{Shift>}');
        await user.click(getCell(2, 3));
        await user.keyboard('{/Shift}');

        // Only the bottom-right cell should have the fill handle
        expect(getCell(2, 3)).to.have.class(gridClasses['cell--withFillHandle']);
        expect(getCell(0, 1)).not.to.have.class(gridClasses['cell--withFillHandle']);
        expect(getCell(2, 1)).not.to.have.class(gridClasses['cell--withFillHandle']);
        expect(getCell(0, 3)).not.to.have.class(gridClasses['cell--withFillHandle']);
      });

      it('should not show fill handle if no selected column is editable', async () => {
        const { user } = render(
          <TestDataGridSelection columns={fillColumns} rows={fillRows} cellSelectionFillHandle />,
        );
        // Click non-editable 'id' column
        await user.click(getCell(0, 0));
        expect(document.querySelector(`.${gridClasses['cell--withFillHandle']}`)).to.equal(null);

        // Click non-editable 'readOnly' column
        await user.click(getCell(0, 4));
        expect(document.querySelector(`.${gridClasses['cell--withFillHandle']}`)).to.equal(null);
      });

      it('should show fill handle when at least one selected column in the row is editable', async () => {
        const { user } = render(
          <TestDataGridSelection columns={fillColumns} rows={fillRows} cellSelectionFillHandle />,
        );
        // Select range including 'id' (non-editable) and 'name' (editable)
        await user.click(getCell(0, 0));
        await user.keyboard('{Shift>}');
        await user.click(getCell(0, 1));
        await user.keyboard('{/Shift}');

        expect(document.querySelector(`.${gridClasses['cell--withFillHandle']}`)).not.to.equal(
          null,
        );
      });
    });

    describe('Ctrl+D - Fill down', () => {
      it('should fill the cell below with the selected cell value', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        const cell = getCell(0, 1); // 'Alice'
        await user.click(cell);
        fireEvent.keyDown(cell, { key: 'd', keyCode: 68, ctrlKey: true });

        await waitFor(() => {
          expect(getCell(1, 1).textContent).to.equal('Alice');
        });
        expect(processRowUpdateSpy.callCount).to.equal(1);
      });

      it('should move selection to the filled cell after single-cell fill', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        const cell = getCell(0, 1); // 'Alice'
        await user.click(cell);
        fireEvent.keyDown(cell, { key: 'd', keyCode: 68, ctrlKey: true });

        await waitFor(() => {
          expect(getCell(1, 1).textContent).to.equal('Alice');
        });
        expect(getCell(0, 1)).not.to.have.class('Mui-selected');
        expect(getCell(1, 1)).to.have.class('Mui-selected');
      });

      it('should not fill if the column is not editable', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        const cell = getCell(0, 0); // non-editable 'id' column
        await user.click(cell);
        fireEvent.keyDown(cell, { key: 'd', keyCode: 68, ctrlKey: true });

        expect(processRowUpdateSpy.callCount).to.equal(0);
        expect(getCell(1, 0).textContent).to.equal('1');
      });

      it('should not fill if the cell is in the last visible row', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        const cell = getCell(5, 1); // last row
        await user.click(cell);
        fireEvent.keyDown(cell, { key: 'd', keyCode: 68, ctrlKey: true });

        expect(processRowUpdateSpy.callCount).to.equal(0);
      });

      it('should fill all rows below the top row when multiple cells are selected', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        // Select cells (0,1), (1,1), (2,1) via Shift+click
        const startCell = getCell(0, 1);
        await user.click(startCell);
        await user.keyboard('{Shift>}');
        await user.click(getCell(2, 1));
        await user.keyboard('{/Shift}');

        fireEvent.keyDown(startCell, { key: 'd', keyCode: 68, ctrlKey: true });

        // Top row value 'Alice' should fill rows 1 and 2
        await waitFor(() => {
          expect(getCell(1, 1).textContent).to.equal('Alice');
        });
        expect(getCell(2, 1).textContent).to.equal('Alice');
        expect(processRowUpdateSpy.callCount).to.equal(2);
      });

      it('should skip non-editable columns when filling with Ctrl+D', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        // Select range including non-editable 'id' (col 0) and editable 'name' (col 1)
        const startCell = getCell(0, 0);
        await user.click(startCell);
        await user.keyboard('{Shift>}');
        await user.click(getCell(1, 1));
        await user.keyboard('{/Shift}');

        fireEvent.keyDown(startCell, { key: 'd', keyCode: 68, ctrlKey: true });

        // Only editable 'name' column should be filled
        await waitFor(() => {
          expect(getCell(1, 1).textContent).to.equal('Alice');
        });
        // Non-editable 'id' column should remain unchanged
        expect(getCell(1, 0).textContent).to.equal('1');
      });

      it('should fill down when a single row with multiple columns is selected', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        // Select name (col 1) and value (col 2) in row 0
        const startCell = getCell(0, 1);
        await user.click(startCell);
        await user.keyboard('{Shift>}');
        await user.click(getCell(0, 2));
        await user.keyboard('{/Shift}');

        fireEvent.keyDown(startCell, { key: 'd', keyCode: 68, ctrlKey: true });

        // Row 1 should be filled with row 0 values
        await waitFor(() => {
          expect(getCell(1, 1).textContent).to.equal('Alice');
        });
        expect(getCell(1, 2).textContent).to.equal('10');
        expect(processRowUpdateSpy.callCount).to.equal(1);
      });

      it('should skip non-editable columns when filling single-row multi-column with Ctrl+D', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        // Select id (col 0, non-editable) and name (col 1, editable) in row 0
        const startCell = getCell(0, 0);
        await user.click(startCell);
        await user.keyboard('{Shift>}');
        await user.click(getCell(0, 1));
        await user.keyboard('{/Shift}');

        fireEvent.keyDown(startCell, { key: 'd', keyCode: 68, ctrlKey: true });

        // Only editable 'name' column should be filled
        await waitFor(() => {
          expect(getCell(1, 1).textContent).to.equal('Alice');
        });
        // Non-editable 'id' column should remain unchanged
        expect(getCell(1, 0).textContent).to.equal('1');
      });
    });

    describe('Ctrl+R - Fill right', () => {
      it('should fill the cell to the right with the selected cell value', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        // value (col 2, number, editable) → category (col 3, string, editable)
        const cell = getCell(0, 2); // '10'
        await user.click(cell);
        fireEvent.keyDown(cell, { key: 'r', keyCode: 82, ctrlKey: true });

        await waitFor(() => {
          expect(getCell(0, 3).textContent).to.equal('10');
        });
        expect(processRowUpdateSpy.callCount).to.equal(1);
      });

      it('should move selection to the filled cell after single-cell fill right', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        // value (col 2) → category (col 3)
        const cell = getCell(0, 2);
        await user.click(cell);
        fireEvent.keyDown(cell, { key: 'r', keyCode: 82, ctrlKey: true });

        await waitFor(() => {
          expect(getCell(0, 3).textContent).to.equal('10');
        });
        expect(getCell(0, 2)).not.to.have.class('Mui-selected');
        expect(getCell(0, 3)).to.have.class('Mui-selected');
      });

      it('should not fill right if the target column is not editable', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        // category (col 3) → readOnly (col 4, non-editable)
        const cell = getCell(0, 3);
        await user.click(cell);
        fireEvent.keyDown(cell, { key: 'r', keyCode: 82, ctrlKey: true });

        expect(processRowUpdateSpy.callCount).to.equal(0);
        expect(getCell(0, 4).textContent).to.equal('x');
      });

      it('should fill all columns to the right of the leftmost column when multiple cells are selected', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        // Select name (col 1), value (col 2), category (col 3) via Shift+click
        const startCell = getCell(0, 1);
        await user.click(startCell);
        await user.keyboard('{Shift>}');
        await user.click(getCell(0, 3));
        await user.keyboard('{/Shift}');

        fireEvent.keyDown(startCell, { key: 'r', keyCode: 82, ctrlKey: true });

        // Leftmost value 'Alice' should fill value (col 2) and category (col 3)
        await waitFor(() => {
          expect(getCell(0, 3).textContent).to.equal('Alice');
        });
      });

      it('should fill right when a single column with multiple rows is selected', async () => {
        const processRowUpdateSpy = spy((newRow) => newRow);
        const { user } = render(
          <TestDataGridSelection
            columns={fillColumns}
            rows={fillRows}
            cellSelectionFillHandle
            processRowUpdate={processRowUpdateSpy}
          />,
        );

        // Select value (col 2, number) for rows 0, 1, 2
        const startCell = getCell(0, 2);
        await user.click(startCell);
        await user.keyboard('{Shift>}');
        await user.click(getCell(2, 2));
        await user.keyboard('{/Shift}');

        fireEvent.keyDown(startCell, { key: 'r', keyCode: 82, ctrlKey: true });

        // category (col 3) should be filled with value column's values
        await waitFor(() => {
          expect(getCell(0, 3).textContent).to.equal('10');
        });
        expect(getCell(1, 3).textContent).to.equal('20');
        expect(getCell(2, 3).textContent).to.equal('30');
      });
    });

    describe.skipIf(isJSDOM)('Fill via mouse drag', () => {
      /* eslint-disable testing-library/no-unnecessary-act */
      async function simulateFillDrag(
        sourceCell: HTMLElement,
        targetCell: HTMLElement,
        options?: { handleSide?: 'left' | 'right' },
      ) {
        const handleSide = options?.handleSide ?? 'right';

        act(() => {
          const rect = sourceCell.getBoundingClientRect();
          fireEvent.mouseDown(sourceCell, {
            clientX: handleSide === 'left' ? rect.left + 4 : rect.right - 4,
            clientY: rect.bottom - 4,
          });
        });
        // Mousemove to target cell
        act(() => {
          const targetRect = targetCell.getBoundingClientRect();
          const moveEvent = new MouseEvent('mousemove', {
            clientX: targetRect.x + targetRect.width / 2,
            clientY: targetRect.y + targetRect.height / 2,
            bubbles: true,
          });
          document.dispatchEvent(moveEvent);
        });
        // Wait for rAF-throttled mousemove handler to execute
        await act(async () => {
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(resolve as FrameRequestCallback);
            });
          });
        });
        // Mouseup triggers applyFill
        act(() => {
          document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        });
      }
      /* eslint-enable testing-library/no-unnecessary-act */

      describe('Vertical fill', () => {
        it('should fill down when dragging the fill handle downward', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          await user.click(getCell(0, 1)); // 'Alice'

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(2, 1));

          await waitFor(() => {
            expect(getCell(1, 1).textContent).to.equal('Alice');
          });
          expect(getCell(2, 1).textContent).to.equal('Alice');
          expect(processRowUpdateSpy.callCount).to.equal(2);
        });

        it('should start fill drag from the bottom-left corner in RTL', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = renderRtl(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          await user.click(getCell(0, 1)); // 'Alice'

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(2, 1), { handleSide: 'left' });

          await waitFor(() => {
            expect(getCell(1, 1).textContent).to.equal('Alice');
          });
          expect(getCell(2, 1).textContent).to.equal('Alice');
          expect(processRowUpdateSpy.callCount).to.equal(2);
        });

        it('should cycle source values when filling with multiple source rows', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              height={500}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          // Select rows 0 and 1 in 'name' column ("Alice", "Bob")
          await user.click(getCell(0, 1));
          await user.keyboard('{Shift>}');
          await user.click(getCell(1, 1));
          await user.keyboard('{/Shift}');

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(5, 1));

          // Should cycle: Alice, Bob, Alice, Bob
          await waitFor(() => {
            expect(getCell(2, 1).textContent).to.equal('Alice');
          });
          expect(getCell(3, 1).textContent).to.equal('Bob');
          expect(getCell(4, 1).textContent).to.equal('Alice');
          expect(getCell(5, 1).textContent).to.equal('Bob');
        });

        it('should extend selection to include filled cells', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          await user.click(getCell(0, 1)); // 'Alice'

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(2, 1));

          await waitFor(() => {
            expect(getCell(1, 1).textContent).to.equal('Alice');
          });
          // All target cells should be selected
          expect(getCell(1, 1)).to.have.class('Mui-selected');
          expect(getCell(2, 1)).to.have.class('Mui-selected');
        });

        it('should fill multiple columns simultaneously', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          // Select cells in 'name' and 'value' columns for row 0
          await user.click(getCell(0, 1));
          await user.keyboard('{Shift>}');
          await user.click(getCell(0, 2));
          await user.keyboard('{/Shift}');

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(2, 2));

          // Both columns should be filled
          await waitFor(() => {
            expect(getCell(1, 1).textContent).to.equal('Alice');
          });
          expect(getCell(2, 1).textContent).to.equal('Alice');
          expect(getCell(1, 2).textContent).to.equal('10');
          expect(getCell(2, 2).textContent).to.equal('10');
        });
      });

      describe('Horizontal fill', () => {
        it('should fill right when dragging the fill handle to the right', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          // Select 'value' column (number) and drag right to 'category' (string)
          await user.click(getCell(0, 2)); // value=10

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(0, 3)); // drag to 'category' column

          await waitFor(() => {
            expect(getCell(0, 3).textContent).to.equal('10');
          });
        });

        it('should only fill selected rows when horizontal filling with gaps', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          // Select rows 0 and 2 in 'value' column (skipping row 1)
          await user.click(getCell(0, 2)); // value=10
          await user.keyboard('{Control>}');
          await user.click(getCell(2, 2)); // value=30
          await user.keyboard('{/Control}');

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          // Drag right to 'category' column
          await simulateFillDrag(handleCell, getCell(2, 3));

          await waitFor(() => {
            expect(getCell(0, 3).textContent).to.equal('10');
          });
          expect(getCell(2, 3).textContent).to.equal('30');
          // Row 1 should NOT be filled (it was not selected)
          expect(processRowUpdateSpy.callCount).to.equal(2);
          expect(getCell(1, 3).textContent).to.equal('B');
        });

        it('should map source columns to target columns by offset', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          // Select 'name' and 'value' columns (cols 1 and 2)
          await user.click(getCell(0, 1));
          await user.keyboard('{Shift>}');
          await user.click(getCell(0, 2));
          await user.keyboard('{/Shift}');

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          // Drag right by 2 columns (to col 3 and beyond if available)
          await simulateFillDrag(handleCell, getCell(0, 3)); // 'category' column

          // Target col 3 should get source col 1 ('name') value by offset
          await waitFor(() => {
            expect(getCell(0, 3).textContent).to.equal('Alice');
          });
        });
      });

      describe('Fill preview', () => {
        it('should remove fill preview classes after mouse release', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          await user.click(getCell(0, 1)); // 'Alice'

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(2, 1));

          // Wait for batched row updates to flush
          await waitFor(() => {
            expect(getCell(1, 1).textContent).to.equal('Alice');
          });

          // After mouseup, no elements should have fill preview class
          expect(document.querySelectorAll(`.${gridClasses['cell--fillPreview']}`).length).to.equal(
            0,
          );
        });
      });

      describe('Non-editable columns', () => {
        it('should not update non-editable columns during fill', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          // Select editable 'name' (col 1) and non-editable 'id' (col 0) via Shift+Click
          // Since 'name' is editable, the fill handle should appear
          await user.click(getCell(0, 1)); // 'Alice' in name
          await user.keyboard('{Shift>}');
          await user.click(getCell(0, 2)); // value=10
          await user.keyboard('{/Shift}');

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(2, 2));

          // Editable columns should be filled
          await waitFor(() => {
            expect(getCell(1, 1).textContent).to.equal('Alice');
          });
          expect(getCell(2, 1).textContent).to.equal('Alice');
          // Non-editable 'id' column (col 0) should remain unchanged
          expect(getCell(1, 0).textContent).to.equal('1');
          expect(getCell(2, 0).textContent).to.equal('2');
        });
      });

      describe('processRowUpdate integration', () => {
        it('should call processRowUpdate for each affected row', async () => {
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={fillColumns}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          await user.click(getCell(0, 1)); // 'Alice'

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(2, 1));

          await waitFor(() => {
            expect(processRowUpdateSpy.callCount).to.equal(2);
          });
          // First call: row 1
          expect(processRowUpdateSpy.args[0][0].name).to.equal('Alice');
          expect((processRowUpdateSpy.args[0] as any)[1].name).to.equal('Bob');
          // Second call: row 2
          expect(processRowUpdateSpy.args[1][0].name).to.equal('Alice');
          expect((processRowUpdateSpy.args[1] as any)[1].name).to.equal('Charlie');
        });
      });

      describe('pastedValueParser', () => {
        it('should use pastedValueParser when filling a number column', async () => {
          const pastedValueParserSpy = spy((value: string) => Number(value) || 0);
          const columnsWithParser = [
            { field: 'id', type: 'number' as const },
            { field: 'name', editable: true },
            {
              field: 'value',
              type: 'number' as const,
              editable: true,
              pastedValueParser: pastedValueParserSpy,
            },
            { field: 'category', editable: true },
          ];
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={columnsWithParser}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          await user.click(getCell(0, 2)); // value=10

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(1, 2));

          await waitFor(() => {
            expect(pastedValueParserSpy.callCount).to.be.greaterThan(0);
          });
          expect(processRowUpdateSpy.callCount).to.equal(1);
        });

        it('should use valueParser as fallback when pastedValueParser is not defined', async () => {
          const valueParserSpy = spy((value: string) => Number(value) || 0);
          const columnsWithValueParser = [
            { field: 'id', type: 'number' as const },
            { field: 'name', editable: true },
            {
              field: 'value',
              type: 'number' as const,
              editable: true,
              valueParser: valueParserSpy,
            },
            { field: 'category', editable: true },
          ];
          const processRowUpdateSpy = spy((newRow) => newRow);
          const { user } = render(
            <TestDataGridSelection
              columns={columnsWithValueParser}
              rows={fillRows}
              cellSelectionFillHandle
              processRowUpdate={processRowUpdateSpy}
            />,
          );

          await user.click(getCell(0, 2)); // value=10

          const handleCell = document.querySelector(
            `.${gridClasses['cell--withFillHandle']}`,
          )! as HTMLElement;

          await simulateFillDrag(handleCell, getCell(1, 2));

          await waitFor(() => {
            expect(valueParserSpy.callCount).to.be.greaterThan(0);
          });
          expect(processRowUpdateSpy.callCount).to.equal(1);
        });
      });
    });
  });
});
