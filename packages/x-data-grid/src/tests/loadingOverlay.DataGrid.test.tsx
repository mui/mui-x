import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { act, createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import { DataGrid, gridClasses, useGridApiRef } from '@mui/x-data-grid';
import type { DataGridProps, GridApi, GridColDef } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { $, $$, grid } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

const manyColumns: GridColDef[] = Array.from({ length: 200 }, (_, index) => ({
  field: `col${index}`,
  width: 100,
}));

const getSkeletonCells = () => $$($('.MuiDataGrid-rowSkeleton')!, '[data-field]');

const getSkeletonFields = () => getSkeletonCells().map((cell) => cell.getAttribute('data-field'));

const getColumnHeaderFields = () =>
  $$('.MuiDataGrid-columnHeader[data-field]').map((header) => header.getAttribute('data-field'));

// JSDOM has no layout, so it renders no skeleton rows and does not virtualize the columns
describe.skipIf(isJSDOM)('<DataGrid /> - Skeleton loading overlay', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function TestCase(props: Partial<DataGridProps> & { direction?: 'ltr' | 'rtl' }) {
    const { direction = 'ltr', ...other } = props;
    apiRef = useGridApiRef();
    return (
      <ThemeProvider theme={createTheme({ direction })}>
        <div dir={direction} style={{ width: 300, height: 300 }}>
          <DataGrid
            apiRef={apiRef}
            rows={[]}
            columns={manyColumns}
            loading
            slotProps={{ loadingOverlay: { noRowsVariant: 'skeleton' } }}
            hideFooter
            {...other}
          />
        </div>
      </ThemeProvider>
    );
  }

  const scrollTo = async (left: number) => {
    const scroller = grid('virtualScroller')!;
    await act(async () => {
      scroller.scrollLeft = left;
      scroller.dispatchEvent(new Event('scroll'));
    });
  };

  const expectSkeletonCellsToMatchTheColumnHeaders = () => {
    const skeletonCells = getSkeletonCells();
    expect(skeletonCells.map((cell) => cell.getAttribute('data-field'))).to.deep.equal(
      getColumnHeaderFields(),
    );
    skeletonCells.forEach((cell) => {
      const header = $(
        `.MuiDataGrid-columnHeader[data-field="${cell.getAttribute('data-field')}"]`,
      )!;
      expect(Math.round(cell.getBoundingClientRect().left)).to.equal(
        Math.round(header.getBoundingClientRect().left),
      );
    });
  };

  it('should only render the skeleton cells of the rendered columns', () => {
    render(<TestCase />);

    const skeletonFields = getSkeletonFields();
    expect(skeletonFields.length).to.be.lessThan(manyColumns.length);
    expect(skeletonFields).to.deep.equal(getColumnHeaderFields());
    expect(skeletonFields[0]).to.equal('col0');
  });

  it('should keep the skeleton cells aligned with the column headers after a horizontal scroll', async () => {
    render(<TestCase />);

    await scrollTo(5000);

    await waitFor(() => {
      expect(getSkeletonFields()).to.include('col50');
    });
    expect(getSkeletonFields()).not.to.include('col0');
    expectSkeletonCellsToMatchTheColumnHeaders();
  });

  it('should keep the skeleton cells aligned with the column headers after a horizontal scroll in RTL', async () => {
    render(<TestCase direction="rtl" />);

    // In RTL, `scrollLeft` goes from 0 to negative values
    await scrollTo(-5000);

    await waitFor(() => {
      expect(getSkeletonFields()).to.include('col50');
    });
    expect(getSkeletonFields()).not.to.include('col0');
    expectSkeletonCellsToMatchTheColumnHeaders();
  });

  it('should update the width of the skeleton cells when a column is resized after a horizontal scroll', async () => {
    render(<TestCase />);

    await scrollTo(5000);
    await waitFor(() => {
      expect(getSkeletonFields()).to.include('col51');
    });
    expect(getSkeletonFields()).not.to.include('col0');

    const header = $('.MuiDataGrid-columnHeader[data-field="col51"]')!;
    const expectSkeletonCellsToHaveTheHeaderWidth = (width: number) => {
      expect(header.getBoundingClientRect().width).to.equal(width);
      const cells = $$('.MuiDataGrid-rowSkeleton [data-field="col51"]');
      expect(cells.length).to.equal($$('.MuiDataGrid-rowSkeleton').length);
      cells.forEach((cell) => {
        expect(cell.getBoundingClientRect().width).to.equal(width);
      });
      expectSkeletonCellsToMatchTheColumnHeaders();
    };

    const separator = header.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
    fireEvent.mouseDown(separator, { clientX: 100 });
    fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
    expectSkeletonCellsToHaveTheHeaderWidth(150);

    fireEvent.mouseUp(separator);
    expectSkeletonCellsToHaveTheHeaderWidth(150);

    // col0 has no skeleton cells, so the overlay has nothing to update
    expect(() => {
      act(() => {
        apiRef.current!.publishEvent(
          'columnResize',
          { colDef: apiRef.current!.getColumn('col0')!, element: null, width: 150 },
          new MouseEvent('mousemove'),
        );
      });
    }).not.to.throw();
    expectSkeletonCellsToHaveTheHeaderWidth(150);
  });

  it('should render a skeleton cell for every column when the virtualization is disabled', () => {
    render(<TestCase disableVirtualization />);

    expect(getSkeletonFields()).to.deep.equal(manyColumns.map((column) => column.field));
  });

  it('should render the filler cell when the columns do not fill the viewport', () => {
    render(
      <TestCase
        columns={[
          { field: 'id', width: 50 },
          { field: 'name', width: 50 },
        ]}
      />,
    );

    const skeletonRow = $('.MuiDataGrid-rowSkeleton')!;
    expect(getSkeletonFields()).to.deep.equal(['id', 'name']);
    expect($$(skeletonRow, '.MuiDataGrid-cellEmpty:not([data-field])').length).to.equal(1);
  });
});
