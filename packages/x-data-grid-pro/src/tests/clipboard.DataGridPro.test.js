"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var helperFn_1 = require("test/utils/helperFn");
var fireUserEvent_1 = require("test/utils/fireUserEvent");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
describe('<DataGridPro /> - Clipboard', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: isJSDOM,
    };
    var columns = [{ field: 'id' }, { field: 'brand', headerName: 'Brand' }];
    var apiRef;
    function Test(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro {...baselineProps} apiRef={apiRef} columns={columns} rows={[
                { id: 0, brand: 'Nike' },
                { id: 1, brand: 'Adidas' },
                { id: 2, brand: 'Puma' },
            ]} {...props}/>
      </div>);
    }
    describe('copy to clipboard', function () {
        var writeText;
        afterEach(function afterEachHook() {
            writeText === null || writeText === void 0 ? void 0 : writeText.restore();
        });
        ['ctrlKey', 'metaKey'].forEach(function (key) {
            it("should copy the selected rows to the clipboard when ".concat(key, " + C is pressed"), function () {
                var _a;
                render(<Test disableRowSelectionOnClick/>);
                writeText = (0, sinon_1.spy)(navigator.clipboard, 'writeText');
                (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRows([0, 1]); });
                var cell = (0, helperFn_1.getCell)(0, 0);
                fireUserEvent_1.fireUserEvent.mousePress(cell);
                internal_test_utils_1.fireEvent.keyDown(cell, (_a = { key: 'c', keyCode: 67 }, _a[key] = true, _a));
                expect(writeText.firstCall.args[0]).to.equal(['0\tNike', '1\tAdidas'].join('\r\n'));
            });
        });
        it('should not escape double quotes when copying a single cell to clipboard', function () {
            render(<Test columns={[{ field: 'value' }]} rows={[{ id: 0, value: '1 " 1' }]} disableRowSelectionOnClick/>);
            writeText = (0, sinon_1.spy)(navigator.clipboard, 'writeText');
            var cell = (0, helperFn_1.getCell)(0, 0);
            cell.focus();
            fireUserEvent_1.fireUserEvent.mousePress(cell);
            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
            expect(writeText.lastCall.firstArg).to.equal('1 " 1');
        });
        it('should not escape double quotes when copying rows to clipboard', function () {
            render(<Test columns={[{ field: 'value' }]} rows={[
                    { id: 0, value: '1 " 1' },
                    { id: 1, value: '2' },
                ]} disableRowSelectionOnClick/>);
            writeText = (0, sinon_1.spy)(navigator.clipboard, 'writeText');
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRows([0, 1]); });
            var cell = (0, helperFn_1.getCell)(0, 0);
            fireUserEvent_1.fireUserEvent.mousePress(cell);
            internal_test_utils_1.fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
            expect(writeText.firstCall.args[0]).to.equal(['1 " 1', '2'].join('\r\n'));
        });
    });
});
