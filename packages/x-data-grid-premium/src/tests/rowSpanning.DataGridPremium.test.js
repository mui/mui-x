"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPremium /> - Row spanning', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        rowSpanning: true,
        columns: [
            {
                field: 'code',
                headerName: 'Item Code',
                width: 85,
                cellClassName: function (_a) {
                    var row = _a.row;
                    return (row.summaryRow ? 'bold' : '');
                },
            },
            {
                field: 'description',
                headerName: 'Description',
                width: 170,
            },
            {
                field: 'quantity',
                headerName: 'Quantity',
                width: 80,
                // Do not span the values
                rowSpanValueGetter: function () { return null; },
                type: 'number',
            },
            {
                field: 'unitPrice',
                headerName: 'Unit Price',
                type: 'number',
                valueFormatter: function (value) { return (value ? "$".concat(value, ".00") : ''); },
            },
            {
                field: 'totalPrice',
                headerName: 'Total Price',
                type: 'number',
                valueGetter: function (value, row) { return value !== null && value !== void 0 ? value : row === null || row === void 0 ? void 0 : row.unitPrice; },
                valueFormatter: function (value) { return "$".concat(value, ".00"); },
            },
        ],
        rows: [
            {
                id: 1,
                code: 'A101',
                description: 'Wireless Mouse',
                quantity: 2,
                unitPrice: 50,
                totalPrice: 100,
            },
            {
                id: 2,
                code: 'A102',
                description: 'Mechanical Keyboard',
                quantity: 1,
                unitPrice: 75,
            },
            {
                id: 3,
                code: 'A103',
                description: 'USB Dock Station',
                quantity: 1,
                unitPrice: 400,
            },
            {
                id: 4,
                code: 'A104',
                description: 'Laptop',
                quantity: 1,
                unitPrice: 1800,
                totalPrice: 2050,
            },
            {
                id: 5,
                code: 'A104',
                description: '- 16GB RAM Upgrade',
                quantity: 1,
                unitPrice: 100,
                totalPrice: 2050,
            },
            {
                id: 6,
                code: 'A104',
                description: '- 512GB SSD Upgrade',
                quantity: 1,
                unitPrice: 150,
                totalPrice: 2050,
            },
            {
                id: 7,
                code: 'TOTAL',
                totalPrice: 2625,
                summaryRow: true,
            },
        ],
    };
    function TestDataGrid(props) {
        return (<div style={{ width: 500, height: 300 }}>
        <x_data_grid_premium_1.DataGridPremium {...baselineProps} {...props} disableVirtualization={skipIf_1.isJSDOM}/>
      </div>);
    }
    // See https://github.com/mui/mui-x/issues/14691
    it.skipIf(skipIf_1.isJSDOM)('should not throw when initializing an aggregation model', function () {
        expect(function () {
            return render(<TestDataGrid initialState={{
                    aggregation: {
                        model: {
                            quantity: 'sum',
                            unitPrice: 'sum',
                        },
                    },
                }}/>);
        }).not.toErrorDev();
    });
});
