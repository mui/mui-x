"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var skipIf_1 = require("test/utils/skipIf");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
function createDragOverEvent(target) {
    var dragOverEvent = internal_test_utils_1.createEvent.dragOver(target);
    // Safari 13 doesn't have DragEvent.
    // RTL fallbacks to Event which doesn't allow to set these fields during initialization.
    Object.defineProperty(dragOverEvent, 'clientX', { value: 1 });
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
    return dragOverEvent;
}
function createDragEndEvent(target, isOutsideTheGrid) {
    if (isOutsideTheGrid === void 0) { isOutsideTheGrid = false; }
    var dragEndEvent = internal_test_utils_1.createEvent.dragEnd(target);
    Object.defineProperty(dragEndEvent, 'dataTransfer', {
        value: { dropEffect: isOutsideTheGrid ? 'none' : 'copy' },
    });
    return dragEndEvent;
}
describe.skipIf(skipIf_1.isJSDOM)('<DataGridPro /> - Row reorder', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('should cancel the reordering when dropping the row outside the grid', function () {
        var rows = [
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
        ];
        var columns = [{ field: 'brand' }];
        function Test() {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} rowReordering/>
        </div>);
        }
        render(<Test />);
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        var rowReorderCell = (0, helperFn_1.getCell)(0, 0).firstChild;
        var targetCell = (0, helperFn_1.getCell)(2, 0);
        // Start the drag
        internal_test_utils_1.fireEvent.dragStart(rowReorderCell);
        internal_test_utils_1.fireEvent.dragEnter(targetCell);
        // Hover over the target row to render a drop indicator
        var dragOverEvent = createDragOverEvent(targetCell);
        (0, internal_test_utils_1.fireEvent)(targetCell, dragOverEvent);
        var targetRow = targetCell.closest('[data-id]');
        expect(targetRow).to.have.class(x_data_grid_pro_1.gridClasses['row--dropAbove']);
        // End the drag to update the row order
        var dragEndEvent = createDragEndEvent(rowReorderCell, true);
        (0, internal_test_utils_1.fireEvent)(rowReorderCell, dragEndEvent);
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    });
    it('should keep the order of the rows when dragStart is fired and rowReordering=false', function () {
        var rows = [
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
        ];
        var columns = [{ field: 'brand' }];
        function Test() {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns}/>
        </div>);
        }
        render(<Test />);
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        var rowReorderCell = (0, helperFn_1.getCell)(0, 0);
        internal_test_utils_1.fireEvent.dragStart(rowReorderCell);
        expect(rowReorderCell).not.to.have.class(x_data_grid_pro_1.gridClasses['row--dragging']);
    });
    it('should keep the order of the rows when dragEnd is fired and rowReordering=false', function () {
        var rows = [
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
        ];
        var columns = [{ field: 'brand' }];
        function Test() {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns}/>
        </div>);
        }
        render(<Test />);
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        var rowReorderCell = (0, helperFn_1.getCell)(0, 0).firstChild;
        var dragEndEvent = createDragEndEvent(rowReorderCell, true);
        (0, internal_test_utils_1.fireEvent)(rowReorderCell, dragEndEvent);
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    });
    it('should call onRowOrderChange after the row stops being dragged', function () {
        var handleOnRowOrderChange = (0, sinon_1.spy)();
        function Test() {
            var rows = [
                { id: 0, brand: 'Nike' },
                { id: 1, brand: 'Adidas' },
                { id: 2, brand: 'Puma' },
            ];
            var columns = [{ field: 'brand' }];
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} onRowOrderChange={handleOnRowOrderChange} rowReordering/>
        </div>);
        }
        render(<Test />);
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        var rowReorderCell = (0, helperFn_1.getCell)(0, 0).firstChild;
        var targetCell = (0, helperFn_1.getCell)(2, 0);
        internal_test_utils_1.fireEvent.dragStart(rowReorderCell);
        internal_test_utils_1.fireEvent.dragEnter(targetCell);
        var dragOverEvent = createDragOverEvent(targetCell);
        (0, internal_test_utils_1.fireEvent)(targetCell, dragOverEvent);
        expect(handleOnRowOrderChange.callCount).to.equal(0);
        var dragEndEvent = createDragEndEvent(rowReorderCell);
        (0, internal_test_utils_1.fireEvent)(rowReorderCell, dragEndEvent);
        expect(handleOnRowOrderChange.callCount).to.equal(1);
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    });
    it('should prevent drag events propagation', function () {
        var handleDragStart = (0, sinon_1.spy)();
        var handleDragEnter = (0, sinon_1.spy)();
        var handleDragOver = (0, sinon_1.spy)();
        var handleDragEnd = (0, sinon_1.spy)();
        function Test() {
            var data = (0, x_data_grid_generator_1.useBasicDemoData)(3, 3);
            return (<div draggable onDragStart={handleDragStart} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragEnd={handleDragEnd} style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...data} rowReordering/>
        </div>);
        }
        render(<Test />);
        var rowReorderCell = (0, helperFn_1.getCell)(0, 0).firstChild;
        var targetrowReorderCell = (0, helperFn_1.getCell)(1, 0);
        internal_test_utils_1.fireEvent.dragStart(rowReorderCell);
        internal_test_utils_1.fireEvent.dragEnter(targetrowReorderCell);
        var dragOverRowEvent = createDragOverEvent(targetrowReorderCell);
        (0, internal_test_utils_1.fireEvent)(targetrowReorderCell, dragOverRowEvent);
        var dragEndRowEvent = createDragEndEvent(rowReorderCell);
        (0, internal_test_utils_1.fireEvent)(rowReorderCell, dragEndRowEvent);
        expect(handleDragStart.callCount).to.equal(0);
        expect(handleDragOver.callCount).to.equal(0);
        expect(handleDragEnd.callCount).to.equal(0);
    });
    it('should reorder rows correctly on any page when pagination is enabled', function () {
        var rows = [
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
            { id: 3, brand: 'Skechers' },
            { id: 4, brand: 'Vans' },
            { id: 5, brand: 'Converse' },
        ];
        var columns = [{ field: 'brand' }];
        function Test() {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} rowReordering pagination initialState={{
                    pagination: {
                        paginationModel: { pageSize: 3 },
                    },
                }} pageSizeOptions={[3]}/>
        </div>);
        }
        render(<Test />);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['3', '4', '5']);
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Skechers', 'Vans', 'Converse']);
        var rowReorderCell = (0, helperFn_1.getCell)(3, 0).firstChild;
        var targetCell = (0, helperFn_1.getCell)(5, 0);
        // Start the drag
        internal_test_utils_1.fireEvent.dragStart(rowReorderCell);
        internal_test_utils_1.fireEvent.dragEnter(targetCell);
        var sourceRow = rowReorderCell.closest('[data-id]');
        expect(sourceRow).to.have.class(x_data_grid_pro_1.gridClasses['row--beingDragged']);
        // Hover over the target row to render a drop indicator
        var dragOverEvent = createDragOverEvent(targetCell);
        (0, internal_test_utils_1.fireEvent)(targetCell, dragOverEvent);
        var targetRow = targetCell.closest('[data-id]');
        expect(targetRow).to.have.class(x_data_grid_pro_1.gridClasses['row--dropAbove']);
        // End the drag to update the row order
        var dragEndEvent = createDragEndEvent(rowReorderCell);
        (0, internal_test_utils_1.fireEvent)(rowReorderCell, dragEndEvent);
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Vans', 'Skechers', 'Converse']);
    });
    it('should render vertical scroll areas when row reordering is active', function () {
        // Create more rows to ensure scrolling is needed
        var rows = Array.from({ length: 20 }, function (_, i) { return ({
            id: i,
            brand: "Brand ".concat(i),
        }); });
        var columns = [{ field: 'brand' }];
        function Test() {
            return (<div style={{ width: 300, height: 200 }}>
          {/* Smaller height to force scrolling */}
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} rowReordering/>
        </div>);
        }
        var container = render(<Test />).container;
        // Initially, no scroll areas should be visible
        expect(container.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses.scrollArea))).to.have.length(0);
        // Start dragging a row at the top (scroll = 0)
        var rowReorderCell = (0, helperFn_1.getCell)(0, 0).firstChild;
        internal_test_utils_1.fireEvent.dragStart(rowReorderCell);
        // Check what scroll areas are rendered when at the top
        var allScrollAreas = container.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses.scrollArea));
        var upScrollAreas = container.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses['scrollArea--up']));
        var downScrollAreas = container.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses['scrollArea--down']));
        // At the top: only down scroll area should be rendered (up should NOT exist)
        expect(allScrollAreas.length).to.equal(1);
        expect(upScrollAreas).to.have.length(0); // No up scroll area when at top
        expect(downScrollAreas).to.have.length(1); // Down scroll area available
        // End dragging to reset state
        var dragEndEvent = createDragEndEvent(rowReorderCell);
        (0, internal_test_utils_1.fireEvent)(rowReorderCell, dragEndEvent);
        // Scroll areas should be hidden again
        expect(container.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses.scrollArea))).to.have.length(0);
        // Now scroll down to enable both up and down scrolling
        var virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller');
        internal_test_utils_1.fireEvent.scroll(virtualScroller, { target: { scrollTop: 100 } });
        // Start dragging again after scrolling down
        internal_test_utils_1.fireEvent.dragStart(rowReorderCell);
        // Check scroll areas after scrolling down
        allScrollAreas = container.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses.scrollArea));
        upScrollAreas = container.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses['scrollArea--up']));
        downScrollAreas = container.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses['scrollArea--down']));
        // After scrolling down: both up and down scroll areas should be rendered
        expect(allScrollAreas.length).to.equal(2);
        expect(upScrollAreas).to.have.length(1); // Up scroll area now available
        expect(downScrollAreas).to.have.length(1); // Down scroll area still available
        // End dragging
        dragEndEvent = createDragEndEvent(rowReorderCell);
        (0, internal_test_utils_1.fireEvent)(rowReorderCell, dragEndEvent);
        // Scroll areas should be hidden again
        expect(container.querySelectorAll(".".concat(x_data_grid_pro_1.gridClasses.scrollArea))).to.have.length(0);
    });
    it('should allow row reordering when dragging from any cell during active reorder', function () {
        var rows = [
            { id: 0, brand: 'Nike', category: 'Sportswear' },
            { id: 1, brand: 'Adidas', category: 'Sportswear' },
            { id: 2, brand: 'Puma', category: 'Sportswear' },
        ];
        var columns = [
            { field: 'brand', width: 150 },
            { field: 'category', width: 150 },
        ];
        function Test() {
            return (<div style={{ width: 400, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} rowReordering disableColumnReorder/>
        </div>);
        }
        render(<Test />);
        // Verify initial row order
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        // Start drag from the reorder cell (column 0, row 0)
        var rowReorderCell = (0, helperFn_1.getCell)(0, 0).firstChild;
        internal_test_utils_1.fireEvent.dragStart(rowReorderCell);
        // Verify that the reorder cell has the dragging class (this happens immediately)
        expect(rowReorderCell).to.have.class(x_data_grid_pro_1.gridClasses['row--dragging']);
        // Now drag over a non-reorder cell (brand cell of row 2)
        var targetNonReorderCell = (0, helperFn_1.getCell)(2, 1); // brand cell of the third row
        internal_test_utils_1.fireEvent.dragEnter(targetNonReorderCell);
        // Hover over the target cell to render a drop indicator
        var dragOverEvent = createDragOverEvent(targetNonReorderCell);
        (0, internal_test_utils_1.fireEvent)(targetNonReorderCell, dragOverEvent);
        // Verify that the target row shows the drop indicator
        var targetRow = targetNonReorderCell.closest('[data-id]');
        expect(targetRow).to.have.class(x_data_grid_pro_1.gridClasses['row--dropAbove']);
        // End the drag to complete the row reorder
        var dragEndEvent = createDragEndEvent(rowReorderCell);
        (0, internal_test_utils_1.fireEvent)(rowReorderCell, dragEndEvent);
        // Verify that the row order has changed (Nike should now be between Adidas and Puma)
        expect((0, helperFn_1.getRowsFieldContent)('brand')).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    });
});
