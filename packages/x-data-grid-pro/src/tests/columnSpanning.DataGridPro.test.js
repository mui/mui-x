"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var helperFn_1 = require("test/utils/helperFn");
var fireUserEvent_1 = require("test/utils/fireUserEvent");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPro /> - Column spanning', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        rows: [
            {
                id: 0,
                brand: 'Nike',
                category: 'Shoes',
                price: '$120',
                rating: '4.5',
            },
            {
                id: 1,
                brand: 'Adidas',
                category: 'Shoes',
                price: '$100',
                rating: '4.5',
            },
            {
                id: 2,
                brand: 'Puma',
                category: 'Shoes',
                price: '$90',
                rating: '4.5',
            },
        ],
    };
    // Need layouting
    it.skipIf(skipIf_1.isJSDOM)('should not apply `colSpan` in pinned columns section if there is only one column there', function () {
        render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[
                { field: 'brand', colSpan: 2, width: 110 },
                { field: 'category' },
                { field: 'price' },
            ]} initialState={{ pinnedColumns: { left: ['brand'], right: [] } }}/>
        </div>);
        expect((0, helperFn_1.getCell)(0, 0).offsetWidth).to.equal(110);
        expect(function () { return (0, helperFn_1.getCell)(0, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 1); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 2); }).not.to.throw();
    });
    it('should apply `colSpan` inside pinned columns section', function () {
        render(<div style={{ width: 500, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[{ field: 'brand', colSpan: 2 }, { field: 'category' }, { field: 'price' }]} initialState={{ pinnedColumns: { left: ['brand', 'category'], right: [] } }}/>
      </div>);
        expect(function () { return (0, helperFn_1.getCell)(0, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 1); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(0, 2); }).not.to.throw();
    });
    describe('key navigation', function () {
        var columns = [
            { field: 'brand', colSpan: function (value, row) { return (row.brand === 'Nike' ? 2 : 1); } },
            { field: 'category', colSpan: function (value, row) { return (row.brand === 'Adidas' ? 2 : 1); } },
            { field: 'price', colSpan: function (value, row) { return (row.brand === 'Puma' ? 2 : 1); } },
            { field: 'rating' },
        ];
        it('should work after column reordering', function () {
            var apiRef;
            function Test() {
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                return (<div style={{ width: 500, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...baselineProps} columns={columns}/>
          </div>);
            }
            render(<Test />);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnIndex('price', 1); });
            fireUserEvent_1.fireUserEvent.mousePress((0, helperFn_1.getCell)(1, 1));
            internal_test_utils_1.fireEvent.keyDown((0, helperFn_1.getCell)(1, 1), { key: 'ArrowRight' });
            expect((0, helperFn_1.getActiveCell)()).to.equal('1-2');
        });
    });
    it('should recalculate cells after column reordering', function () {
        var apiRef;
        function Test() {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return (<div style={{ width: 500, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...baselineProps} columns={[
                    { field: 'brand', colSpan: function (value, row) { return (row.brand === 'Nike' ? 2 : 1); } },
                    { field: 'category', colSpan: function (value, row) { return (row.brand === 'Adidas' ? 2 : 1); } },
                    { field: 'price', colSpan: function (value, row) { return (row.brand === 'Puma' ? 2 : 1); } },
                    { field: 'rating' },
                ]} disableVirtualization={skipIf_1.isJSDOM}/>
        </div>);
        }
        render(<Test />);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnIndex('brand', 1); });
        // Nike row
        expect(function () { return (0, helperFn_1.getCell)(0, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 1); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 2); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(0, 3); }).not.to.throw();
        // Adidas row
        expect(function () { return (0, helperFn_1.getCell)(1, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(1, 1); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(1, 2); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(1, 3); }).not.to.throw();
        // Puma row
        expect(function () { return (0, helperFn_1.getCell)(2, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(2, 1); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(2, 2); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(2, 3); }).to.throw(/not found/);
    });
    // Need layouting
    it.skipIf(skipIf_1.isJSDOM)('should work with column resizing', function () {
        var columns = [{ field: 'brand', colSpan: 2 }, { field: 'category' }, { field: 'price' }];
        render(<div style={{ width: 500, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={columns}/>
      </div>);
        expect((0, helperFn_1.getColumnHeaderCell)(0).offsetWidth).to.equal(100);
        expect((0, helperFn_1.getColumnHeaderCell)(1).offsetWidth).to.equal(100);
        expect((0, helperFn_1.getCell)(0, 0).offsetWidth).to.equal(200);
        var separator = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
        internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
        internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 200, buttons: 1 });
        internal_test_utils_1.fireEvent.mouseUp(separator);
        expect((0, helperFn_1.getColumnHeaderCell)(0).offsetWidth).to.equal(200);
        expect((0, helperFn_1.getColumnHeaderCell)(1).offsetWidth).to.equal(100);
        expect((0, helperFn_1.getCell)(0, 0).offsetWidth).to.equal(300);
    });
    it('should apply `colSpan` correctly on GridApiRef setRows', function () {
        var columns = [
            { field: 'brand', colSpan: function (value, row) { return (row.brand === 'Nike' ? 2 : 1); } },
            { field: 'category', colSpan: function (value, row) { return (row.brand === 'Adidas' ? 2 : 1); } },
            { field: 'price', colSpan: function (value, row) { return (row.brand === 'Puma' ? 2 : 1); } },
            { field: 'rating' },
        ];
        var apiRef;
        function Test() {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            return (<div style={{ width: 500, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...baselineProps} columns={columns} disableVirtualization={skipIf_1.isJSDOM}/>
        </div>);
        }
        render(<Test />);
        (0, internal_test_utils_1.act)(function () {
            var _a;
            return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRows([
                {
                    id: 0,
                    brand: 'Adidas',
                    category: 'Shoes',
                    price: '$100',
                    rating: '4.5',
                },
                {
                    id: 1,
                    brand: 'Nike',
                    category: 'Shoes',
                    price: '$120',
                    rating: '4.5',
                },
                {
                    id: 2,
                    brand: 'Reebok',
                    category: 'Shoes',
                    price: '$90',
                    rating: '4.5',
                },
            ]);
        });
        // Adidas row
        expect(function () { return (0, helperFn_1.getCell)(0, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 1); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 2); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(0, 3); }).not.to.throw();
        // Nike row
        expect(function () { return (0, helperFn_1.getCell)(1, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(1, 1); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(1, 2); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(1, 3); }).not.to.throw();
        // Reebok row
        expect(function () { return (0, helperFn_1.getCell)(2, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(2, 1); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(2, 2); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(2, 3); }).not.to.throw();
    });
});
