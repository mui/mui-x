import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { createRenderer, fireEvent, createEvent } from '@mui/internal-test-utils';
import { getCell, getRowsFieldContent } from 'test/utils/helperFn';
import { useGridApiRef, DataGridPro, gridClasses, GridApi } from '@mui/x-data-grid-pro';
import { useBasicDemoData } from '@mui/x-data-grid-generator';

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

describe('<DataGridPro /> - Row reorder', () => {
  const { render } = createRenderer();

  it('should cancel the reordering when dropping the row outside the grid', () => {
    let apiRef: React.MutableRefObject<GridApi>;
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ];
    const columns = [{ field: 'brand' }];

    function Test() {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} rows={rows} columns={columns} rowReordering />
        </div>
      );
    }

    render(<Test />);

    expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    const rowReorderCell = getCell(0, 0).firstChild!;
    const targetCell = getCell(1, 0);

    fireEvent.dragStart(rowReorderCell);
    fireEvent.dragEnter(targetCell);
    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    expect(getRowsFieldContent('brand')).to.deep.equal(['Adidas', 'Nike', 'Puma']);

    const dragEndEvent = createDragEndEvent(rowReorderCell, true);
    fireEvent(rowReorderCell, dragEndEvent);
    expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
  });

  it('should keep the order of the rows when dragStart is fired and rowReordering=false', () => {
    let apiRef: React.MutableRefObject<GridApi>;
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ];
    const columns = [{ field: 'brand' }];

    function Test() {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} rows={rows} columns={columns} />
        </div>
      );
    }

    render(<Test />);
    expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    const rowReorderCell = getCell(0, 0)!;
    fireEvent.dragStart(rowReorderCell);
    expect(rowReorderCell).not.to.have.class(gridClasses['row--dragging']);
  });

  it('should keep the order of the rows when dragEnd is fired and rowReordering=false', () => {
    let apiRef: React.MutableRefObject<GridApi>;
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ];
    const columns = [{ field: 'brand' }];

    function Test() {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} rows={rows} columns={columns} />
        </div>
      );
    }

    render(<Test />);
    expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    const rowReorderCell = getCell(0, 0).firstChild!;
    const dragEndEvent = createDragEndEvent(rowReorderCell, true);
    fireEvent(rowReorderCell, dragEndEvent);
    expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
  });

  it('should call onRowOrderChange after the row stops being dragged', () => {
    const handleOnRowOrderChange = spy();
    let apiRef: React.MutableRefObject<GridApi>;
    function Test() {
      apiRef = useGridApiRef();
      const rows = [
        { id: 0, brand: 'Nike' },
        { id: 1, brand: 'Adidas' },
        { id: 2, brand: 'Puma' },
      ];
      const columns = [{ field: 'brand' }];

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            onRowOrderChange={handleOnRowOrderChange}
            rowReordering
          />
        </div>
      );
    }

    render(<Test />);

    expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);

    const rowReorderCell = getCell(0, 0).firstChild!;
    const targetCell = getCell(1, 0)!;
    fireEvent.dragStart(rowReorderCell);
    fireEvent.dragEnter(targetCell);
    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    expect(handleOnRowOrderChange.callCount).to.equal(0);
    const dragEndEvent = createDragEndEvent(rowReorderCell);
    fireEvent(rowReorderCell, dragEndEvent);

    expect(handleOnRowOrderChange.callCount).to.equal(1);
    expect(getRowsFieldContent('brand')).to.deep.equal(['Adidas', 'Nike', 'Puma']);
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

    const rowReorderCell = getCell(0, 0).firstChild!;
    const targetrowReorderCell = getCell(1, 0)!;

    fireEvent.dragStart(rowReorderCell);
    fireEvent.dragEnter(targetrowReorderCell);
    const dragOverRowEvent = createDragOverEvent(targetrowReorderCell);
    fireEvent(targetrowReorderCell, dragOverRowEvent);
    const dragEndRowEvent = createDragEndEvent(rowReorderCell);
    fireEvent(rowReorderCell, dragEndRowEvent);

    expect(handleDragStart.callCount).to.equal(0);
    expect(handleDragOver.callCount).to.equal(0);
    expect(handleDragEnd.callCount).to.equal(0);
  });
});
