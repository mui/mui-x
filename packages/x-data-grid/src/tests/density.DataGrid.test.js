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
var jsx_runtime_1 = require("react/jsx-runtime");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_1 = require("@mui/x-data-grid");
var skipIf_1 = require("test/utils/skipIf");
var densitySelector_1 = require("../hooks/features/density/densitySelector");
// JSDOM seem to not support CSS variables properly and `height: var(--height)` ends up being `height: ''`
describe.skipIf(skipIf_1.isJSDOM)('<DataGrid /> - Density', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: skipIf_1.isJSDOM,
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
        columns: [
            {
                field: 'id',
            },
            {
                field: 'brand',
            },
        ],
    };
    function expectHeight(value) {
        expect(internal_test_utils_1.screen.getAllByRole('row')[1]).toHaveInlineStyle({
            maxHeight: "".concat(Math.floor(value), "px"),
        });
        expect(getComputedStyle(internal_test_utils_1.screen.getAllByRole('gridcell')[1]).height).to.equal("".concat(Math.floor(value), "px"));
    }
    describe('prop: `initialState.density`', function () {
        it('should set the density to the value of initialState.density', function () {
            var rowHeight = 30;
            render((0, jsx_runtime_1.jsx)("div", { style: { width: 300, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, __assign({}, baselineProps, { initialState: { density: 'compact' }, showToolbar: true, rowHeight: rowHeight })) }));
            expectHeight(rowHeight * densitySelector_1.COMPACT_DENSITY_FACTOR);
        });
    });
    describe('prop: `density`', function () {
        it('should set the density value using density prop', function () {
            var rowHeight = 30;
            render((0, jsx_runtime_1.jsx)("div", { style: { width: 300, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, __assign({}, baselineProps, { density: "compact", rowHeight: rowHeight })) }));
            expectHeight(rowHeight * densitySelector_1.COMPACT_DENSITY_FACTOR);
        });
        it('should allow to control the density from the prop using state', function () {
            var rowHeight = 30;
            function Grid(props) {
                return ((0, jsx_runtime_1.jsx)("div", { style: { width: 300, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, __assign({}, baselineProps, { showToolbar: true, slots: { toolbar: x_data_grid_1.GridToolbar } }, props)) }));
            }
            var setProps = render((0, jsx_runtime_1.jsx)(Grid, { rowHeight: rowHeight, density: "standard" })).setProps;
            expectHeight(rowHeight);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Density'));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Compact'));
            // Not updated because of the controlled prop
            expectHeight(rowHeight);
            // Explicitly update the prop
            setProps({ density: 'compact' });
            expectHeight(rowHeight * densitySelector_1.COMPACT_DENSITY_FACTOR);
        });
        // TODO: Remove when we remove the legacy GridToolbar
        it('should call `onDensityChange` prop when density gets updated', function () {
            var onDensityChange = (0, sinon_1.spy)();
            function Test() {
                return ((0, jsx_runtime_1.jsx)("div", { style: { width: 300, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, __assign({}, baselineProps, { slots: {
                            toolbar: x_data_grid_1.GridToolbar,
                        }, showToolbar: true, onDensityChange: onDensityChange })) }));
            }
            render((0, jsx_runtime_1.jsx)(Test, {}));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Density'));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Comfortable'));
            expect(onDensityChange.callCount).to.equal(1);
            expect(onDensityChange.firstCall.args[0]).to.equal('comfortable');
        });
    });
    // TODO: Remove when we remove the legacy GridToolbar
    describe('density selection menu', function () {
        it('should increase grid density when selecting compact density', function () {
            var rowHeight = 30;
            render((0, jsx_runtime_1.jsx)("div", { style: { width: 300, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, __assign({}, baselineProps, { showToolbar: true, slots: { toolbar: x_data_grid_1.GridToolbar }, rowHeight: rowHeight })) }));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Density'));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Compact'));
            expectHeight(rowHeight * densitySelector_1.COMPACT_DENSITY_FACTOR);
        });
        it('should decrease grid density when selecting comfortable density', function () {
            var rowHeight = 30;
            render((0, jsx_runtime_1.jsx)("div", { style: { width: 300, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, __assign({}, baselineProps, { showToolbar: true, slots: { toolbar: x_data_grid_1.GridToolbar }, rowHeight: rowHeight })) }));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Density'));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Comfortable'));
            expectHeight(rowHeight * densitySelector_1.COMFORTABLE_DENSITY_FACTOR);
        });
        it('should increase grid density even if toolbar is not enabled', function () {
            var rowHeight = 30;
            render((0, jsx_runtime_1.jsx)("div", { style: { width: 300, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, __assign({}, baselineProps, { rowHeight: rowHeight, density: "compact" })) }));
            expectHeight(rowHeight * densitySelector_1.COMPACT_DENSITY_FACTOR);
        });
        it('should decrease grid density even if toolbar is not enabled', function () {
            var rowHeight = 30;
            render((0, jsx_runtime_1.jsx)("div", { style: { width: 300, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, __assign({}, baselineProps, { rowHeight: rowHeight, density: "comfortable" })) }));
            expectHeight(rowHeight * densitySelector_1.COMFORTABLE_DENSITY_FACTOR);
        });
        it('should apply to the root element a class corresponding to the current density', function () {
            function Test(props) {
                return ((0, jsx_runtime_1.jsx)("div", { style: { width: 300, height: 300 }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, __assign({}, baselineProps, props)) }));
            }
            var setProps = render((0, jsx_runtime_1.jsx)(Test, {})).setProps;
            expect((0, helperFn_1.grid)('root')).to.have.class(x_data_grid_1.gridClasses['root--densityStandard']);
            setProps({ density: 'compact' });
            expect((0, helperFn_1.grid)('root')).to.have.class(x_data_grid_1.gridClasses['root--densityCompact']);
            setProps({ density: 'comfortable' });
            expect((0, helperFn_1.grid)('root')).to.have.class(x_data_grid_1.gridClasses['root--densityComfortable']);
        });
    });
});
