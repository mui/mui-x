import * as React from 'react';
import { createRenderer, fireEvent, screen, act, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { spy } from 'sinon';
import { RefObject } from '@mui/x-internals/types';
import {
  DataGridProProps,
  useGridApiRef,
  DataGridPro,
  gridClasses,
  gridColumnLookupSelector,
  gridColumnFieldsSelector,
  GridApi,
  GridAutosizeOptions,
} from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '@mui/x-data-grid-pro/internals';
import { getColumnHeaderCell, getCell, getRow } from 'test/utils/helperFn';
import { describeSkipIf, testSkipIf, isJSDOM } from 'test/utils/skipIf';

describe('<DataGridPro /> - Columns', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ],
    columns: [{ field: 'brand' }],
  };

  function Test(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  }

  describe('showColumnMenu', () => {
    it('should open the column menu', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      await act(() => apiRef.current?.showColumnMenu('brand'));
      expect(screen.queryByRole('menu')).not.to.equal(null);
    });

    it('should set the correct id and aria-labelledby', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      await act(() => apiRef.current?.showColumnMenu('brand'));
      const menu = screen.getByRole('menu');
      await waitFor(() => {
        expect(menu.id).to.match(/:r[0-9a-z]+:/);
      });
      expect(menu.getAttribute('aria-labelledby')).to.match(/:r[0-9a-z]+:/);
    });
  });

  describe('toggleColumnMenu', () => {
    it('should toggle the column menu', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      act(() => apiRef.current?.toggleColumnMenu('brand'));
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.to.equal(null);
      });
      act(() => apiRef.current?.toggleColumnMenu('brand'));
      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
    });
  });

  // Need layouting
  describeSkipIf(isJSDOM)('resizing', () => {
    const columns = [{ field: 'brand', width: 100 }];

    it('should allow to resize columns with the mouse', () => {
      render(<Test columns={columns} />);
      const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
      fireEvent.mouseUp(separator);
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '110px' });
      expect(getCell(1, 0).getBoundingClientRect().width).to.equal(110);
    });

    // Only run in supported browsers
    testSkipIf(typeof Touch === 'undefined')(
      'should allow to resize columns with the touch',
      () => {
        render(<Test columns={columns} />);
        const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
        const now = Date.now();
        fireEvent.touchStart(separator, {
          changedTouches: [new Touch({ identifier: now, target: separator, clientX: 100 })],
        });
        fireEvent.touchMove(separator, {
          changedTouches: [new Touch({ identifier: now, target: separator, clientX: 110 })],
        });
        fireEvent.touchEnd(separator, {
          changedTouches: [new Touch({ identifier: now, target: separator, clientX: 110 })],
        });
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '110px' });
        expect(getCell(1, 0).getBoundingClientRect().width).to.equal(110);
      },
    );

    it('should call onColumnResize during resizing', async () => {
      const onColumnResize = spy();
      const { user } = render(<Test onColumnResize={onColumnResize} columns={columns} />);
      const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;

      await user.pointer([
        { keys: '[MouseLeft>]', target: separator, coords: { x: 100 } },
        { target: separator, coords: { x: 110 } },
        { target: separator, coords: { x: 120 } },
        { keys: '[/MouseLeft]', target: separator, coords: { x: 120 } },
      ]);

      expect(onColumnResize.callCount).to.equal(2);
      expect(onColumnResize.args[0][0].width).to.equal(110);
      expect(onColumnResize.args[1][0].width).to.equal(120);
    });

    it('should call onColumnWidthChange after resizing', async () => {
      const onColumnWidthChange = spy();
      const { user } = render(<Test onColumnWidthChange={onColumnWidthChange} columns={columns} />);
      const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;

      expect(onColumnWidthChange.callCount).to.equal(0);

      await user.pointer([
        { keys: '[MouseLeft>]', target: separator, coords: { x: 100 } },
        { target: separator, coords: { x: 120 } },
        { keys: '[/MouseLeft]', target: separator, coords: { x: 120 } },
      ]);

      expect(onColumnWidthChange.callCount).to.equal(1);
      expect(onColumnWidthChange.args[0][0].width).to.equal(120);
    });

    it('should call onColumnWidthChange with correct width after resizing and then clicking the separator', async () => {
      const onColumnWidthChange = spy();
      const { user } = render(<Test onColumnWidthChange={onColumnWidthChange} columns={columns} />);
      const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;

      expect(onColumnWidthChange.callCount).to.equal(0);

      await user.pointer([
        { keys: '[MouseLeft>]', target: separator, coords: { x: 100 } },
        { target: separator, coords: { x: 120 } },
        { keys: '[/MouseLeft]', target: separator, coords: { x: 120 } },
      ]);

      expect(onColumnWidthChange.callCount).to.equal(1);
      expect(onColumnWidthChange.args[0][0].width).to.equal(120);
      await user.dblClick(separator);

      expect(onColumnWidthChange.callCount).to.be.at.least(2);
      const widthArgs = onColumnWidthChange.args.map((arg) => arg[0].width);
      const isWidth120Present = widthArgs.some((width) => width === 120);
      expect(isWidth120Present).to.equal(true);
      const colDefWidthArgs = onColumnWidthChange.args.map((arg) => arg[0].colDef.width);
      const isColDefWidth120Present = colDefWidthArgs.some((width) => width === 120);
      expect(isColDefWidth120Present).to.equal(true);
    });

    it('should not affect other cell elements that are not part of the main DataGrid instance', () => {
      render(
        <Test
          rows={baselineProps.rows.slice(0, 1)}
          columns={[
            {
              field: 'brand',
              width: 100,
              renderCell: ({ id }) => (
                <div className={gridClasses.row} data-id={id} data-testid="dummy-row">
                  <div data-colindex={0} style={{ width: 90 }} />
                </div>
              ),
            },
          ]}
        />,
      );
      const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
      fireEvent.mouseUp(separator);
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '110px' });
      expect(getCell(0, 0).getBoundingClientRect().width).to.equal(110);
      expect(screen.getByTestId('dummy-row').firstElementChild).toHaveInlineStyle({
        width: '90px',
      });
    });

    it('should work with pinned rows', () => {
      render(
        <Test
          {...baselineProps}
          pinnedRows={{
            top: [{ id: 'top-0', brand: 'Reebok' }],
            bottom: [{ id: 'bottom-0', brand: 'Asics' }],
          }}
        />,
      );
      const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
      const nonPinnedCell = getCell(1, 0);
      const columnHeaderCell = getColumnHeaderCell(0);
      const topPinnedRowCell = document.querySelector(
        `.${gridClasses['pinnedRows--top']} [role="gridcell"][data-colindex="0"]`,
      );
      const bottomPinnedRowCell = document.querySelector(
        `.${gridClasses['pinnedRows--bottom']} [role="gridcell"][data-colindex="0"]`,
      );

      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });

      expect(columnHeaderCell.getBoundingClientRect().width).to.equal(150);
      expect(nonPinnedCell.getBoundingClientRect().width).to.equal(150);
      expect(topPinnedRowCell?.getBoundingClientRect().width).to.equal(150);
      expect(bottomPinnedRowCell?.getBoundingClientRect().width).to.equal(150);

      fireEvent.mouseUp(separator);

      expect(columnHeaderCell.getBoundingClientRect().width).to.equal(150);
      expect(nonPinnedCell.getBoundingClientRect().width).to.equal(150);
      expect(topPinnedRowCell?.getBoundingClientRect().width).to.equal(150);
      expect(bottomPinnedRowCell?.getBoundingClientRect().width).to.equal(150);
    });

    // https://github.com/mui/mui-x/issues/12852
    it('should work with right pinned column', () => {
      render(
        <Test
          columns={[
            { field: 'id', width: 100 },
            { field: 'brand', width: 100 },
          ]}
          initialState={{ pinnedColumns: { right: ['brand'] } }}
        />,
      );

      const pinnedHeaderCell = getColumnHeaderCell(1);
      const pinnedCell = getCell(1, 1);
      const pinnedSeparator = pinnedHeaderCell.querySelector(
        `.${gridClasses['columnSeparator--resizable']}`,
      )!;
      const pinnedRightPosition = pinnedHeaderCell.getBoundingClientRect().right;

      // resize right pinned column to the right
      fireEvent.mouseDown(pinnedSeparator, { clientX: 100 });
      fireEvent.mouseMove(pinnedSeparator, { clientX: 150, buttons: 1 });

      // check that the right pinned column has shrunk and is in the same position
      expect(pinnedHeaderCell.getBoundingClientRect().width).to.equal(50);
      expect(pinnedCell.getBoundingClientRect().width).to.equal(50);
      expect(pinnedHeaderCell.getBoundingClientRect().right).to.equal(pinnedRightPosition);

      // release the mouse and check that the right pinned column is still in the same position
      fireEvent.mouseUp(pinnedSeparator);
      expect(pinnedHeaderCell.getBoundingClientRect().width).to.equal(50);
      expect(pinnedCell.getBoundingClientRect().width).to.equal(50);
      expect(pinnedHeaderCell.getBoundingClientRect().right).to.equal(pinnedRightPosition);

      // resize the right pinned column to the left
      fireEvent.mouseDown(pinnedSeparator, { clientX: 150 });
      fireEvent.mouseMove(pinnedSeparator, { clientX: 50, buttons: 1 });

      // check that the right pinned column has grown and is in the same position
      expect(pinnedHeaderCell.getBoundingClientRect().width).to.equal(150);
      expect(pinnedCell.getBoundingClientRect().width).to.equal(150);
      expect(pinnedHeaderCell.getBoundingClientRect().right).to.equal(pinnedRightPosition);

      // release the mouse and check that the right pinned column is still in the same position
      fireEvent.mouseUp(pinnedSeparator);
      expect(pinnedHeaderCell.getBoundingClientRect().width).to.equal(150);
      expect(pinnedCell.getBoundingClientRect().width).to.equal(150);
      expect(pinnedHeaderCell.getBoundingClientRect().right).to.equal(pinnedRightPosition);
    });

    // https://github.com/mui/mui-x/issues/15755
    it('should keep right-pinned column group aligned with its pinned children', () => {
      render(
        <Test
          rows={[
            { id: 1, brand: 'Nike', category: 'Shoes' },
            { id: 2, brand: 'Adidas', category: 'Shoes' },
            { id: 3, brand: 'Puma', category: 'Shoes' },
          ]}
          columns={[
            { field: 'id', width: 50 },
            { field: 'brand', width: 50 },
            { field: 'category', width: 50 },
          ]}
          initialState={{ pinnedColumns: { right: ['brand', 'category'] } }}
          columnGroupingModel={[
            {
              groupId: 'group1',
              children: [{ field: 'brand' }, { field: 'category' }],
            },
          ]}
        />,
      );

      const lastColumnSeparator = document.querySelector(
        `[role="columnheader"][data-field="category"] .${gridClasses['columnSeparator--resizable']}`,
      )!;

      // resize the last column to the left
      fireEvent.mouseDown(lastColumnSeparator, { clientX: 150 });
      fireEvent.mouseMove(lastColumnSeparator, { clientX: 100, buttons: 1 });

      const rightPinnedColumns = [
        document.querySelector<HTMLElement>('[role="columnheader"][data-field="brand"]')!,
        document.querySelector<HTMLElement>('[role="columnheader"][data-field="category"]')!,
      ];

      const rightPinnedHeadersTotalWidth = rightPinnedColumns.reduce(
        (acc, column) => acc + column.offsetWidth,
        0,
      );

      const rightPinnedColumnGroup = document.querySelector<HTMLElement>(
        '[role="columnheader"][data-fields="|-brand-|-category-|"]',
      )!;

      expect(rightPinnedColumnGroup.offsetWidth).to.equal(
        rightPinnedHeadersTotalWidth,
        'offsetWidth',
      );
      expect(rightPinnedColumnGroup.offsetLeft).to.equal(
        rightPinnedColumns[0].offsetLeft,
        'offsetLeft',
      );
    });

    // https://github.com/mui/mui-x/issues/13548
    it('should fill remaining horizontal space in a row with an empty cell', () => {
      render(<Test columns={[{ field: 'id', width: 100 }]} />);

      const row = getRow(0);
      const rowWidth = row.getBoundingClientRect().width;
      const headerCell = getColumnHeaderCell(0);
      const separator = headerCell.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
      const emptyCell = row.querySelector(`.${gridClasses.cellEmpty}`)!;

      // check that empty cell takes up the remaining width in a row
      expect(emptyCell.getBoundingClientRect().width).to.equal(rowWidth - 100);

      // check that empty cell takes up the remaining width when the column is resized
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 50, buttons: 1 });
      expect(emptyCell.getBoundingClientRect().width).to.equal(rowWidth - 50);

      // release the mouse and check that the empty cell still takes up the remaining width
      fireEvent.mouseUp(separator);
      expect(emptyCell.getBoundingClientRect().width).to.equal(rowWidth - 50);
    });

    // Need layouting
    describeSkipIf(isJSDOM)('flex resizing', () => {
      it('should resize the flex width after resizing another column with api', () => {
        const twoColumns = [
          { field: 'id', width: 100, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        act(() => apiRef.current?.setColumnWidth('brand', 150));

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '148px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should resize the flex width after resizing a column with the separator', () => {
        const twoColumns = [
          { field: 'id', width: 100, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        const separator = getColumnHeaderCell(1).querySelector(
          `.${gridClasses['columnSeparator--resizable']}`,
        )!;

        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
        fireEvent.mouseUp(separator);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '148px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should not resize a flex column under its minWidth property (api resize)', () => {
        const twoColumns = [
          { field: 'id', minWidth: 175, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        act(() => apiRef.current?.setColumnWidth('brand', 150));

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '175px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should not resize a flex column above its maxWidth property (api resize)', () => {
        const twoColumns = [
          { field: 'id', maxWidth: 125, flex: 1 },
          { field: 'brand', width: 200 },
        ];

        render(<Test columns={twoColumns} />);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '98px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '200px' });

        act(() => apiRef.current?.setColumnWidth('brand', 150));

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '125px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should not resize a flex column under its minWidth property (separator resize)', () => {
        const twoColumns = [
          { field: 'id', minWidth: 175, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        const separator = getColumnHeaderCell(1).querySelector(
          `.${gridClasses['columnSeparator--resizable']}`,
        )!;

        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
        fireEvent.mouseUp(separator);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '175px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should not resize a flex column above its maxWidth property (separator resize)', () => {
        const twoColumns = [
          { field: 'id', maxWidth: 125, flex: 1 },
          { field: 'brand', width: 200 },
        ];

        render(<Test columns={twoColumns} />);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '98px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '200px' });

        const separator = getColumnHeaderCell(1).querySelector(
          `.${gridClasses['columnSeparator--resizable']}`,
        )!;

        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 50, buttons: 1 });
        fireEvent.mouseUp(separator);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '125px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should be able to resize a flex column under its width property (api resize)', () => {
        const twoColumns = [
          { field: 'id', width: 175, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        act(() => apiRef.current?.setColumnWidth('brand', 150));

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '148px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should be able to resize a flex column under its width property (separator resize)', () => {
        const twoColumns = [
          { field: 'id', width: 175, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        const separator = getColumnHeaderCell(1).querySelector(
          `.${gridClasses['columnSeparator--resizable']}`,
        )!;

        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
        fireEvent.mouseUp(separator);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '148px' });
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should be able to resize a column with flex twice (separator resize)', () => {
        const twoColumns = [
          { field: 'id', flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });

        const separator = getColumnHeaderCell(0).querySelector(
          `.${gridClasses['columnSeparator--resizable']}`,
        )!;

        fireEvent.mouseDown(separator, { clientX: 200 });
        fireEvent.mouseMove(separator, { clientX: 100, buttons: 1 });
        fireEvent.mouseUp(separator);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '98px' });

        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
        fireEvent.mouseUp(separator);

        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '148px' });
      });
    });
  });

  // Need layouting
  describeSkipIf(isJSDOM)('autosizing', () => {
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
      { id: 3, brand: 'Lululemon Athletica' },
    ];
    const columns = [
      { field: 'id', headerName: 'This is the ID column' },
      { field: 'brand', headerName: 'This is the brand column' },
    ];

    const getWidths = () => {
      return columns.map((_, i) => parseInt(getColumnHeaderCell(i).style.width, 10));
    };

    it('should work through the API', async () => {
      render(<Test rows={rows} columns={columns} />);
      await act(async () => apiRef.current?.autosizeColumns());
      expect(getWidths()).to.deep.equal([155, 177]);
    });

    it('should work through double-clicking the separator', async () => {
      const { user } = render(<Test rows={rows} columns={columns} />);
      const separator = document.querySelectorAll(
        `.${gridClasses['columnSeparator--resizable']}`,
      )[1];
      await user.dblClick(separator);
      await waitFor(() => {
        expect(getWidths()).to.deep.equal([100, 177]);
      });
    });

    it('should work on mount', async () => {
      render(<Test rows={rows} columns={columns} autosizeOnMount />);
      await waitFor(() => {
        expect(getWidths()).to.deep.equal([155, 177]);
      });
    });

    it('should work with flex columns', async () => {
      const { user } = render(
        <Test
          rows={rows}
          columns={[
            { field: 'id', flex: 1 },
            { field: 'brand', flex: 2 },
          ]}
        />,
      );
      const separators = document.querySelectorAll(`.${gridClasses['columnSeparator--resizable']}`);
      await user.dblClick(separators[0]);

      await waitFor(() => {
        expect(columns.map((_, i) => getColumnHeaderCell(i).offsetWidth)).to.deep.equal([50, 233]);
      });

      await user.dblClick(separators[1]);
      await waitFor(() => {
        expect(columns.map((_, i) => getColumnHeaderCell(i).offsetWidth)).to.deep.equal([50, 64]);
      });
    });

    describe('options', () => {
      const autosize = async (options: GridAutosizeOptions | undefined, widths: number[]) => {
        render(<Test rows={rows} columns={columns} />);
        await act(async () =>
          apiRef.current?.autosizeColumns({ includeHeaders: false, ...options }),
        );
        expect(getWidths()).to.deep.equal(widths);
      };

      it('.columns works', async () => {
        await autosize({ columns: [columns[0].field] }, [50, 100]);
      });

      it('.includeHeaders works', async () => {
        await autosize({ includeHeaders: true }, [155, 177]);
      });

      it('.includeOutliers works', async () => {
        await autosize({ includeOutliers: true }, [50, 144]);
      });

      it('.outliersFactor works', async () => {
        await autosize({ outliersFactor: 40 }, [50, 144]);
      });

      it('.expand works', async () => {
        // These values are tuned to Ubuntu/Chromium and might be flaky in other environments
        await autosize({ expand: true }, [134, 148]);
      });
    });
  });

  describe('column pipe processing', () => {
    type GridPrivateApiContextRef = ReturnType<typeof useGridPrivateApiContext>;

    it('should not loose column width when re-applying pipe processing', () => {
      let privateApi: GridPrivateApiContextRef;
      function Footer() {
        privateApi = useGridPrivateApiContext();
        return null;
      }
      render(<Test checkboxSelection slots={{ footer: Footer }} />);

      if (apiRef.current === null) {
        throw new Error('apiRef is not defined');
      }

      act(() => apiRef.current?.setColumnWidth('brand', 300));
      expect(gridColumnLookupSelector(apiRef).brand.computedWidth).to.equal(300);
      // @ts-ignore
      act(() => privateApi.current.requestPipeProcessorsApplication('hydrateColumns'));
      expect(gridColumnLookupSelector(apiRef).brand.computedWidth).to.equal(300);
    });

    it('should not loose column index when re-applying pipe processing', () => {
      let privateApi: GridPrivateApiContextRef;
      function Footer() {
        privateApi = useGridPrivateApiContext();
        return null;
      }
      render(
        <Test
          checkboxSelection
          columns={[{ field: 'id' }, { field: 'brand' }]}
          slots={{ footer: Footer }}
        />,
      );

      expect(gridColumnFieldsSelector(apiRef).indexOf('brand')).to.equal(2);
      act(() => apiRef.current?.setColumnIndex('brand', 1));
      expect(gridColumnFieldsSelector(apiRef).indexOf('brand')).to.equal(1);
      // @ts-ignore
      act(() => privateApi.current.requestPipeProcessorsApplication('hydrateColumns'));
      expect(gridColumnFieldsSelector(apiRef).indexOf('brand')).to.equal(1);
    });

    it('should not loose imperatively added columns when re-applying pipe processing', () => {
      let privateApi: GridPrivateApiContextRef;
      function Footer() {
        privateApi = useGridPrivateApiContext();
        return null;
      }
      render(<Test checkboxSelection slots={{ footer: Footer }} />);

      act(() => apiRef.current?.updateColumns([{ field: 'id' }]));
      expect(gridColumnFieldsSelector(apiRef)).to.deep.equal(['__check__', 'brand', 'id']);
      // @ts-ignore
      act(() => privateApi.current.requestPipeProcessorsApplication('hydrateColumns'));
      expect(gridColumnFieldsSelector(apiRef)).to.deep.equal(['__check__', 'brand', 'id']);
    });
  });
});
