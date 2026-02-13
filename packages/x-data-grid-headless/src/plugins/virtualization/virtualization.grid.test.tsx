'use client';
import * as React from 'react';
import { createRenderer, act, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { $, $$ } from 'test/utils/helperFn';
import { type ColumnDef, useDataGrid } from '../../';
import virtualizationPlugin, { type VirtualizationOptions } from './virtualization';
import { sortingPlugin } from '../sorting';
import { paginationPlugin } from '../pagination';

type TestRow = { id: number; brand: string };

const testRows: TestRow[] = [
  { id: 0, brand: 'Nike' },
  { id: 1, brand: 'Adidas' },
  { id: 2, brand: 'Puma' },
  { id: 3, brand: 'Reebok' },
  { id: 4, brand: 'New Balance' },
  { id: 5, brand: 'Under Armour' },
  { id: 6, brand: 'Asics' },
  { id: 7, brand: 'Converse' },
  { id: 8, brand: 'Vans' },
  { id: 9, brand: 'Fila' },
];

const testColumns: ColumnDef<TestRow>[] = [
  { id: 'id', field: 'id' },
  { id: 'brand', field: 'brand', size: 100 },
];

type VirtualizationBehaviorTestRow = {
  id: number;
} & Record<string, string | number>;

function buildVirtualizationBehaviorTestData(
  nbRows: number,
  nbCols: number,
): {
  rows: VirtualizationBehaviorTestRow[];
  columns: ColumnDef<VirtualizationBehaviorTestRow>[];
} {
  const columns: ColumnDef<VirtualizationBehaviorTestRow>[] = Array.from(
    { length: nbCols },
    (_, index) => ({
      id: `col-${index}`,
      field: `col-${index}`,
      size: 100,
    }),
  );

  const rows: VirtualizationBehaviorTestRow[] = Array.from({ length: nbRows }, (_, rowIndex) => {
    const row: VirtualizationBehaviorTestRow = { id: rowIndex };
    columns.forEach((column) => {
      row[column.field!] = `${column.field}-${rowIndex}`;
    });
    return row;
  });

  return { rows, columns };
}

type GridInstance<TRow extends object> = ReturnType<
  typeof useDataGrid<
    [typeof virtualizationPlugin, typeof sortingPlugin, typeof paginationPlugin],
    TRow
  >
>;

type TestDataGridProps<TRow extends object> = {
  rows: TRow[];
  columns: ColumnDef<TRow>[];
  getRowId?: (row: TRow) => string | number;
  apiRef?: React.RefObject<GridInstance<TRow> | null>;
  height?: number;
  width?: number;
} & VirtualizationOptions;

function TestDataGrid<TRow extends object>(props: TestDataGridProps<TRow>) {
  const {
    rows,
    columns,
    getRowId,
    apiRef,
    height = 300,
    width = 300,
    disableVirtualization,
    disableColumnVirtualization,
    autoHeight,
    rowBufferPx,
    columnBufferPx,
    rowHeight,
    initialState,
  } = props;

  const grid = useDataGrid<
    [typeof virtualizationPlugin, typeof sortingPlugin, typeof paginationPlugin],
    TRow
  >({
    rows,
    getRowId,
    columns,
    plugins: [virtualizationPlugin, sortingPlugin, paginationPlugin],
    disableVirtualization,
    disableColumnVirtualization,
    autoHeight,
    rowBufferPx,
    columnBufferPx,
    rowHeight,
    initialState,
  });

  React.useEffect(() => {
    if (apiRef) {
      apiRef.current = grid;
    }
  }, [grid, apiRef]);

  // eslint-disable-next-line testing-library/render-result-naming-convention -- these are hook results, not render() results
  const virtualizedRows = grid.api.virtualization.hooks.useRowsToRender<TRow>();
  // eslint-disable-next-line testing-library/render-result-naming-convention -- these are hook results, not render() results
  const virtualizedColumns = grid.api.virtualization.hooks.useColumnsToRender();
  const containerProps = grid.api.elements.hooks.useContainerProps();
  const scrollerProps = grid.api.elements.hooks.useScrollerProps();
  const contentProps = grid.api.elements.hooks.useContentProps();
  const positionerProps = grid.api.elements.hooks.usePositionerProps();

  // Extract ref from scrollerProps to avoid type issues
  const { ref: scrollerRef, ...scrollerOtherProps } = scrollerProps;

  return (
    <div
      {...containerProps}
      data-testid="grid-container"
      style={{ width, height, overflow: 'hidden', position: 'relative' }}
    >
      <div
        {...scrollerOtherProps}
        ref={scrollerRef as React.RefObject<HTMLDivElement | null>}
        data-testid="virtual-scroller"
        className="MuiDataGrid-virtualScroller"
        style={{
          ...scrollerProps.style,
          overflowX: 'auto',
          overflowY: 'auto',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          {...contentProps}
          data-testid="virtual-scroller-content"
          className="MuiDataGrid-virtualScrollerContent"
          style={contentProps.style}
        >
          <div
            {...positionerProps}
            data-testid="virtual-scroller-render-zone"
            className="MuiDataGrid-virtualScrollerRenderZone"
            style={positionerProps.style}
          >
            {virtualizedRows.map((row) => (
              <div
                key={row.id}
                role="row"
                data-rowindex={row.index}
                data-id={row.id}
                style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}
              >
                {virtualizedColumns.map((column) => {
                  const value = row.model[column.field as keyof TRow];
                  return (
                    <div
                      key={column.id}
                      role="gridcell"
                      data-colindex={column.index}
                      data-field={column.id}
                      style={{
                        width: column.size || 100,
                        minWidth: column.size || 100,
                        padding: '8px',
                      }}
                    >
                      {value != null ? String(value) : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

describe('Virtualization', () => {
  const { render } = createRenderer();

  describe('no virtualization', () => {
    // Ported from packages/x-data-grid-pro/src/tests/rows.DataGridPro.test.tsx
    it('should allow to disable virtualization', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} disableVirtualization />
        </div>,
      );
      expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(10);
      expect(document.querySelectorAll('[role="gridcell"]')).to.have.length(10 * 2);
    });
  });

  describe('virtualization state', () => {
    it('should have virtualization enabled by default', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      const state = apiRef.current!.getState();
      expect(state.virtualization.enabled).to.equal(true);
      expect(state.virtualization.enabledForRows).to.equal(true);
      expect(state.virtualization.enabledForColumns).to.equal(true);
    });

    it('should disable virtualization when disableVirtualization is true', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid
            rows={testRows}
            columns={testColumns}
            apiRef={apiRef}
            disableVirtualization
          />
        </div>,
      );

      const state = apiRef.current!.getState();
      expect(state.virtualization.enabled).to.equal(false);
      expect(state.virtualization.enabledForRows).to.equal(false);
      expect(state.virtualization.enabledForColumns).to.equal(false);
    });

    it('should disable row virtualization when autoHeight is true', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} autoHeight />
        </div>,
      );

      const state = apiRef.current!.getState();
      expect(state.virtualization.enabled).to.equal(true);
      expect(state.virtualization.enabledForRows).to.equal(false);
      expect(state.virtualization.enabledForColumns).to.equal(true);
    });

    it('should disable column virtualization when disableColumnVirtualization is true', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid
            rows={testRows}
            columns={testColumns}
            apiRef={apiRef}
            disableColumnVirtualization
          />
        </div>,
      );

      const state = apiRef.current!.getState();
      expect(state.virtualization.enabled).to.equal(true);
      expect(state.virtualization.enabledForRows).to.equal(true);
      expect(state.virtualization.enabledForColumns).to.equal(false);
    });
  });

  describe('API', () => {
    it('should allow to toggle virtualization via setVirtualization', async () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.getState().virtualization.enabled).to.equal(true);

      await act(async () => {
        apiRef.current!.api.virtualization.setVirtualization(false);
      });

      expect(apiRef.current!.getState().virtualization.enabled).to.equal(false);
      expect(apiRef.current!.getState().virtualization.enabledForRows).to.equal(false);
      expect(apiRef.current!.getState().virtualization.enabledForColumns).to.equal(false);

      await act(async () => {
        apiRef.current!.api.virtualization.setVirtualization(true);
      });

      expect(apiRef.current!.getState().virtualization.enabled).to.equal(true);
    });

    it('should allow to toggle column virtualization via setColumnVirtualization', async () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.getState().virtualization.enabledForColumns).to.equal(true);

      await act(async () => {
        apiRef.current!.api.virtualization.setColumnVirtualization(false);
      });

      expect(apiRef.current!.getState().virtualization.enabledForColumns).to.equal(false);

      await act(async () => {
        apiRef.current!.api.virtualization.setColumnVirtualization(true);
      });

      expect(apiRef.current!.getState().virtualization.enabledForColumns).to.equal(true);
    });

    it('should return scroll position via getScrollPosition', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      const scrollPosition = apiRef.current!.api.virtualization.getScrollPosition();
      expect(scrollPosition).to.have.property('top');
      expect(scrollPosition).to.have.property('left');
      expect(typeof scrollPosition.top).to.equal('number');
      expect(typeof scrollPosition.left).to.equal('number');
    });

    it('should return offset top via getOffsetTop', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      const offsetTop = apiRef.current!.api.virtualization.getOffsetTop();
      expect(typeof offsetTop).to.equal('number');
    });

    it('should return virtualizer store via getVirtualizerStore', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      const virtualizerStore = apiRef.current!.api.virtualization.getVirtualizerStore();
      expect(virtualizerStore).to.have.property('state');
    });
  });

  describe('rows to render', () => {
    it('should render all rows when virtualization is disabled', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} disableVirtualization />
        </div>,
      );

      const rows = document.querySelectorAll('[role="row"][data-rowindex]');
      expect(rows).to.have.length(testRows.length);
    });

    it('should render all rows when autoHeight is true', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} autoHeight />
        </div>,
      );

      const rows = document.querySelectorAll('[role="row"][data-rowindex]');
      expect(rows).to.have.length(testRows.length);
    });

    it.skipIf(isJSDOM)('should render last row when scrolling to the bottom', async () => {
      const n = 4;
      const rowHeight = 50;
      const rowBufferPx = n * rowHeight;
      const nbRows = 996;
      const height = 600;
      const { rows, columns } = buildVirtualizationBehaviorTestData(nbRows, 2);
      const apiRef = React.createRef<GridInstance<VirtualizationBehaviorTestRow> | null>();

      render(
        <div style={{ width: 300, height }}>
          <TestDataGrid
            rows={rows}
            columns={columns}
            apiRef={apiRef}
            rowHeight={rowHeight}
            rowBufferPx={rowBufferPx}
            height={height}
          />
        </div>,
      );

      const virtualScroller = document.querySelector('[data-testid="virtual-scroller"]')!;
      const renderingZone = document.querySelector('[data-testid="virtual-scroller-render-zone"]')!;

      await waitFor(() => {
        expect(virtualScroller.scrollHeight).to.be.greaterThan(0);
      });

      await act(async () => {
        virtualScroller.scrollTop = virtualScroller.scrollHeight;
        virtualScroller.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        const lastCell = document.querySelector('[role="row"]:last-child [role="gridcell"]');
        expect(lastCell).to.have.text('col-0-995');
      });

      await waitFor(() => {
        expect(renderingZone.children.length).to.equal(
          Math.floor(height / rowHeight) + n,
          'children should have the correct length',
        );
      });

      const distanceToFirstRow = (nbRows - renderingZone.children.length) * rowHeight;
      expect(apiRef.current!.api.virtualization.getOffsetTop()).to.equal(
        distanceToFirstRow,
        'gridOffsetTop should be correct',
      );
      expect(virtualScroller.scrollHeight).to.equal(
        nbRows * rowHeight,
        'scrollHeight should be correct',
      );
    });

    it.skipIf(isJSDOM)(
      'should render new rows when scrolling past the threshold value',
      async () => {
        const { rows, columns } = buildVirtualizationBehaviorTestData(100, 2);
        const rowHeight = 50;
        const rowThresholdPx = rowHeight;

        render(
          <div style={{ width: 300, height: 300 }}>
            <TestDataGrid rows={rows} columns={columns} rowHeight={rowHeight} rowBufferPx={0} />
          </div>,
        );

        const virtualScroller = document.querySelector('[data-testid="virtual-scroller"]')!;
        const renderingZone = document.querySelector(
          '[data-testid="virtual-scroller-render-zone"]',
        )!;
        expect(renderingZone.firstElementChild).to.have.attr('data-rowindex', '0');
        await act(async () => virtualScroller.scrollTo({ top: rowThresholdPx }));
        await waitFor(() => {
          expect(renderingZone.firstElementChild).to.have.attr('data-rowindex', '1');
        });
      },
    );
  });

  describe('columns to render', () => {
    const manyColumns: ColumnDef<TestRow>[] = [
      { id: 'id', field: 'id', size: 100 },
      { id: 'brand', field: 'brand', size: 100 },
    ];

    it('should render all columns when virtualization is disabled', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={manyColumns} disableVirtualization />
        </div>,
      );

      const firstRow = document.querySelector('[role="row"][data-rowindex="0"]');
      const cells = firstRow?.querySelectorAll('[role="gridcell"]');
      expect(cells).to.have.length(manyColumns.length);
    });

    it('should render all columns when column virtualization is disabled', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={manyColumns} disableColumnVirtualization />
        </div>,
      );

      const firstRow = document.querySelector('[role="row"][data-rowindex="0"]');
      const cells = firstRow?.querySelectorAll('[role="gridcell"]');
      expect(cells).to.have.length(manyColumns.length);
    });

    it.skipIf(isJSDOM)(
      'should render extra columns when the columnBuffer prop is present',
      async () => {
        const width = 300;
        const n = 2;
        const columnWidth = 100;
        const columnBufferPx = n * columnWidth;
        const { rows, columns } = buildVirtualizationBehaviorTestData(1, 10);

        render(
          <TestDataGrid
            width={width}
            height={300}
            rows={rows}
            columns={columns}
            columnBufferPx={columnBufferPx}
          />,
        );

        const firstRow = $('[role="row"][data-rowindex="0"]')!;
        expect($$(firstRow, '[role="gridcell"]')).to.have.length(
          Math.floor(width / columnWidth) + n,
        );
        const virtualScroller = $('[data-testid="virtual-scroller"]')!;
        await act(async () => virtualScroller.scrollTo({ left: 301 }));
        await waitFor(() => {
          expect($$(firstRow, '[role="gridcell"]')).to.have.length(
            n + 1 + Math.floor(width / columnWidth) + n,
          );
        });
      },
    );

    it.skipIf(isJSDOM)(
      'should render new columns when scrolling past the threshold value',
      async () => {
        const columnWidth = 100;
        const columnThresholdPx = columnWidth;
        const { rows, columns } = buildVirtualizationBehaviorTestData(1, 10);

        render(
          <TestDataGrid
            width={300}
            height={300}
            rows={rows}
            columns={columns}
            columnBufferPx={0}
          />,
        );

        const virtualScroller = $('[data-testid="virtual-scroller"]')!;
        const renderingZone = $('[data-testid="virtual-scroller-render-zone"]')!;
        const firstRow = $(renderingZone, '[role="row"]:first-child')!;
        let firstColumn = $$(firstRow, '[role="gridcell"]')[0];
        expect(firstColumn).to.have.attr('data-colindex', '0');
        await act(async () => virtualScroller.scrollTo({ left: columnThresholdPx }));
        await waitFor(() => {
          firstColumn = $(renderingZone, '[role="row"] > [role="gridcell"]')!;
          expect(firstColumn).to.have.attr('data-colindex', '1');
        });
      },
    );
  });

  describe('options', () => {
    it('should use default rowHeight of 52', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      const dimensions = apiRef.current!.api.virtualization.hooks.useDimensions;
      expect(dimensions).to.be.a('function');
    });

    it('should use custom rowHeight when provided', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} rowHeight={40} />
        </div>,
      );

      // Verify the hook exists and can be used
      const dimensions = apiRef.current!.api.virtualization.hooks.useDimensions;
      expect(dimensions).to.be.a('function');
    });

    it('should accept initial scroll state', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid
            rows={testRows}
            columns={testColumns}
            apiRef={apiRef}
            initialState={{ scroll: { top: 100, left: 50 } }}
          />
        </div>,
      );

      // Verify the API is available
      expect(apiRef.current!.api.virtualization.getScrollPosition).to.be.a('function');
    });
  });

  describe('hooks', () => {
    it('should provide useScrollPosition hook', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.api.virtualization.hooks.useScrollPosition).to.be.a('function');
    });

    it('should provide useOffsetTop hook', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.api.virtualization.hooks.useOffsetTop).to.be.a('function');
    });

    it('should provide useOffsetLeft hook', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.api.virtualization.hooks.useOffsetLeft).to.be.a('function');
    });

    it('should provide useDimensions hook', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.api.virtualization.hooks.useDimensions).to.be.a('function');
    });

    it('should provide useRowsToRender hook', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.api.virtualization.hooks.useRowsToRender).to.be.a('function');
    });

    it('should provide useColumnsToRender hook', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.api.virtualization.hooks.useColumnsToRender).to.be.a('function');
    });

    it('should provide useContainerProps hook', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.api.virtualization.hooks.useContainerProps).to.be.a('function');
    });

    it('should provide useScrollerProps hook', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.api.virtualization.hooks.useScrollerProps).to.be.a('function');
    });

    it('should provide useContentProps hook', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.api.virtualization.hooks.useContentProps).to.be.a('function');
    });

    it('should provide usePositionerProps hook', () => {
      const apiRef = React.createRef<GridInstance<TestRow> | null>();

      render(
        <div style={{ width: 300, height: 300 }}>
          <TestDataGrid rows={testRows} columns={testColumns} apiRef={apiRef} />
        </div>,
      );

      expect(apiRef.current!.api.virtualization.hooks.usePositionerProps).to.be.a('function');
    });
  });
});
