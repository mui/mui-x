import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, screen } from '@mui/monorepo/test/utils';
import clsx from 'clsx';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import Portal from '@mui/material/Portal';
import {
  DataGrid,
  DataGridProps,
  GridActionsCellItem,
  GridRowIdGetter,
  GridRowClassNameParams,
} from '@mui/x-data-grid';
import { getColumnValues, getRow, getActiveCell, getCell } from 'test/utils/helperFn';
import { getData } from 'storybook/src/data/data-service';
import { COMPACT_DENSITY_FACTOR } from '../hooks/features/density/useGridDensity';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Rows', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        clientId: 'c1',
        first: 'Mike',
        age: 11,
      },
      {
        clientId: 'c2',
        first: 'Jack',
        age: 11,
      },
      {
        clientId: 'c3',
        first: 'Mike',
        age: 20,
      },
    ],
    columns: [{ field: 'clientId' }, { field: 'first' }, { field: 'age' }],
  };

  describe('prop: getRowId', () => {
    it('should allow to select a field as id', () => {
      const getRowId: GridRowIdGetter = (row) => `${row.clientId}`;
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} getRowId={getRowId} />
        </div>,
      );
      expect(getColumnValues(0)).to.deep.equal(['c1', 'c2', 'c3']);
    });
  });

  describe('prop: rows', () => {
    it('should support new dataset', () => {
      const { rows, columns } = getData(5, 2);

      const Test = (props: Pick<DataGridProps, 'rows'>) => (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...props} columns={columns} disableVirtualization />
        </div>
      );

      const { setProps } = render(<Test rows={rows.slice(0, 2)} />);
      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
      setProps({ rows });
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);
    });
  });

  it('should ignore events coming from a portal in the cell', () => {
    const handleRowClick = spy();
    const InputCell = () => <input type="text" name="input" />;
    const PortalCell = () => (
      <Portal>
        <input type="text" name="portal-input" />
      </Portal>
    );

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          rows={[{ id: '1' }]}
          onRowClick={handleRowClick}
          columns={[
            {
              field: 'id',
              renderCell: () => <PortalCell />,
            },
            {
              field: 'input',
              renderCell: () => <InputCell />,
            },
          ]}
        />
      </div>,
    );
    fireEvent.click(document.querySelector('input[name="portal-input"]'));
    expect(handleRowClick.callCount).to.equal(0);
    fireEvent.click(document.querySelector('input[name="input"]'));
    expect(handleRowClick.callCount).to.equal(1);
  });

  describe('prop: getRowClassName', () => {
    it('should apply the CSS class returned by getRowClassName', () => {
      const getRowId: GridRowIdGetter = (row) => `${row.clientId}`;
      const handleRowClassName: DataGridProps['getRowClassName'] = (params) =>
        params.row.age < 20 ? 'under-age' : '';
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid getRowClassName={handleRowClassName} getRowId={getRowId} {...baselineProps} />
        </div>,
      );
      expect(getRow(0)).to.have.class('under-age');
      expect(getRow(1)).to.have.class('under-age');
      expect(getRow(2)).not.to.have.class('under-age');
    });

    it('should call with isFirstVisible=true in the first row and isLastVisible=true in the last', () => {
      const { rows, columns } = getData(4, 2);
      const getRowClassName = (params: GridRowClassNameParams) =>
        clsx({ first: params.isFirstVisible, last: params.isLastVisible });
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowClassName={getRowClassName}
            pageSize={3}
            rowsPerPageOptions={[3]}
          />
        </div>,
      );
      expect(getRow(0)).to.have.class('first');
      expect(getRow(1)).not.to.have.class('first');
      expect(getRow(1)).not.to.have.class('last');
      expect(getRow(2)).to.have.class('last');
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getRow(3)).to.have.class('first');
      expect(getRow(3)).to.have.class('last');
    });
  });

  describe('columnType: actions', () => {
    const TestCase = ({
      getActions,
      ...other
    }: { getActions?: () => JSX.Element[] } & Partial<DataGridProps>) => {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            rows={[{ id: 1 }]}
            columns={[
              {
                field: 'id',
              },
              {
                field: 'actions',
                type: 'actions',
                getActions,
              },
            ]}
            {...other}
          />
        </div>
      );
    };

    it('should throw an error if getActions is missing', function test() {
      if (!isJSDOM) {
        this.skip();
      }
      expect(() => {
        render(<TestCase />);
      }).toErrorDev([
        'MUI: Missing the `getActions` property in the `GridColDef`.',
        'The above error occurred in the <GridActionsCell> component',
        'MUI: GridErrorHandler - An unexpected error occurred.',
      ]);
    });

    it('should call getActions with the row params', () => {
      const getActions = stub().returns([]);
      render(<TestCase getActions={getActions} />);
      expect(getActions.args[0][0].id).to.equal(1);
      expect(getActions.args[0][0].row).to.deep.equal({ id: 1 });
    });

    it('should always show the actions not marked as showInMenu', () => {
      render(
        <TestCase
          getActions={() => [
            <GridActionsCellItem icon={<span />} label="delete" />,
            <GridActionsCellItem label="print" showInMenu />,
          ]}
        />,
      );
      expect(screen.queryByRole('menuitem', { name: 'delete' })).not.to.equal(null);
      expect(screen.queryByText('print')).to.equal(null);
    });

    it('should show in a menu the actions marked as showInMenu', async () => {
      render(<TestCase getActions={() => [<GridActionsCellItem label="print" showInMenu />]} />);
      expect(screen.queryByText('print')).to.equal(null);
      fireEvent.click(screen.getByRole('menuitem', { name: 'more' }));
      expect(screen.queryByText('print')).not.to.equal(null);
    });

    it('should not select the row when clicking in an action', () => {
      render(
        <TestCase getActions={() => [<GridActionsCellItem icon={<span />} label="print" />]} />,
      );
      expect(getRow(0).className).not.to.contain('Mui-selected');
      fireEvent.click(screen.getByRole('menuitem', { name: 'print' }));
      expect(getRow(0).className).not.to.contain('Mui-selected');
    });

    it('should not select the row when clicking in a menu action', async () => {
      render(
        <TestCase
          getActions={() => [<GridActionsCellItem icon={<span />} label="print" showInMenu />]}
        />,
      );
      expect(getRow(0).className).not.to.contain('Mui-selected');
      fireEvent.click(screen.getByRole('menuitem', { name: 'more' }));
      expect(screen.queryByText('print')).not.to.equal(null);
      fireEvent.click(screen.queryByText('print'));
      expect(getRow(0).className).not.to.contain('Mui-selected');
    });

    it('should not select the row when opening the menu', () => {
      render(<TestCase getActions={() => [<GridActionsCellItem label="print" showInMenu />]} />);
      expect(getRow(0).className).not.to.contain('Mui-selected');
      fireEvent.click(screen.getByRole('menuitem', { name: 'more' }));
      expect(getRow(0).className).not.to.contain('Mui-selected');
    });

    it('should close other menus before opening a new one', () => {
      render(
        <TestCase
          rows={[{ id: 1 }, { id: 2 }]}
          getActions={() => [<GridActionsCellItem label="print" showInMenu />]}
        />,
      );
      expect(screen.queryAllByRole('menu')).to.have.length(2);

      const more1 = screen.getAllByRole('menuitem', { name: 'more' })[0];
      fireEvent.mouseDown(more1);
      fireEvent.click(more1);
      clock.runToLast();
      expect(screen.queryAllByRole('menu')).to.have.length(2 + 1);

      const more2 = screen.getAllByRole('menuitem', { name: 'more' })[1];
      fireEvent.mouseDown(more2);
      fireEvent.click(more2);
      clock.runToLast();
      expect(screen.queryAllByRole('menu')).to.have.length(2 + 1);
    });

    it('should allow to move focus to another cell with the arrow keys', () => {
      render(
        <TestCase getActions={() => [<GridActionsCellItem icon={<span />} label="print" />]} />,
      );
      const firstCell = getCell(0, 0);
      firstCell.focus();
      expect(getActiveCell()).to.equal('0-0');

      fireEvent.keyDown(firstCell, { key: 'ArrowRight' });
      const printButton = screen.queryByRole('menuitem', { name: 'print' });
      expect(printButton).toHaveFocus();

      fireEvent.keyDown(printButton, { key: 'ArrowLeft' });
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should focus the first item when opening the menu', () => {
      render(
        <TestCase
          getActions={() => [
            <GridActionsCellItem icon={<span />} label="print" showInMenu />,
            <GridActionsCellItem icon={<span />} label="delete" showInMenu />,
          ]}
        />,
      );
      const moreButton = screen.getByRole('menuitem', { name: 'more' });
      fireEvent.mouseUp(moreButton);
      fireEvent.click(moreButton);

      const printButton = screen.queryByRole('menuitem', { name: 'print' });
      expect(printButton).toHaveFocus();
    });

    it('should allow to navigate between actions using the arrow keys', () => {
      render(
        <TestCase
          getActions={() => [
            <GridActionsCellItem icon={<span />} label="print" />,
            <GridActionsCellItem icon={<span />} label="delete" />,
          ]}
        />,
      );
      const firstCell = getCell(0, 0);
      firstCell.focus();
      expect(getActiveCell()).to.equal('0-0');

      fireEvent.keyDown(firstCell, { key: 'ArrowRight' });
      const printButton = screen.getByRole('menuitem', { name: 'print' });
      expect(printButton).toHaveFocus();

      fireEvent.keyDown(printButton, { key: 'ArrowRight' });
      const deleteButton = screen.getByRole('menuitem', { name: 'delete' });
      expect(deleteButton).toHaveFocus();

      fireEvent.keyDown(deleteButton, { key: 'ArrowLeft' });
      expect(printButton).toHaveFocus();

      fireEvent.keyDown(printButton, { key: 'ArrowLeft' });
      expect(firstCell).toHaveFocus();
    });

    it('should not move focus to first item when clicking in another item', () => {
      render(
        <TestCase
          getActions={() => [
            <GridActionsCellItem icon={<span />} label="print" />,
            <GridActionsCellItem icon={<span />} label="delete" />,
          ]}
        />,
      );
      const deleteButton = screen.getByRole('menuitem', { name: 'delete' });
      fireEvent.click(deleteButton);
      expect(deleteButton).toHaveFocus();
    });

    it('should set the correct tabIndex to the focused button', () => {
      render(
        <TestCase
          getActions={() => [
            <GridActionsCellItem icon={<span />} label="print" />,
            <GridActionsCellItem icon={<span />} label="delete" showInMenu />,
          ]}
        />,
      );
      const firstCell = getCell(0, 0);
      const secondCell = getCell(0, 1);
      firstCell.focus();

      fireEvent.keyDown(firstCell, { key: 'ArrowRight' });
      expect(secondCell).to.have.property('tabIndex', -1);

      const printButton = screen.getByRole('menuitem', { name: 'print' });
      const menuButton = screen.getByRole('menuitem', { name: 'more' });
      expect(printButton).to.have.property('tabIndex', 0);
      expect(menuButton).to.have.property('tabIndex', -1);

      fireEvent.keyDown(printButton, { key: 'ArrowRight' });
      expect(printButton).to.have.property('tabIndex', -1);
      expect(menuButton).to.have.property('tabIndex', 0);
    });
  });

  describe('prop: getRowHeight', () => {
    before(function beforeHook() {
      if (isJSDOM) {
        // Need layouting
        this.skip();
      }
    });

    const ROW_HEIGHT = 52;
    const TestCase = (props: Partial<DataGridProps>) => {
      const getRowId: GridRowIdGetter = (row) => `${row.clientId}`;
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} {...props} getRowId={getRowId} />
        </div>
      );
    };

    it('should set each row height whe rowHeight prop is used', () => {
      const { setProps } = render(<TestCase />);

      expect(getRow(0).clientHeight).to.equal(ROW_HEIGHT);
      expect(getRow(1).clientHeight).to.equal(ROW_HEIGHT);
      expect(getRow(2).clientHeight).to.equal(ROW_HEIGHT);

      setProps({ rowHeight: 30 });

      expect(getRow(0).clientHeight).to.equal(30);
      expect(getRow(1).clientHeight).to.equal(30);
      expect(getRow(2).clientHeight).to.equal(30);
    });

    it('should set the second row to have a different row height than the others', () => {
      render(<TestCase getRowHeight={({ id }) => (id === 'c2' ? 100 : null)} />);

      expect(getRow(0).clientHeight).to.equal(ROW_HEIGHT);
      expect(getRow(1).clientHeight).to.equal(100);
      expect(getRow(2).clientHeight).to.equal(ROW_HEIGHT);
    });

    it('should set density to all but the row with variable row height', () => {
      const { setProps } = render(
        <TestCase getRowHeight={({ id }) => (id === 'c2' ? 100 : null)} />,
      );

      expect(getRow(0).clientHeight).to.equal(ROW_HEIGHT);
      expect(getRow(1).clientHeight).to.equal(100);
      expect(getRow(2).clientHeight).to.equal(ROW_HEIGHT);

      setProps({ density: 'compact' });

      expect(getRow(0).clientHeight).to.equal(Math.floor(ROW_HEIGHT * COMPACT_DENSITY_FACTOR));
      expect(getRow(1).clientHeight).to.equal(100);
      expect(getRow(2).clientHeight).to.equal(Math.floor(ROW_HEIGHT * COMPACT_DENSITY_FACTOR));
    });

    it('should set the correct rowHeight and variable row height', () => {
      const { setProps } = render(
        <TestCase getRowHeight={({ id }) => (id === 'c2' ? 100 : null)} />,
      );

      expect(getRow(0).clientHeight).to.equal(ROW_HEIGHT);
      expect(getRow(1).clientHeight).to.equal(100);
      expect(getRow(2).clientHeight).to.equal(ROW_HEIGHT);

      setProps({ rowHeight: 30 });

      expect(getRow(0).clientHeight).to.equal(30);
      expect(getRow(1).clientHeight).to.equal(100);
      expect(getRow(2).clientHeight).to.equal(30);
    });
  });

  describe('prop: getRowSpacing', () => {
    const { rows, columns } = getData(4, 2);

    const TestCase = (props: Partial<DataGridProps>) => {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGrid rows={rows} columns={columns} {...props} />
        </div>
      );
    };

    it('should be called with the correct params', () => {
      const getRowSpacing = stub().returns({});
      render(<TestCase getRowSpacing={getRowSpacing} pageSize={2} rowsPerPageOptions={[2]} />);
      expect(getRowSpacing.args[0][0]).to.deep.equal({
        isFirstVisible: true,
        isLastVisible: false,
        indexRelativeToCurrentPage: 0,
        id: 0,
        model: rows[0],
      });
      expect(getRowSpacing.args[1][0]).to.deep.equal({
        isFirstVisible: false,
        isLastVisible: true,
        indexRelativeToCurrentPage: 1,
        id: 1,
        model: rows[1],
      });

      getRowSpacing.resetHistory();
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));

      expect(getRowSpacing.args[0][0]).to.deep.equal({
        isFirstVisible: true,
        isLastVisible: false,
        indexRelativeToCurrentPage: 0,
        id: 2,
        model: rows[2],
      });
      expect(getRowSpacing.args[1][0]).to.deep.equal({
        isFirstVisible: false,
        isLastVisible: true,
        indexRelativeToCurrentPage: 1,
        id: 3,
        model: rows[3],
      });
    });

    it('should consider the spacing when computing the content size', () => {
      const spacingTop = 5;
      const spacingBottom = 10;
      const rowHeight = 50;
      render(
        <TestCase
          rowHeight={rowHeight}
          getRowSpacing={() => ({ top: spacingTop, bottom: spacingBottom })}
          disableVirtualization
        />,
      );
      const virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent');
      const expectedHeight = rows.length * (rowHeight + spacingTop + spacingBottom);
      expect(virtualScrollerContent).toHaveInlineStyle({
        width: 'auto',
        height: `${expectedHeight}px`,
      });
    });

    it('should update the content size when getRowSpacing is removed', () => {
      const spacingTop = 5;
      const spacingBottom = 10;
      const rowHeight = 50;
      const { setProps } = render(
        <TestCase
          rowHeight={rowHeight}
          getRowSpacing={() => ({ top: spacingTop, bottom: spacingBottom })}
          disableVirtualization
        />,
      );
      const virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent');
      const expectedHeight = rows.length * (rowHeight + spacingTop + spacingBottom);
      expect(virtualScrollerContent).toHaveInlineStyle({
        width: 'auto',
        height: `${expectedHeight}px`,
      });
      setProps({ getRowSpacing: null });
      expect(virtualScrollerContent).toHaveInlineStyle({
        width: 'auto',
        height: `${rows.length * rowHeight}px`,
      });
    });

    it('should set the row margin to the value returned by getRowSpacing if rowSpacingType is not defined', () => {
      const spacingTop = 5;
      const spacingBottom = 10;
      render(
        <TestCase
          getRowSpacing={() => ({ top: spacingTop, bottom: spacingBottom })}
          disableVirtualization
        />,
      );
      expect(getRow(0)).toHaveInlineStyle({
        marginTop: `${spacingTop}px`,
        marginBottom: `${spacingBottom}px`,
      });
    });

    it('should set the row border to the value returned by getRowSpacing if rowSpacingType=border', () => {
      const borderTop = 5;
      const borderBottom = 10;
      render(
        <TestCase
          rowSpacingType="border"
          getRowSpacing={() => ({ top: borderTop, bottom: borderBottom })}
          disableVirtualization
        />,
      );
      expect(getRow(0)).toHaveInlineStyle({
        borderTopWidth: `${borderTop}px`,
        borderBottomWidth: `${borderBottom}px`,
      });
    });
  });
});
