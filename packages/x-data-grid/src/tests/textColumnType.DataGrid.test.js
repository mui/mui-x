"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGrid /> - Text Column Type', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var rows = [
        { id: 1, description: 'Short text' },
        { id: 2, description: 'This is a longer text\nthat has multiple lines\nand should be editable' },
    ];
    var columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'description', headerName: 'Description', type: 'text', width: 300, editable: true },
    ];
    it('should render a column with type text', function () {
        render((0, jsx_runtime_1.jsx)("div", { style: { width: 400, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: rows, columns: columns, autoHeight: skipIf_1.isJSDOM }) }));
        expect((0, helperFn_1.getCell)(0, 1).textContent).to.equal('Short text');
        expect((0, helperFn_1.getCell)(1, 1).textContent).to.contain('This is a longer text');
    });
    it('should render text type column as editable when editable prop is true', function () {
        render((0, jsx_runtime_1.jsx)("div", { style: { width: 400, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { rows: rows, columns: columns, autoHeight: skipIf_1.isJSDOM }) }));
        var cell = (0, helperFn_1.getCell)(0, 1);
        expect(cell).not.to.equal(null);
    });
});
