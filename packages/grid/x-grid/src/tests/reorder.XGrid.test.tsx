import * as React from 'react';
import { expect } from 'chai';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  act,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  createEvent,
} from 'test/utils';
import {
  getColumnHeadersTextContent,
  getColumnHeaderCell,
  getCell,
  raf,
} from 'test/utils/helperFn';
import {
  GridApiRef,
  useGridApiRef,
  XGrid,
  GRID_COLUMN_HEADER_DRAGGING_CSS_CLASS,
} from '@material-ui/x-grid';

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

describe('<XGrid /> - Reorder', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

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

  describe('Columns', () => {
    it('resizing after columns reorder should respect the new columns order', async () => {
      let apiRef: GridApiRef;

      const TestCase = (props: { width: number }) => {
        const { width } = props;
        apiRef = useGridApiRef();
        return (
          <div style={{ width, height: 300 }}>
            <XGrid apiRef={apiRef} columns={baselineProps.columns} rows={baselineProps.rows} />
          </div>
        );
      };

      const { setProps } = render(<TestCase width={300} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
      act(() => {
        apiRef!.current.setColumnIndex('id', 1);
      });
      setProps({ width: 200 });
      await raf();
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'id']);
    });
  });

  it('should not reset the column order when a prop change', () => {
    let apiRef: GridApiRef;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    const Test = () => {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid apiRef={apiRef} rows={rows} columns={columns} onPageChange={() => {}} />
        </div>
      );
    };

    const { forceUpdate } = render(<Test />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    apiRef!.current.setColumnIndex('brand', 2);
    expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);
    forceUpdate(); // test stability
    expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);
  });

  it('should allow to reorder columns by dropping outside the header row', () => {
    let apiRef: GridApiRef;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    const Test = () => {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid apiRef={apiRef} rows={rows} columns={columns} onPageChange={() => {}} />
        </div>
      );
    };

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
    let apiRef: GridApiRef;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    const Test = () => {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid apiRef={apiRef} rows={rows} columns={columns} onPageChange={() => {}} />
        </div>
      );
    };

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
    let apiRef: GridApiRef;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    const Test = () => {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            onPageChange={() => {}}
            disableColumnReorder
          />
        </div>
      );
    };

    render(<Test />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    const columnHeader = getColumnHeaderCell(0);
    const columnHeaderDraggableContainer = columnHeader.firstChild as HTMLElement;
    fireEvent.dragStart(columnHeaderDraggableContainer.firstChild);
    expect(
      columnHeaderDraggableContainer.classList.contains(GRID_COLUMN_HEADER_DRAGGING_CSS_CLASS),
    ).to.equal(false);
  });

  it('should keep the order of the columns when dragEnd is fired and disableColumnReorder=true', () => {
    let apiRef: GridApiRef;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    const Test = () => {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            onPageChange={() => {}}
            disableColumnReorder
          />
        </div>
      );
    };

    render(<Test />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    const dragCol = getColumnHeaderCell(2).firstChild!;
    const dragEndEvent = createDragEndEvent(dragCol, true);
    fireEvent(dragCol, dragEndEvent);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
  });

  describe('column disableReorder', () => {
    it('should not allow to start dragging a column with disableReorder=true', () => {
      let apiRef: GridApiRef;
      const rows = [{ id: 0, brand: 'Nike' }];
      const columns = [
        { field: 'brand' },
        { field: 'desc', disableReorder: true },
        { field: 'type' },
      ];

      const Test = () => {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid apiRef={apiRef} rows={rows} columns={columns} onPageChange={() => {}} />
          </div>
        );
      };

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

    it('should not allow to drag left of first visible column if it has disableReorder=true', () => {
      let apiRef: GridApiRef;
      const rows = [{ id: 0, brand: 'Nike' }];
      const columns = [
        { field: 'brand', disableReorder: true },
        { field: 'desc' },
        { field: 'type' },
      ];

      const Test = () => {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid apiRef={apiRef} rows={rows} columns={columns} onPageChange={() => {}} />
          </div>
        );
      };

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
      let apiRef: GridApiRef;
      const rows = [{ id: 0, brand: 'Nike' }];
      const columns = [
        { field: 'brand' },
        { field: 'desc' },
        { field: 'type', disableReorder: true },
      ];

      const Test = () => {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid apiRef={apiRef} rows={rows} columns={columns} onPageChange={() => {}} />
          </div>
        );
      };

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

    it('should allow to drag right of a column with disableReorder=true if it is not the last visible one', () => {
      let apiRef: GridApiRef;
      const rows = [{ id: 0, brand: 'Nike' }];
      const columns = [
        { field: 'brand' },
        { field: 'desc', disableReorder: true },
        { field: 'type' },
      ];

      const Test = () => {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid apiRef={apiRef} rows={rows} columns={columns} onPageChange={() => {}} />
          </div>
        );
      };

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
});
