"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_test_utils_1 = require("@mui/internal-test-utils");
var React = require("react");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
var rows = [
    { id: 0, category1: 'Cat A', category2: 'Cat 1' },
    { id: 1, category1: 'Cat A', category2: 'Cat 2' },
    { id: 2, category1: 'Cat A', category2: 'Cat 2' },
    { id: 3, category1: 'Cat B', category2: 'Cat 2' },
    { id: 4, category1: 'Cat B', category2: 'Cat 1' },
];
var baselineProps = {
    autoHeight: isJSDOM,
    disableVirtualization: true,
    rows: rows,
    columns: [
        {
            field: 'id',
            type: 'number',
        },
        {
            field: 'category1',
        },
        {
            field: 'category2',
        },
    ],
};
describe('<DataGridPremium /> - Row pinning', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function getRowById(id) {
        return document.querySelector("[data-id=\"".concat(id, "\"]"));
    }
    function getTopPinnedRowsContainer() {
        return document.querySelector(".".concat(x_data_grid_premium_1.gridClasses['pinnedRows--top']));
    }
    function getBottomPinnedRowsContainer() {
        return document.querySelector(".".concat(x_data_grid_premium_1.gridClasses['pinnedRows--bottom']));
    }
    function isRowPinned(row, section) {
        var container = section === 'top' ? getTopPinnedRowsContainer() : getBottomPinnedRowsContainer();
        if (!row || !container) {
            return false;
        }
        return container.contains(row);
    }
    it('should render pinned rows outside of row groups', function () {
        function Test() {
            var pinnedRow0 = rows[0], pinnedRow1 = rows[1], rowsData = rows.slice(2);
            return (<div style={{ width: 300, height: 400 }}>
          <x_data_grid_premium_1.DataGridPremium {...baselineProps} rows={rowsData} initialState={{ rowGrouping: { model: ['category1'] } }} pinnedRows={{
                    top: [pinnedRow0],
                    bottom: [pinnedRow1],
                }}/>
        </div>);
        }
        render(<Test />);
        expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
        expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    });
});
