import { vi } from 'vitest';
import { createRenderer, fireEvent, screen, createEvent, waitFor } from '@mui/internal-test-utils';
import { getCell, getColumnValues, getRowsFieldContent } from 'test/utils/helperFn';
import { DataGridPro, gridClasses } from '@mui/x-data-grid-pro';
import { isJSDOM } from 'test/utils/skipIf';
import { useBasicDemoData } from '@mui/x-data-grid-generator';

function createDragOverEvent(target: ChildNode, dropPosition: 'above' | 'below' = 'above') {
  const dragOverEvent = createEvent.dragOver(target);
  // Safari 13 doesn't have DragEvent.
  // RTL fallbacks to Event which doesn't allow to set these fields during initialization.
  Object.defineProperty(dragOverEvent, 'clientX', { value: 1 });

  // Mock getBoundingClientRect for the target
  const targetElement = target as Element;
  if (!targetElement.getBoundingClientRect) {
    targetElement.getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      width: 100,
      height: 52,
      right: 100,
      bottom: 52,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
  }

  // Set clientY based on drop position - relative to getBoundingClientRect
  const rect = targetElement.getBoundingClientRect();
  const clientY =
    dropPosition === 'above'
      ? rect.top + rect.height * 0.25 // Upper quarter
      : rect.top + rect.height * 0.75; // Lower quarter

  Object.defineProperty(dragOverEvent, 'clientY', { value: clientY });
  Object.defineProperty(dragOverEvent, 'target', { value: target });
  Object.defineProperty(dragOverEvent, 'dataTransfer', {
    value: {
      dropEffect: 'copy',
    },
  });

  return dragOverEvent;
}

function fireDragStart(target: ChildNode) {
  const dragStartEvent = createEvent.dragStart(target);
  Object.defineProperty(dragStartEvent, 'dataTransfer', {
    value: {
      effectAllowed: 'copy',
      setData: () => {},
      getData: () => '',
    },
  });
  fireEvent(target, dragStartEvent);
}

function createDragEndEvent(target: ChildNode, isOutsideTheGrid: boolean = false) {
  const dragEndEvent = createEvent.dragEnd(target);
  Object.defineProperty(dragEndEvent, 'dataTransfer', {
    value: { dropEffect: isOutsideTheGrid ? 'none' : 'copy' },
  });

  return dragEndEvent;
}

describe.skipIf(isJSDOM)('<DataGridPro /> - Row reorder', () => {
  const { render } = createRenderer();

  it('should cancel the reordering when dropping the row outside the grid', () => {
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ];
    const columns = [{ field: 'brand' }];

    function Test() {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro rows={rows} columns={columns} rowReordering />
        </div>
      );
    }

    render(<Test />);

    expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    const rowReorderCell = getCell(0, 0).firstChild! as Element;
    const targetCell = getCell(2, 0);

    // Start the drag
    fireDragStart(rowReorderCell);

    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);

    const targetRow = targetCell.closest('[data-id]');
    const rowDragPlaceholder = targetRow?.lastElementChild;
    expect(rowDragPlaceholder).not.to.be.oneOf([null, undefined]);
    expect(rowDragPlaceholder).to.have.style('position', 'absolute');
    const pseudoElement = window.getComputedStyle(rowDragPlaceholder!, '::before');
    expect(pseudoElement.height).to.equal('2px');

    // End the drag to update the row order
    const dragEndEvent = createDragEndEvent(rowReorderCell, true);
    fireEvent(rowReorderCell, dragEndEvent);
    expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
  });

  it('should keep the order of the rows when dragStart is fired and rowReordering=false', () => {
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ];
    const columns = [{ field: 'brand' }];

    function Test() {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro rows={rows} columns={columns} />
        </div>
      );
    }

    render(<Test />);
    expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    const rowReorderCell = getCell(0, 0)!;
    fireDragStart(rowReorderCell);
    expect(rowReorderCell).not.to.have.class(gridClasses['row--dragging']);
  });

  it('should keep the order of the rows when dragEnd is fired and rowReordering=false', () => {
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ];
    const columns = [{ field: 'brand' }];

    function Test() {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro rows={rows} columns={columns} />
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

  it('should call onRowOrderChange after the row stops being dragged', async () => {
    const handleOnRowOrderChange = vi.fn();
    function Test() {
      const rows = [
        { id: 0, brand: 'Nike' },
        { id: 1, brand: 'Adidas' },
        { id: 2, brand: 'Puma' },
      ];
      const columns = [{ field: 'brand' }];

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
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
    const targetCell = getCell(2, 0)!;
    fireDragStart(rowReorderCell);

    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    expect(handleOnRowOrderChange).toHaveBeenCalledTimes(0);
    const dragEndEvent = createDragEndEvent(rowReorderCell);
    fireEvent(rowReorderCell, dragEndEvent);

    await waitFor(() => {
      expect(handleOnRowOrderChange).toHaveBeenCalledTimes(1);
    });
    expect(getRowsFieldContent('brand')).to.deep.equal(['Adidas', 'Nike', 'Puma']);
  });

  it('should prevent drag events propagation', () => {
    const handleDragStart = vi.fn();
    const handleDragEnter = vi.fn();
    const handleDragOver = vi.fn();
    const handleDragEnd = vi.fn();
    function Test() {
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
          <DataGridPro {...data} rowReordering />
        </div>
      );
    }

    render(<Test />);

    const rowReorderCell = getCell(0, 0).firstChild!;
    const targetrowReorderCell = getCell(1, 0)!;

    fireDragStart(rowReorderCell);
    const dragOverRowEvent = createDragOverEvent(targetrowReorderCell);
    fireEvent(targetrowReorderCell, dragOverRowEvent);
    const dragEndRowEvent = createDragEndEvent(rowReorderCell);
    fireEvent(rowReorderCell, dragEndRowEvent);

    expect(handleDragStart).toHaveBeenCalledTimes(0);
    expect(handleDragOver).toHaveBeenCalledTimes(0);
    expect(handleDragEnd).toHaveBeenCalledTimes(0);
  });

  it('should reorder rows correctly on any page when pagination is enabled', async () => {
    const rows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
      { id: 3, brand: 'Skechers' },
      { id: 4, brand: 'Vans' },
      { id: 5, brand: 'Converse' },
    ];
    const columns = [{ field: 'brand' }];
    const onRowOrderChange = vi.fn();
    function Test() {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            rows={rows}
            columns={columns}
            rowReordering
            pagination
            initialState={{
              pagination: {
                paginationModel: { pageSize: 3 },
              },
            }}
            pageSizeOptions={[3]}
            onRowOrderChange={onRowOrderChange}
          />
        </div>
      );
    }

    render(<Test />);
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(getColumnValues(0)).to.deep.equal(['3', '4', '5']);
    expect(getRowsFieldContent('brand')).to.deep.equal(['Skechers', 'Vans', 'Converse']);
    const rowReorderCell = getCell(3, 0).firstChild! as Element;
    const targetCell = getCell(5, 0);

    // Start the drag
    fireDragStart(rowReorderCell);
    const sourceRow = rowReorderCell.closest('[data-id]');
    expect(sourceRow).to.have.class(gridClasses['row--beingDragged']);

    // Hover over the target row to render a drop indicator
    const dragOverEvent = createDragOverEvent(targetCell);
    fireEvent(targetCell, dragOverEvent);
    const targetRow = targetCell.closest('[data-id]');
    const rowDragPlaceholder = targetRow?.lastElementChild;
    expect(rowDragPlaceholder).not.to.be.oneOf([null, undefined]);
    expect(rowDragPlaceholder).to.have.style('position', 'absolute');
    const beforePseudoElement = window.getComputedStyle(rowDragPlaceholder!, '::before');
    expect(beforePseudoElement.height).to.equal('2px');

    // End the drag to update the row order
    const dragEndEvent = createDragEndEvent(rowReorderCell);
    fireEvent(rowReorderCell, dragEndEvent);
    await waitFor(() => {
      expect(onRowOrderChange).toHaveBeenCalledTimes(1);
    });

    expect(getRowsFieldContent('brand')).to.deep.equal(['Vans', 'Skechers', 'Converse']);
  });

  it('should render vertical scroll areas when row reordering is active', () => {
    // Create more rows to ensure scrolling is needed
    const rows = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      brand: `Brand ${i}`,
    }));
    const columns = [{ field: 'brand' }];

    function Test() {
      return (
        <div style={{ width: 300, height: 200 }}>
          {/* Smaller height to force scrolling */}
          <DataGridPro rows={rows} columns={columns} rowReordering />
        </div>
      );
    }

    const { container } = render(<Test />);

    // Initially, no scroll areas should be visible
    /* eslint-disable testing-library/no-container */
    expect(container.querySelectorAll(`.${gridClasses.scrollArea}`)).to.have.length(0);

    // Start dragging a row at the top (scroll = 0)
    const rowReorderCell = getCell(0, 0).firstChild!;
    fireDragStart(rowReorderCell);

    // Check what scroll areas are rendered when at the top
    let allScrollAreas = container.querySelectorAll(`.${gridClasses.scrollArea}`);
    let upScrollAreas = container.querySelectorAll(`.${gridClasses['scrollArea--up']}`);
    let downScrollAreas = container.querySelectorAll(`.${gridClasses['scrollArea--down']}`);

    // At the top: only down scroll area should be rendered (up should NOT exist)
    expect(allScrollAreas.length).to.equal(1);
    expect(upScrollAreas).to.have.length(0); // No up scroll area when at top
    expect(downScrollAreas).to.have.length(1); // Down scroll area available

    // End dragging to reset state
    let dragEndEvent = createDragEndEvent(rowReorderCell);
    fireEvent(rowReorderCell, dragEndEvent);

    // Scroll areas should be hidden again
    expect(container.querySelectorAll(`.${gridClasses.scrollArea}`)).to.have.length(0);

    // Now scroll down to enable both up and down scrolling
    const virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller')!;
    fireEvent.scroll(virtualScroller, { target: { scrollTop: 100 } });

    // Start dragging again after scrolling down
    fireDragStart(rowReorderCell);

    // Check scroll areas after scrolling down
    allScrollAreas = container.querySelectorAll(`.${gridClasses.scrollArea}`);
    upScrollAreas = container.querySelectorAll(`.${gridClasses['scrollArea--up']}`);
    downScrollAreas = container.querySelectorAll(`.${gridClasses['scrollArea--down']}`);

    // After scrolling down: both up and down scroll areas should be rendered
    expect(allScrollAreas.length).to.equal(2);
    expect(upScrollAreas).to.have.length(1); // Up scroll area now available
    expect(downScrollAreas).to.have.length(1); // Down scroll area still available

    // End dragging
    dragEndEvent = createDragEndEvent(rowReorderCell);
    fireEvent(rowReorderCell, dragEndEvent);

    // Scroll areas should be hidden again
    expect(container.querySelectorAll(`.${gridClasses.scrollArea}`)).to.have.length(0);
    /* eslint-enable testing-library/no-container */
  });

  it('should allow row reordering when dragging from any cell during active reorder', async () => {
    const rows = [
      { id: 0, brand: 'Nike', category: 'Sportswear' },
      { id: 1, brand: 'Adidas', category: 'Sportswear' },
      { id: 2, brand: 'Puma', category: 'Sportswear' },
    ];
    const columns = [
      { field: 'brand', width: 150 },
      { field: 'category', width: 150 },
    ];

    const onRowOrderChange = vi.fn();
    function Test() {
      return (
        <div style={{ width: 400, height: 300 }}>
          <DataGridPro
            rows={rows}
            columns={columns}
            rowReordering
            disableColumnReorder
            onRowOrderChange={onRowOrderChange}
          />
        </div>
      );
    }

    render(<Test />);

    // Verify initial row order
    expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);

    // Start drag from the reorder cell (column 0, row 0)
    const rowReorderCell = getCell(0, 0).firstChild! as Element;
    fireDragStart(rowReorderCell);

    // Verify that the reorder cell has the dragging class (this happens immediately)
    expect(rowReorderCell).to.have.class(gridClasses['row--dragging']);

    // Now drag over a non-reorder cell (brand cell of row 2)
    const targetNonReorderCell = getCell(2, 1); // brand cell of the third row
    fireEvent.dragEnter(targetNonReorderCell);

    // Hover over the target cell to render a drop indicator
    const dragOverEvent = createDragOverEvent(targetNonReorderCell);
    fireEvent(targetNonReorderCell, dragOverEvent);

    // Verify that the target row shows the drop indicator
    const targetRow = targetNonReorderCell.closest('[data-id]');
    const rowDragPlaceholder = targetRow?.lastElementChild;
    expect(rowDragPlaceholder).not.to.be.oneOf([null, undefined]);
    expect(rowDragPlaceholder).to.have.style('position', 'absolute');
    const pseudoElement = window.getComputedStyle(rowDragPlaceholder!, '::before');
    expect(pseudoElement.height).to.equal('2px');

    // End the drag to complete the row reorder
    const dragEndEvent = createDragEndEvent(rowReorderCell);
    fireEvent(rowReorderCell, dragEndEvent);

    await waitFor(() => {
      expect(onRowOrderChange).toHaveBeenCalledTimes(1);
    });

    // Verify that the row order has changed (Nike should now be between Adidas and Puma)
    expect(getRowsFieldContent('brand')).to.deep.equal(['Adidas', 'Nike', 'Puma']);
  });
});
