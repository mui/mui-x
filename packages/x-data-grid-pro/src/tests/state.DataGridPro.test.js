"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
describe('<DataGridPro /> - State', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
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
            {
                id: 2,
                brand: 'Puma',
            },
        ],
        columns: [{ field: 'brand', width: 100 }],
    };
    it('should trigger on state change and pass the correct params', function () {
        var _a;
        var onStateParams;
        var apiRef;
        function Test() {
            apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            var onStateChange = function (params) {
                onStateParams = params;
            };
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} onStateChange={onStateChange} apiRef={apiRef}/>
        </div>);
        }
        render(<Test />);
        var header = internal_test_utils_1.screen.getByRole('columnheader', { name: 'brand' });
        internal_test_utils_1.fireEvent.click(header);
        expect(onStateParams).to.equal((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state);
        expect(onStateParams).not.to.equal(undefined);
    });
    it('should allow to control the state using apiRef', function () {
        function GridStateTest() {
            var apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
            React.useEffect(function () {
                var _a, _b;
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setState(function (prev) { return (__assign(__assign({}, prev), { sorting: __assign(__assign({}, prev.sorting), { sortModel: [{ field: 'brand', sort: 'asc' }] }) })); });
                (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.applySorting();
            }, [apiRef]);
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} apiRef={apiRef}/>
        </div>);
        }
        render(<GridStateTest />);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    });
});
