import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { createRenderer, fireEvent, screen, act, waitFor } from '@mui/internal-test-utils';
import {
  DataGrid,
  DataGridProps,
  GridInputRowSelectionModel,
  GridRowId,
  GridEditModes,
  useGridApiRef,
  GridApi,
  GridPreferencePanelsValue,
} from '@mui/x-data-grid';
import {
  getCell,
  getRow,
  getRows,
  getColumnHeaderCell,
  getColumnHeadersTextContent,
  getActiveCell,
  grid,
} from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import { getBasicGridData } from '@mui/x-data-grid-generator';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

function getSelectedRowIds() {
  const hasCheckbox = !!document.querySelector('input[type="checkbox"]');
  return Array.from(getRows())
    .filter((row) => row.classList.contains('Mui-selected'))
    .map((row) =>
      Number(
        row.querySelector(`[role="gridcell"][data-colindex="${hasCheckbox ? 1 : 0}"]`)!.textContent,
      ),
    );
}

describe('<DataGrid /> - Row selection', () => {
  const { render, clock } = createRenderer();

  const defaultData = getBasicGridData(4, 2);

  function TestDataGridSelection(props: Partial<DataGridProps>) {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          {...defaultData}
          {...props}
          autoHeight={isJSDOM}
          experimentalFeatures={{
            warnIfFocusStateIsNotSynced: true,
            ...props.experimentalFeatures,
          }}
        />
      </div>
    );
  }

  describe('prop: checkboxSelection = false (single selection)', () => {
    it('should select one row at a time on click WITHOUT ctrl or meta pressed', () => {
      render(<TestDataGridSelection />);
      fireUserEvent.mousePress(getCell(0, 0));
      expect(getSelectedRowIds()).to.deep.equal([0]);
      fireUserEvent.mousePress(getCell(1, 0));
      expect(getSelectedRowIds()).to.deep.equal([1]);
    });

    it(`should not deselect the selected row on click WITHOUT ctrl or meta pressed`, () => {
      render(<TestDataGridSelection />);
      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIds()).to.deep.equal([0]);
      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIds()).to.deep.equal([0]);
    });

    ['metaKey', 'ctrlKey'].forEach((key) => {
      it(`should select one row at a time on click WITH ${key} pressed`, () => {
        render(<TestDataGridSelection />);
        fireEvent.click(getCell(0, 0), { [key]: true });
        expect(getSelectedRowIds()).to.deep.equal([0]);
        fireEvent.click(getCell(1, 0), { [key]: true });
        expect(getSelectedRowIds()).to.deep.equal([1]);
      });

      it(`should deselect the selected row on click WITH ${key} pressed`, () => {
        render(<TestDataGridSelection />);
        fireEvent.click(getCell(0, 0));
        expect(getSelectedRowIds()).to.deep.equal([0]);
        fireEvent.click(getCell(0, 0), { [key]: true });
        expect(getSelectedRowIds()).to.deep.equal([]);
      });
    });

    it('should not select a range with shift pressed', () => {
      render(<TestDataGridSelection />);
      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIds()).to.deep.equal([0]);
      fireEvent.click(getCell(2, 0), { shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([2]);
    });
  });

  describe('prop: checkboxSelection = false (single selection), with keyboard events', () => {
    it('should select one row at a time on Shift + Space', () => {
      render(<TestDataGridSelection disableRowSelectionOnClick />);

      const cell0 = getCell(0, 0);
      fireUserEvent.mousePress(cell0);
      fireEvent.keyDown(cell0, { key: ' ', shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([0]);

      const cell1 = getCell(1, 0);
      fireUserEvent.mousePress(cell1);
      fireEvent.keyDown(cell1, { key: ' ', shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([1]);
    });

    [GridEditModes.Cell, GridEditModes.Row].forEach((editMode) => {
      it(`should select row on Shift + Space without starting editing the ${editMode}`, () => {
        const onCellEditStart = spy();
        render(
          <TestDataGridSelection
            columns={[
              { field: 'id', type: 'number' },
              { field: 'name', editable: true },
            ]}
            rows={[
              { id: 0, name: 'React' },
              { id: 1, name: 'Vue' },
            ]}
            onCellEditStart={onCellEditStart}
            editMode={editMode}
            disableRowSelectionOnClick
          />,
        );
        expect(onCellEditStart.callCount).to.equal(0);

        const cell01 = getCell(0, 1);
        fireUserEvent.mousePress(cell01);

        fireEvent.keyDown(cell01, { key: ' ', shiftKey: true });

        expect(onCellEditStart.callCount).to.equal(0);
        expect(getSelectedRowIds()).to.deep.equal([0]);

        const cell11 = getCell(1, 1);
        fireUserEvent.mousePress(cell11);
        fireEvent.keyDown(cell11, { key: ' ', shiftKey: true });

        expect(onCellEditStart.callCount).to.equal(0);
        expect(getSelectedRowIds()).to.deep.equal([1]);
      });
    });

    it(`should deselect the selected row on Shift + Space`, () => {
      render(<TestDataGridSelection disableRowSelectionOnClick />);
      const cell00 = getCell(0, 0);
      fireUserEvent.mousePress(cell00);

      fireEvent.keyDown(cell00, { key: ' ', shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([0]);

      fireEvent.keyDown(cell00, { key: ' ', shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([]);
    });

    it('should not select a range with shift pressed', () => {
      render(<TestDataGridSelection disableRowSelectionOnClick />);
      const cell00 = getCell(0, 0);
      fireUserEvent.mousePress(cell00);

      fireEvent.keyDown(cell00, { key: ' ', shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([0]);

      fireEvent.keyDown(cell00, {
        key: 'ArrowDown',
        shiftKey: true,
      });

      expect(getSelectedRowIds()).to.deep.equal([1]);
    });
  });

  describe('prop: checkboxSelection = true (multi selection)', () => {
    it('should allow to toggle prop.checkboxSelection', () => {
      const { setProps } = render(<TestDataGridSelection />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'Currency Pair']);
      expect(getColumnHeaderCell(0).querySelectorAll('input')).to.have.length(0);
      setProps({ checkboxSelection: true });
      expect(getColumnHeadersTextContent()).to.deep.equal(['', 'id', 'Currency Pair']);
      expect(getColumnHeaderCell(0).querySelectorAll('input')).to.have.length(1);
    });

    it('should check then uncheck when clicking twice the row', () => {
      render(<TestDataGridSelection checkboxSelection />);
      expect(getSelectedRowIds()).to.deep.equal([]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', false);

      fireEvent.click(getCell(0, 1));
      expect(getSelectedRowIds()).to.deep.equal([0]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', true);

      fireEvent.click(getCell(0, 1));
      expect(getSelectedRowIds()).to.deep.equal([]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', false);
    });

    it('should check and uncheck when double clicking the checkbox', () => {
      render(<TestDataGridSelection checkboxSelection />);
      expect(getSelectedRowIds()).to.deep.equal([]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', false);

      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(getSelectedRowIds()).to.deep.equal([0]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', true);

      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(getSelectedRowIds()).to.deep.equal([]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', false);
    });

    it('should set focus on the cell when clicking the checkbox', () => {
      render(<TestDataGridSelection checkboxSelection />);
      expect(getActiveCell()).to.equal(null);

      // simulate click
      const checkboxInput = getCell(0, 0).querySelector('input');

      fireUserEvent.mousePress(checkboxInput!);

      expect(getActiveCell()).to.equal('0-0');
    });

    it('should select all visible rows regardless of pagination', () => {
      render(
        <TestDataGridSelection
          checkboxSelection
          initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}
          pageSizeOptions={[1]}
        />,
      );
      const selectAllCheckbox = screen.getByRole('checkbox', { name: 'Select all rows' });
      fireEvent.click(selectAllCheckbox);
      expect(getSelectedRowIds()).to.deep.equal([0]);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getSelectedRowIds()).to.deep.equal([1]);
    });

    it('should check the checkbox when there is no rows', () => {
      render(<TestDataGridSelection rows={[]} checkboxSelection />);
      const selectAll = screen.getByRole('checkbox', {
        name: /select all rows/i,
      });
      expect(selectAll).to.have.property('checked', false);
    });

    it('should disable the checkbox if isRowSelectable returns false', () => {
      render(
        <TestDataGridSelection isRowSelectable={(params) => params.id === 0} checkboxSelection />,
      );
      expect(getRow(0).querySelector('input')).to.have.property('disabled', false);
      expect(getRow(1).querySelector('input')).to.have.property('disabled', true);
    });

    it('should select a range with shift pressed when clicking the row', () => {
      render(<TestDataGridSelection checkboxSelection />);
      fireEvent.click(getCell(0, 1));
      expect(getSelectedRowIds()).to.deep.equal([0]);
      fireEvent.click(getCell(2, 1), { shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
    });

    it('should select a range with shift pressed when clicking the checkbox', () => {
      render(<TestDataGridSelection checkboxSelection />);
      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(getSelectedRowIds()).to.deep.equal([0]);
      fireEvent.click(getCell(2, 0).querySelector('input')!, { shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
    });

    it('should unselect from last clicked cell to cell after clicked cell if clicking inside a selected range', () => {
      render(<TestDataGridSelection checkboxSelection disableVirtualization />);
      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(getSelectedRowIds()).to.deep.equal([0]);
      fireEvent.click(getCell(3, 0).querySelector('input')!, { shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([0, 1, 2, 3]);
      fireEvent.click(getCell(1, 0).querySelector('input')!, { shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([0, 1]);
    });

    it('should not change the selection with shift pressed when clicking on the last row of the selection', () => {
      render(<TestDataGridSelection checkboxSelection />);
      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(getSelectedRowIds()).to.deep.equal([0]);
      fireEvent.click(getCell(2, 0).querySelector('input')!, { shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
      fireEvent.click(getCell(2, 0).querySelector('input')!, { shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
    });

    it('should reset selected rows when turning off checkboxSelection', () => {
      const { setProps } = render(<TestDataGridSelection checkboxSelection />);
      fireEvent.click(getCell(0, 0).querySelector('input')!);
      fireEvent.click(getCell(1, 0).querySelector('input')!);
      expect(getSelectedRowIds()).to.deep.equal([0, 1]);
      setProps({ checkboxSelection: false });
      expect(getSelectedRowIds()).to.deep.equal([]);
    });

    it('should reset row selection in the current page as selected when turning off checkboxSelection', () => {
      const { setProps } = render(
        <TestDataGridSelection
          checkboxSelection
          pagination
          initialState={{ pagination: { paginationModel: { pageSize: 2 } } }}
          pageSizeOptions={[2]}
        />,
      );
      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(getSelectedRowIds()).to.deep.equal([0]);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      fireEvent.click(getCell(2, 0).querySelector('input')!);
      expect(screen.getByText('2 rows selected')).not.to.equal(null);
      setProps({ checkboxSelection: false });
      expect(getSelectedRowIds()).to.deep.equal([]);
      expect(screen.queryByText('2 row selected')).to.equal(null);
    });

    it('should set the correct aria-label on the column header checkbox', () => {
      render(<TestDataGridSelection checkboxSelection />);
      expect(screen.queryByRole('checkbox', { name: 'Unselect all rows' })).to.equal(null);
      expect(screen.queryByRole('checkbox', { name: 'Select all rows' })).not.to.equal(null);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
      expect(screen.queryByRole('checkbox', { name: 'Select all rows' })).to.equal(null);
      expect(screen.queryByRole('checkbox', { name: 'Unselect all rows' })).not.to.equal(null);
    });

    it('should set the correct aria-label on the cell checkbox', () => {
      render(<TestDataGridSelection checkboxSelection rows={[{ id: 0, name: 'React' }]} />);
      expect(screen.queryByRole('checkbox', { name: 'Unselect row' })).to.equal(null);
      expect(screen.queryByRole('checkbox', { name: 'Select row' })).not.to.equal(null);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Select row' }));
      expect(screen.queryByRole('checkbox', { name: 'Select row' })).to.equal(null);
      expect(screen.queryByRole('checkbox', { name: 'Unselect row' })).not.to.equal(null);
    });

    it('should not select more than one row when disableMultipleRowSelection = true', () => {
      render(<TestDataGridSelection checkboxSelection disableMultipleRowSelection />);
      const input1 = getCell(0, 0).querySelector('input')!;
      fireEvent.click(input1);
      expect(input1.checked).to.equal(true);

      const input2 = getCell(1, 0).querySelector('input')!;
      fireEvent.click(input2);
      expect(input1.checked).to.equal(false);
      expect(input2.checked).to.equal(true);
    });

    it('should only select filtered items when "select all" is toggled after applying a filter', async () => {
      render(
        <TestDataGridSelection
          checkboxSelection
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      const selectAllCheckbox = screen.getByRole('checkbox', { name: 'Select all rows' });
      fireEvent.click(selectAllCheckbox);
      await waitFor(() => {
        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2, 3]);
      });
      expect(grid('selectedRowCount')?.textContent).to.equal('4 rows selected');

      fireEvent.change(screen.getByRole('spinbutton', { name: 'Value' }), {
        target: { value: 1 },
      });
      await waitFor(() => {
        // Previous selection remains, but only one row is visible
        expect(getSelectedRowIds()).to.deep.equal([1]);
      });
      expect(grid('selectedRowCount')?.textContent).to.equal('4 rows selected');

      fireEvent.click(selectAllCheckbox); // Unselect all
      await waitFor(() => {
        expect(getSelectedRowIds()).to.deep.equal([]);
      });
      expect(grid('selectedRowCount')).to.equal(null);

      fireEvent.click(selectAllCheckbox); // Select all filtered rows
      await waitFor(() => {
        expect(getSelectedRowIds()).to.deep.equal([1]);
      });
      expect(grid('selectedRowCount')?.textContent).to.equal('1 row selected');
    });
  });

  describe('prop: checkboxSelection = true (multi selection), with keyboard events', () => {
    it('should select row below when pressing "ArrowDown" + shiftKey', () => {
      render(<TestDataGridSelection checkboxSelection />);
      fireUserEvent.mousePress(getCell(2, 1));
      expect(getSelectedRowIds()).to.deep.equal([2]);
      fireEvent.keyDown(getCell(2, 1), { key: 'ArrowDown', shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([2, 3]);
      fireEvent.keyDown(getCell(3, 1), { key: 'ArrowDown' });
      expect(getSelectedRowIds()).to.deep.equal([2, 3]); // Already on the last row
    });

    it('should unselect previous row when pressing "ArrowDown" + shiftKey', () => {
      render(<TestDataGridSelection checkboxSelection />);
      fireUserEvent.mousePress(getCell(3, 1));
      expect(getSelectedRowIds()).to.deep.equal([3]);

      fireUserEvent.mousePress(getCell(1, 1), { shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]);
      fireEvent.keyDown(getCell(1, 1), { key: 'ArrowDown', shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([2, 3]);
    });

    it('should not unselect row above when pressing "ArrowDown" + shiftKey', () => {
      render(<TestDataGridSelection checkboxSelection />);
      fireUserEvent.mousePress(getCell(1, 1));
      expect(getSelectedRowIds()).to.deep.equal([1]);
      fireUserEvent.mousePress(getCell(2, 1), { shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([1, 2]);
      fireEvent.keyDown(getCell(2, 1), { key: 'ArrowDown', shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]);
      fireEvent.keyDown(getCell(3, 1), { key: 'ArrowDown' });
      expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]); // Already on the last row
    });

    it('should unselect previous row when pressing "ArrowUp" + shiftKey', () => {
      render(<TestDataGridSelection checkboxSelection />);
      fireUserEvent.mousePress(getCell(2, 1));
      expect(getSelectedRowIds()).to.deep.equal([2]);
      fireUserEvent.mousePress(getCell(3, 1), { shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([2, 3]);
      fireEvent.keyDown(getCell(3, 1), { key: 'ArrowUp', shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([2]);
    });

    it('should add new row to the selection when pressing Shift+Space', () => {
      render(<TestDataGridSelection checkboxSelection disableRowSelectionOnClick />);

      expect(getSelectedRowIds()).to.deep.equal([]);

      const cell21 = getCell(2, 1);
      fireUserEvent.mousePress(cell21);
      fireEvent.keyDown(cell21, {
        key: ' ',
        shiftKey: true,
      });

      expect(getSelectedRowIds()).to.deep.equal([2]);

      const cell11 = getCell(1, 1);
      fireUserEvent.mousePress(cell11);
      fireEvent.keyDown(cell11, {
        key: ' ',
        shiftKey: true,
      });
      expect(getSelectedRowIds()).to.deep.equal([1, 2]);
    });

    it('should not jump during scroll while the focus is on the checkbox', function test() {
      if (isJSDOM) {
        this.skip(); // HTMLElement.focus() only scrolls to the element on a real browser
      }
      const data = getBasicGridData(20, 1);
      render(<TestDataGridSelection {...data} rowHeight={50} checkboxSelection hideFooter />);
      const checkboxes = screen.queryAllByRole('checkbox', { name: /select row/i });
      fireUserEvent.mousePress(checkboxes[0]);
      expect(checkboxes[0]).toHaveFocus();
      fireEvent.keyDown(checkboxes[0], { key: 'ArrowDown' });
      fireEvent.keyDown(checkboxes[1], { key: 'ArrowDown' });
      fireEvent.keyDown(checkboxes[2], { key: 'ArrowDown' });
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      virtualScroller.scrollTop = 250; // Scroll 5 rows
      virtualScroller.dispatchEvent(new Event('scroll'));
      expect(virtualScroller.scrollTop).to.equal(250);
    });

    it('should set tabindex=0 on the checkbox when the it receives focus', () => {
      render(<TestDataGridSelection checkboxSelection />);
      const checkbox = screen.getAllByRole('checkbox', { name: /select row/i })[0];
      const checkboxCell = getCell(0, 0);
      const secondCell = getCell(0, 1);
      expect(checkbox).to.have.attribute('tabindex', '-1');
      expect(checkboxCell).to.have.attribute('tabindex', '-1');
      expect(secondCell).to.have.attribute('tabindex', '-1');

      fireUserEvent.mousePress(secondCell);
      expect(secondCell).to.have.attribute('tabindex', '0');

      fireEvent.keyDown(secondCell, { key: 'ArrowLeft' });
      expect(secondCell).to.have.attribute('tabindex', '-1');
      // Ensure that checkbox has tabindex=0 and the cell has tabindex=-1
      expect(checkbox).to.have.attribute('tabindex', '0');
      expect(checkboxCell).to.have.attribute('tabindex', '-1');
    });

    it('should select/unselect all rows when pressing space', () => {
      render(<TestDataGridSelection checkboxSelection disableVirtualization />);

      const selectAllCell = document.querySelector<HTMLElement>(
        '[role="columnheader"][data-field="__check__"] input',
      )!;
      act(() => selectAllCell.focus());

      fireEvent.keyDown(selectAllCell, {
        key: ' ',
      });

      expect(getSelectedRowIds()).to.deep.equal([0, 1, 2, 3]);
      fireEvent.keyDown(selectAllCell, {
        key: ' ',
      });

      expect(getSelectedRowIds()).to.deep.equal([]);
    });

    describe('ripple', () => {
      clock.withFakeTimers();

      it('should keep only one ripple visible when navigating between checkboxes', function test() {
        if (isJSDOM) {
          // JSDOM doesn't fire "blur" when .focus is called in another element
          // FIXME Firefox doesn't show any ripple
          this.skip();
        }
        render(<TestDataGridSelection checkboxSelection />);
        const cell = getCell(1, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'ArrowLeft' });
        fireEvent.keyDown(getCell(1, 0).querySelector('input')!, { key: 'ArrowUp' });
        clock.runToLast(); // Wait for transition
        expect(document.querySelectorAll('.MuiTouchRipple-rippleVisible')).to.have.length(1);
      });
    });
  });

  describe('prop: isRowSelectable', () => {
    it('should update the selected rows when the isRowSelectable prop changes', async () => {
      const { setProps } = render(
        <TestDataGridSelection isRowSelectable={() => true} checkboxSelection />,
      );

      fireEvent.click(getCell(0, 0).querySelector('input')!);
      fireEvent.click(getCell(1, 0).querySelector('input')!);

      expect(getSelectedRowIds()).to.deep.equal([0, 1]);

      setProps({ isRowSelectable: (params: { id: GridRowId }) => Number(params.id) % 2 === 0 });
      expect(getSelectedRowIds()).to.deep.equal([0]);
    });

    it('should not select unselectable rows given in rowSelectionModel', () => {
      const { setProps } = render(
        <TestDataGridSelection
          rowSelectionModel={[0, 1]}
          isRowSelectable={(params) => Number(params.id) % 2 === 0}
          checkboxSelection
        />,
      );

      expect(getSelectedRowIds()).to.deep.equal([0]);
      setProps({ rowSelectionModel: [0, 1, 2, 3] });
      expect(getSelectedRowIds()).to.deep.equal([0, 2]);
    });

    it('should filter out unselectable rows when the rowSelectionModel prop changes', () => {
      const { setProps } = render(
        <TestDataGridSelection
          rowSelectionModel={[1]}
          isRowSelectable={(params) => Number(params.id) > 0}
          checkboxSelection
        />,
      );
      expect(getSelectedRowIds()).to.deep.equal([1]);
      expect(getColumnHeaderCell(0).querySelector('input')).to.have.attr(
        'data-indeterminate',
        'true',
      );

      setProps({ rowSelectionModel: [0] });
      expect(getColumnHeaderCell(0).querySelector('input')).to.have.attr(
        'data-indeterminate',
        'false',
      );
      expect(getSelectedRowIds()).to.deep.equal([]);
    });

    it('should not crash when paginationMode="server" and some selected rows are not provided to the grid', () => {
      expect(() => {
        render(
          <TestDataGridSelection
            paginationMode="server"
            rowCount={4}
            rowSelectionModel={[1, 4]}
            isRowSelectable={(params) => Number(params.id) > 0}
            checkboxSelection
          />,
        );
      }).not.toErrorDev();
    });
  });

  describe('prop: rows', () => {
    it('should remove the outdated selected rows when rows prop changes', () => {
      const data = getBasicGridData(4, 2);

      const { setProps } = render(
        <TestDataGridSelection rowSelectionModel={[0, 1, 2]} checkboxSelection {...data} />,
      );
      expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);

      setProps({
        rows: data.rows.slice(0, 1),
      });
      expect(getSelectedRowIds()).to.deep.equal([0]);
    });

    it('should retain the outdated selected rows when the rows prop changes when keepNonExistentRowsSelected is true', () => {
      const data = getBasicGridData(10, 2);
      const onRowSelectionModelChange = spy();

      const { setProps } = render(
        <TestDataGridSelection
          rowSelectionModel={[0, 1, 2]}
          checkboxSelection
          keepNonExistentRowsSelected
          onRowSelectionModelChange={onRowSelectionModelChange}
          {...data}
        />,
      );
      expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);

      setProps({ rows: data.rows.slice(0, 1) });
      // This expectation is around visible rows
      expect(getSelectedRowIds()).to.deep.equal([0]);
      // Check number of selected rows in the footer
      expect(() => screen.getByText('3 rows selected')).not.to.throw();
      // The callback should not be called when the selection changes
      expect(onRowSelectionModelChange.getCalls()).to.have.length(0);
    });
  });

  describe('prop: rowSelectionModel and onRowSelectionModelChange', () => {
    it('should select rows when initialised (array-version)', () => {
      render(<TestDataGridSelection rowSelectionModel={[1]} />);
      expect(getSelectedRowIds()).to.deep.equal([1]);
    });

    it('should select rows when initialised (non-array version)', () => {
      render(<TestDataGridSelection rowSelectionModel={1} />);
      expect(getSelectedRowIds()).to.deep.equal([1]);
    });

    it('should allow to switch rowSelectionModel from array version to non-array version', () => {
      const { setProps } = render(<TestDataGridSelection rowSelectionModel={[1]} />);
      expect(getSelectedRowIds()).to.deep.equal([1]);

      setProps({ rowSelectionModel: 1 });
      expect(getSelectedRowIds()).to.deep.equal([1]);
    });

    it('should not call onRowSelectionModelChange on initialization or on rowSelectionModel prop change', () => {
      const onRowSelectionModelChange = spy();

      const { setProps } = render(
        <TestDataGridSelection
          onRowSelectionModelChange={onRowSelectionModelChange}
          rowSelectionModel={0}
        />,
      );
      expect(onRowSelectionModelChange.callCount).to.equal(0);
      setProps({ rowSelectionModel: 1 });
      expect(onRowSelectionModelChange.callCount).to.equal(0);
    });

    it('should call onRowSelectionModelChange with an empty array if no row is selectable in the current page when turning off checkboxSelection', () => {
      const onRowSelectionModelChange = spy();
      const { setProps } = render(
        <TestDataGridSelection
          checkboxSelection
          pagination
          initialState={{ pagination: { paginationModel: { pageSize: 2 } } }}
          pageSizeOptions={[2]}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />,
      );
      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal([0]);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      fireEvent.click(getCell(2, 0).querySelector('input')!);
      expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal([0, 2]);
      setProps({ checkboxSelection: false, isRowSelectable: () => false });
      expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal([]);
    });

    it('should call onRowSelectionModelChange with an empty array if there is no selected row in the current page when turning off checkboxSelection', () => {
      const onRowSelectionModelChange = spy();
      const { setProps } = render(
        <TestDataGridSelection
          checkboxSelection
          initialState={{ pagination: { paginationModel: { pageSize: 2 } } }}
          pageSizeOptions={[2]}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />,
      );
      fireEvent.click(getCell(0, 0).querySelector('input')!);
      fireEvent.click(getCell(1, 0).querySelector('input')!);
      expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal([0, 1]);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      setProps({ checkboxSelection: false });
      expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal([]);
    });

    it('should deselect the old selected rows when updating rowSelectionModel', () => {
      const { setProps } = render(<TestDataGridSelection rowSelectionModel={[0]} />);

      expect(getSelectedRowIds()).to.deep.equal([0]);

      setProps({ rowSelectionModel: [1] });
      expect(getSelectedRowIds()).to.deep.equal([1]);
    });

    it('should update the selection when neither the model nor the onChange are set', () => {
      render(<TestDataGridSelection />);
      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIds()).to.deep.equal([0]);
    });

    it('should not update the selection model when the rowSelectionModel prop is set', () => {
      const rowSelectionModel: GridInputRowSelectionModel = [1];
      render(<TestDataGridSelection rowSelectionModel={rowSelectionModel} />);
      expect(getSelectedRowIds()).to.deep.equal([1]);

      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIds()).to.deep.equal([1]);
    });

    it('should update the selection when the model is not set, but the onChange is set', () => {
      const onModelChange = spy();
      render(<TestDataGridSelection onRowSelectionModelChange={onModelChange} />);

      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIds()).to.deep.equal([0]);
      expect(onModelChange.callCount).to.equal(1);
      expect(onModelChange.firstCall.firstArg).to.deep.equal([0]);
    });

    it('should control selection state when the model and the onChange are set', () => {
      function ControlCase() {
        const [rowSelectionModel, setRowSelectionModel] = React.useState<any>([]);

        const handleSelectionChange: DataGridProps['onRowSelectionModelChange'] = (newModel) => {
          if (newModel.length) {
            setRowSelectionModel([...newModel, 2]);
            return;
          }
          setRowSelectionModel(newModel);
        };

        return (
          <TestDataGridSelection
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={handleSelectionChange}
            checkboxSelection
          />
        );
      }

      render(<ControlCase />);
      expect(getSelectedRowIds()).to.deep.equal([]);
      fireEvent.click(getCell(1, 1));
      expect(getSelectedRowIds()).to.deep.equal([1, 2]);
    });

    it('should throw if rowSelectionModel contains more than 1 row', () => {
      let apiRef: React.MutableRefObject<GridApi>;
      function ControlCase() {
        apiRef = useGridApiRef();
        return <TestDataGridSelection apiRef={apiRef} />;
      }

      render(<ControlCase />);
      expect(() => apiRef.current.setRowSelectionModel([0, 1])).to.throw(
        /`rowSelectionModel` can only contain 1 item in DataGrid/,
      );
    });

    it('should not throw if rowSelectionModel contains more than 1 item with checkbox selection', () => {
      let apiRef: React.MutableRefObject<GridApi>;
      function ControlCase() {
        apiRef = useGridApiRef();
        return <TestDataGridSelection apiRef={apiRef} checkboxSelection />;
      }

      render(<ControlCase />);
      expect(() => act(() => apiRef.current.setRowSelectionModel([0, 1]))).to.not.throw();
    });
  });

  describe('prop: rowSelection = false', () => {
    it('should not select rows when clicking the checkbox', () => {
      render(<TestDataGridSelection rowSelection={false} checkboxSelection />);
      expect(getSelectedRowIds()).to.deep.equal([]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', false);
      fireEvent.click(getCell(0, 1));
      expect(getSelectedRowIds()).to.deep.equal([]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', false);
    });

    it('should not select rows with Shift + Space', () => {
      render(<TestDataGridSelection rowSelection={false} disableRowSelectionOnClick />);
      const cell0 = getCell(0, 0);
      fireUserEvent.mousePress(cell0);
      fireEvent.keyDown(cell0, { key: ' ', shiftKey: true });
      expect(getSelectedRowIds()).to.deep.equal([]);
    });

    it('should not select rows passed in the rowSelectionModel prop', () => {
      render(<TestDataGridSelection rowSelection={false} rowSelectionModel={[0]} />);
      expect(getSelectedRowIds()).to.deep.equal([]);
    });
  });

  describe('accessibility', () => {
    it('should add aria-selected attributes to the selectable rows', () => {
      render(<TestDataGridSelection />);

      // Select the first row
      fireUserEvent.mousePress(getCell(0, 0));
      expect(getRow(0).getAttribute('aria-selected')).to.equal('true');
      expect(getRow(1).getAttribute('aria-selected')).to.equal('false');
    });

    it('should not add aria-selected attributes if the row selection is disabled', () => {
      render(<TestDataGridSelection rowSelection={false} />);
      expect(getRow(0).getAttribute('aria-selected')).to.equal(null);

      // Try to select the first row
      fireUserEvent.mousePress(getCell(0, 0));
      // nothing should change
      expect(getRow(0).getAttribute('aria-selected')).to.equal(null);
    });
  });

  describe('performance', () => {
    it('should not rerender unrelated nodes', () => {
      // Couldn't use <RenderCounter> because we need to track multiple components
      let commits: any[] = [];
      function CustomCell(props: any) {
        React.useEffect(() => {
          commits.push({
            rowId: props.id,
          });
        });
        return <div>Hello</div>;
      }

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            columns={[
              { field: 'id', headerName: 'id', type: 'number' },
              {
                field: 'currencyPair',
                headerName: 'Currency Pair',
                renderCell: (params) => <CustomCell {...params} />,
              },
            ]}
            rows={[
              { id: 0, currencyPair: 'USDGBP' },
              { id: 1, currencyPair: 'USDEUR' },
            ]}
            autoHeight={isJSDOM}
            checkboxSelection
          />
        </div>,
      );
      expect(getSelectedRowIds()).to.deep.equal([]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', false);
      commits = [];
      fireEvent.click(getCell(0, 1));
      expect(getSelectedRowIds()).to.deep.equal([0]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', true);
      // It shouldn't rerender any of the custom cells
      expect(commits).to.deep.equal([]);
    });
  });
});
