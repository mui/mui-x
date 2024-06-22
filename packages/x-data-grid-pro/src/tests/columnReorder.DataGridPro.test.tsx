import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, fireEvent, createEvent, act } from '@mui/internal-test-utils';
import {
  getColumnHeadersTextContent,
  getColumnHeaderCell,
  getCell,
  raf,
} from 'test/utils/helperFn';
import { useGridApiRef, DataGridPro, gridClasses, GridApi } from '@mui/x-data-grid-pro';
import { useBasicDemoData } from '@mui/x-data-grid-generator';
import { spy } from 'sinon';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

function createDragOverEvent(target: ChildNode) {
  const dragOverEvent = createEvent.dragOver(target);
  // Safari 13 doesn't have DragEvent.
  // RTL fallbacks to Event which doesn't allow to set these fields during initialization.
  Object.defineProperty(dragOverEvent, 'clientX', { value: 1 });
  Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });

  return dragOverEvent;
}

function createDragEndEvent(target: ChildNode, isOutsideTheGrid: boolean = false) {
  const dragEndEvent = createEvent.dragEnd(target);
  Object.defineProperty(dragEndEvent, 'dataTransfer', {
    value: { dropEffect: isOutsideTheGrid ? 'none' : 'copy' },
  });

  return dragEndEvent;
}

describe('<DataGridPro /> - Columns reorder', () => {
  const { render } = createRenderer();

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
    ],
    columns: [{ field: 'id' }, { field: 'brand' }],
  };

  it('resizing after columns reorder should respect the new columns order', async () => {
    let apiRef: React.MutableRefObject<GridApi>;

    function TestCase(props: { width: number }) {
      const { width } = props;
      apiRef = useGridApiRef();
      return (
        <div style={{ width, height: 300 }}>
          <DataGridPro apiRef={apiRef} columns={baselineProps.columns} rows={baselineProps.rows} />
        </div>
      );
    }

    const { setProps } = render(<TestCase width={300} />);

    expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
    act(() => apiRef.current.setColumnIndex('id', 1));
    setProps({ width: 200 });
    await raf();
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'id']);
  });

  it('should not reset the column order when a prop change', () => {
    let apiRef: React.MutableRefObject<GridApi>;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    function Test() {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} rows={rows} columns={columns} />
        </div>
      );
    }

    const { forceUpdate } = render(<Test />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    act(() => apiRef.current.setColumnIndex('brand', 2));
    expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);
    forceUpdate(); // test stability
    expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);
  });

  it('should allow to reorder columns by dropping outside the header row', () => {
    let apiRef: React.MutableRefObject<GridApi>;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    function Test() {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} rows={rows} columns={columns} />
        </div>
      );
    }

    render(<Test />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    const dragCol = getColumnHeaderCell(0).firstChild!;
    const targetCell = getCell(0, 2)!;

    fireEvent.dragStart(dragCol);
    fireEvent.dragEnter(targetCell);
    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);

    const dragEndEvent = createDragEndEvent(dragCol);
    fireEvent(dragCol, dragEndEvent);
    expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);
  });

  it('should cancel the reordering when dropping the column outside the grid', () => {
    let apiRef: React.MutableRefObject<GridApi>;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    function Test() {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} rows={rows} columns={columns} />
        </div>
      );
    }

    render(<Test />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    const dragCol = getColumnHeaderCell(0).firstChild!;
    const targetCell = getCell(0, 2);

    fireEvent.dragStart(dragCol);
    fireEvent.dragEnter(targetCell);
    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);

    const dragEndEvent = createDragEndEvent(dragCol, true);
    fireEvent(dragCol, dragEndEvent);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
  });

  it('should keep the order of the columns when dragStart is fired and disableColumnReorder=true', () => {
    let apiRef: React.MutableRefObject<GridApi>;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    function Test() {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} rows={rows} columns={columns} disableColumnReorder />
        </div>
      );
    }

    render(<Test />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    const columnHeader = getColumnHeaderCell(0);
    const columnHeaderDraggableContainer = columnHeader.firstChild!;
    fireEvent.dragStart(columnHeaderDraggableContainer.firstChild!);
    expect(columnHeaderDraggableContainer).not.to.have.class(gridClasses['columnHeader--dragging']);
  });

  it('should keep the order of the columns when dragEnd is fired and disableColumnReorder=true', () => {
    let apiRef: React.MutableRefObject<GridApi>;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    function Test() {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} rows={rows} columns={columns} disableColumnReorder />
        </div>
      );
    }

    render(<Test />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    const dragCol = getColumnHeaderCell(2).firstChild!;
    const dragEndEvent = createDragEndEvent(dragCol, true);
    fireEvent(dragCol, dragEndEvent);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
  });

  it('should call onColumnOrderChange after the column has been reordered', () => {
    const onColumnOrderChange = spy();
    let apiRef: React.MutableRefObject<GridApi>;
    function Test() {
      apiRef = useGridApiRef();
      const data = useBasicDemoData(1, 3);

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} {...data} onColumnOrderChange={onColumnOrderChange} />
        </div>
      );
    }

    render(<Test />);

    const dragCol = getColumnHeaderCell(0).firstChild!;
    const targetCell = getCell(0, 2)!;

    fireEvent.dragStart(dragCol);
    fireEvent.dragEnter(targetCell);
    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    const dragEndEvent = createDragEndEvent(dragCol);
    fireEvent(dragCol, dragEndEvent);

    expect(onColumnOrderChange.callCount).to.equal(1);
    expect(onColumnOrderChange.lastCall.args[2].api.state.columns.orderedFields).to.deep.equal([
      'currencyPair',
      'price1M',
      'id',
    ]);
  });

  describe('column - disableReorder', () => {
    it('should not allow to start dragging a column with disableReorder=true', () => {
      let apiRef: React.MutableRefObject<GridApi>;
      const rows = [{ id: 0, brand: 'Nike' }];
      const columns = [
        { field: 'brand' },
        { field: 'desc', disableReorder: true },
        { field: 'type' },
      ];

      function Test() {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro apiRef={apiRef} rows={rows} columns={columns} />
          </div>
        );
      }

      render(<Test />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
      const dragCol = getColumnHeaderCell(1).firstChild!;
      const targetCol = getColumnHeaderCell(0).firstChild!;

      fireEvent.dragStart(dragCol);

      expect(dragCol).to.have.attribute('draggable', 'false');
      expect(dragCol).not.to.have.class(gridClasses['columnHeader--dragging']);

      fireEvent.dragEnter(targetCol);
      const dragOverEvent = createDragOverEvent(targetCol);
      fireEvent(targetCol, dragOverEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);

      const dragEndEvent = createDragEndEvent(dragCol);
      fireEvent(dragCol, dragEndEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    });

    it('should not allow to drag left of first visible column if it has disableReorder=true', () => {
      let apiRef: React.MutableRefObject<GridApi>;
      const rows = [{ id: 0, brand: 'Nike' }];
      const columns = [
        { field: 'brand', disableReorder: true },
        { field: 'desc' },
        { field: 'type' },
      ];

      function Test() {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro apiRef={apiRef} rows={rows} columns={columns} />
          </div>
        );
      }

      render(<Test />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
      const dragCol = getColumnHeaderCell(1).firstChild!;
      const targetCol = getColumnHeaderCell(0).firstChild!;

      fireEvent.dragStart(dragCol);
      fireEvent.dragEnter(targetCol);
      const dragOverEvent = createDragOverEvent(targetCol);
      fireEvent(targetCol, dragOverEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);

      const dragEndEvent = createDragEndEvent(dragCol);
      fireEvent(dragCol, dragEndEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    });

    it('should not allow to drag right of last visible column if it has disableReorder=true', () => {
      let apiRef: React.MutableRefObject<GridApi>;
      const rows = [{ id: 0, brand: 'Nike' }];
      const columns = [
        { field: 'brand' },
        { field: 'desc' },
        { field: 'type', disableReorder: true },
      ];

      function Test() {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro apiRef={apiRef} rows={rows} columns={columns} />
          </div>
        );
      }

      render(<Test />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
      const dragCol = getColumnHeaderCell(1).firstChild!;
      const targetCol = getColumnHeaderCell(2).firstChild!;

      fireEvent.dragStart(dragCol);
      fireEvent.dragEnter(targetCol);
      const dragOverEvent = createDragOverEvent(targetCol);
      fireEvent(targetCol, dragOverEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);

      const dragEndEvent = createDragEndEvent(dragCol);
      fireEvent(dragCol, dragEndEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    });

    it('should allow to drag right of a column with disableReorder=true if it is not the last visible one', () => {
      const rows = [{ id: 0, brand: 'Nike' }];
      const columns = [
        { field: 'brand' },
        { field: 'desc', disableReorder: true },
        { field: 'type' },
      ];

      function Test() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro rows={rows} columns={columns} />
          </div>
        );
      }

      render(<Test />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
      const dragCol = getColumnHeaderCell(0).firstChild!;
      const targetCol = getColumnHeaderCell(2).firstChild!;

      fireEvent.dragStart(dragCol);
      fireEvent.dragEnter(targetCol);
      const dragOverEvent2 = createDragOverEvent(targetCol);
      fireEvent(targetCol, dragOverEvent2);
      expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);

      const dragEndEvent = createDragEndEvent(dragCol);
      fireEvent(dragCol, dragEndEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);
    });
  });

  it('should prevent drag events propagation', () => {
    const handleDragStart = spy();
    const handleDragEnter = spy();
    const handleDragOver = spy();
    const handleDragEnd = spy();
    let apiRef: React.MutableRefObject<GridApi>;
    function Test() {
      apiRef = useGridApiRef();
      const data = useBasicDemoData(3, 3);

      return (
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          style={{ width: 300, height: 300 }}
        >
          <DataGridPro apiRef={apiRef} {...data} rowReordering />
        </div>
      );
    }

    render(<Test />);

    const dragCol = getColumnHeaderCell(1).firstChild!;
    const targetCell = getCell(1, 2)!;

    fireEvent.dragStart(dragCol);
    fireEvent.dragEnter(targetCell);
    const dragOverCellEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverCellEvent);
    const dragEndColEvent = createDragEndEvent(dragCol);
    fireEvent(dragCol, dragEndColEvent);

    expect(handleDragStart.callCount).to.equal(0);
    expect(handleDragEnter.callCount).to.equal(0);
    expect(handleDragOver.callCount).to.equal(0);
    expect(handleDragEnd.callCount).to.equal(0);
  });

  describe('reorder with column grouping', () => {
    it('should not allow to drag column outside of its group', () => {
      const rows = [{ id: 0 }];
      const columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];

      const columnGroupingModel = [
        { groupId: 'col12', children: [{ field: 'col1' }, { field: 'col2' }] },
      ];

      function Test() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel} />
          </div>
        );
      }

      render(<Test />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
      const dragCol = getColumnHeaderCell(0, 1).firstChild!;
      const targetCol = getColumnHeaderCell(2, 1).firstChild!;

      fireEvent.dragStart(dragCol);
      fireEvent.dragEnter(targetCol);
      const dragOverEvent2 = createDragOverEvent(targetCol);
      fireEvent(targetCol, dragOverEvent2);
      expect(getColumnHeadersTextContent()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);

      const dragEndEvent = createDragEndEvent(dragCol);
      fireEvent(dragCol, dragEndEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
    });

    describe('column - hidden', () => {
      it('should use the correct start and end index', () => {
        const rows = [{ id: 0 }];
        const columns = [
          { field: 'col1' },
          { field: 'col2' },
          { field: 'col3' },
          { field: 'col4' },
        ];

        const columnGroupingModel = [
          { groupId: 'col23', children: [{ field: 'col2' }, { field: 'col3' }] },
        ];

        function Test() {
          return (
            <div style={{ width: 300, height: 300 }}>
              <DataGridPro
                rows={rows}
                columns={columns}
                columnGroupingModel={columnGroupingModel}
                columnVisibilityModel={{ col1: false }}
              />
            </div>
          );
        }

        render(<Test />);
        expect(getColumnHeadersTextContent()).to.deep.equal(['col23', '', 'col2', 'col3', 'col4']);
        const dragCol = getColumnHeaderCell(0, 1).firstChild!;
        const col3 = getColumnHeaderCell(1, 1).firstChild!;
        const col4 = getColumnHeaderCell(2, 1).firstChild!;

        // Do not allow to move col2 after col4
        fireEvent.dragStart(dragCol);
        fireEvent.dragEnter(col3);
        const dragOverEvent1 = createDragOverEvent(col3);
        fireEvent(col3, dragOverEvent1);
        expect(getColumnHeadersTextContent()).to.deep.equal(['col23', '', 'col3', 'col2', 'col4']);

        // Allow to move col2 after col3
        fireEvent.dragEnter(col4);
        const dragOverEvent2 = createDragOverEvent(col4);
        fireEvent(col4, dragOverEvent2);
        expect(getColumnHeadersTextContent()).to.deep.equal(['col23', '', 'col3', 'col2', 'col4']);
      });

      it('should consider moving the column between hidden columns if it respect group constraint and visible behavior', () => {
        const rows = [{ id: 0 }];
        const columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];

        const columnGroupingModel = [
          { groupId: 'col23', children: [{ field: 'col2' }, { field: 'col3' }] },
        ];

        function Test(props: any) {
          return (
            <div style={{ width: 300, height: 300 }}>
              <DataGridPro
                rows={rows}
                columns={columns}
                columnGroupingModel={columnGroupingModel}
                columnVisibilityModel={{ col3: false }}
                {...props}
              />
            </div>
          );
        }

        const { setProps } = render(<Test />);
        expect(getColumnHeadersTextContent()).to.deep.equal(['', 'col23', 'col1', 'col2']);
        const dragCol = getColumnHeaderCell(0, 1).firstChild!;
        const targetCol = getColumnHeaderCell(1, 1).firstChild!;

        // Move col 1 after col 3 to respect column grouping consistency even if col3 is hidden
        fireEvent.dragStart(dragCol);
        fireEvent.dragEnter(targetCol);
        const dragOverEvent = createDragOverEvent(targetCol);
        fireEvent(targetCol, dragOverEvent);
        expect(getColumnHeadersTextContent()).to.deep.equal(['col23', '', 'col2', 'col1']);

        setProps({ columnVisibilityModel: {} });
        expect(getColumnHeadersTextContent()).to.deep.equal(['col23', '', 'col2', 'col3', 'col1']);
      });
    });

    it('should not allow to drag column inside a group', () => {
      const rows = [{ id: 0 }];
      const columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];

      const columnGroupingModel = [
        { groupId: 'col12', children: [{ field: 'col1' }, { field: 'col2' }] },
      ];

      function Test() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel} />
          </div>
        );
      }

      render(<Test />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
      const dragCol = getColumnHeaderCell(2, 1).firstChild!;
      const targetCol = getColumnHeaderCell(1, 1).firstChild!;

      fireEvent.dragStart(dragCol);
      fireEvent.dragEnter(targetCol);
      const dragOverEvent2 = createDragOverEvent(targetCol);
      fireEvent(targetCol, dragOverEvent2);
      expect(getColumnHeadersTextContent()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);

      const dragEndEvent = createDragEndEvent(dragCol);
      fireEvent(dragCol, dragEndEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
    });

    it('should allow to drag column outside of its group if it allows freeReordering', () => {
      const rows = [{ id: 0 }];
      const columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];

      const columnGroupingModel = [
        {
          groupId: 'col12',
          children: [{ field: 'col1' }, { field: 'col2' }],
          freeReordering: true,
        },
      ];

      function Test() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel} />
          </div>
        );
      }

      render(<Test />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['col12', '', 'col1', 'col2', 'col3']);
      const dragCol = getColumnHeaderCell(0, 1).firstChild!;
      const targetCol = getColumnHeaderCell(2, 1).firstChild!;

      fireEvent.dragStart(dragCol);
      fireEvent.dragEnter(targetCol);
      const dragOverEvent2 = createDragOverEvent(targetCol);
      fireEvent(targetCol, dragOverEvent2);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'col12',
        '',
        'col12',
        'col2',
        'col3',
        'col1',
      ]);

      const dragEndEvent = createDragEndEvent(dragCol);
      fireEvent(dragCol, dragEndEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'col12',
        '',
        'col12',
        'col2',
        'col3',
        'col1',
      ]);
    });

    it('should allow to drag column inside a group if it allows freeReordering', () => {
      // TODO: I observed columns are always moved from left to right
      // The reason being that is:
      // - when event.clientX does not change we consider that column is moving to the right
      // - fireEvent.dragStart always set event.clientX = 1 (did not managed to modify this behavior)
      const rows = [{ id: 0 }];
      const columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];

      const columnGroupingModel = [
        {
          groupId: 'col23',
          children: [{ field: 'col2' }, { field: 'col3' }],
          freeReordering: true,
        },
      ];

      function Test() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel} />
          </div>
        );
      }

      render(<Test />);
      expect(getColumnHeadersTextContent()).to.deep.equal(['', 'col23', 'col1', 'col2', 'col3']);
      const dragCol = getColumnHeaderCell(0, 1).firstChild!;
      const targetCol = getColumnHeaderCell(1, 1).firstChild!;

      fireEvent.dragStart(dragCol);
      fireEvent.dragEnter(targetCol);
      const dragOverEvent2 = createDragOverEvent(targetCol);
      fireEvent(targetCol, dragOverEvent2);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'col23',
        '',
        'col23',
        'col2',
        'col1',
        'col3',
      ]);

      const dragEndEvent = createDragEndEvent(dragCol);
      fireEvent(dragCol, dragEndEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'col23',
        '',
        'col23',
        'col2',
        'col1',
        'col3',
      ]);
    });

    it('should allow to split a group with freeReordering in another group', () => {
      const rows = [{ id: 0 }];
      const columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];

      const columnGroupingModel = [
        {
          groupId: 'col123',
          children: [
            { field: 'col1' },
            {
              groupId: 'col23',
              children: [{ field: 'col2' }, { field: 'col3' }],
              freeReordering: true,
            },
          ],
        },
      ];

      function Test() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel} />
          </div>
        );
      }

      render(<Test />);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'col123',
        '',
        'col23',
        'col1',
        'col2',
        'col3',
      ]);
      const dragCol = getColumnHeaderCell(0, 2).firstChild!;
      const targetCol = getColumnHeaderCell(1, 2).firstChild!;

      fireEvent.dragStart(dragCol);
      fireEvent.dragEnter(targetCol);
      const dragOverEvent2 = createDragOverEvent(targetCol);
      fireEvent(targetCol, dragOverEvent2);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'col123',
        'col23',
        '',
        'col23',
        'col2',
        'col1',
        'col3',
      ]);

      const dragEndEvent = createDragEndEvent(dragCol);
      fireEvent(dragCol, dragEndEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'col123',
        'col23',
        '',
        'col23',
        'col2',
        'col1',
        'col3',
      ]);
    });

    it('should block dragging outside of a group even at deeper level', () => {
      const rows = [{ id: 0 }];
      const columns = [{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }];

      const columnGroupingModel = [
        {
          groupId: 'col12',
          children: [
            { field: 'col1' },
            {
              groupId: 'col2',
              children: [{ field: 'col2' }],
              freeReordering: true,
            },
          ],
        },
      ];

      function Test() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel} />
          </div>
        );
      }

      render(<Test />);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'col12',
        '',
        '',
        'col2',
        '',
        'col1',
        'col2',
        'col3',
      ]);
      const dragCol = getColumnHeaderCell(0, 1).firstChild!;
      const targetCol = getColumnHeaderCell(2, 1).firstChild!;

      fireEvent.dragStart(dragCol);
      fireEvent.dragEnter(targetCol);
      const dragOverEvent2 = createDragOverEvent(targetCol);
      fireEvent(targetCol, dragOverEvent2);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'col12',
        '',
        '',
        'col2',
        '',
        'col1',
        'col2',
        'col3',
      ]);

      const dragEndEvent = createDragEndEvent(dragCol);
      fireEvent(dragCol, dragEndEvent);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'col12',
        '',
        '',
        'col2',
        '',
        'col1',
        'col2',
        'col3',
      ]);
    });
  });
});
