"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
describe('<DataGrid /> - Filter panel', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: isJSDOM,
        disableVirtualization: true,
        rows: [],
        columns: [{ field: 'brand' }],
    };
    var apiRef;
    function TestCase(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...baselineProps} {...props}/>
      </div>);
    }
    it('should add an id and `operator` to the filter item created when opening the filter panel', function () {
        render(<TestCase />);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showFilterPanel('brand'); });
        var model = (0, x_data_grid_pro_1.gridFilterModelSelector)(apiRef);
        expect(model.items).to.have.length(1);
        expect(model.items[0].id).not.to.equal(null);
        expect(model.items[0].operator).not.to.equal(null);
    });
});
