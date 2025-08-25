"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
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
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} initialState={{ density: 'compact' }} showToolbar rowHeight={rowHeight}/>
        </div>);
            expectHeight(rowHeight * densitySelector_1.COMPACT_DENSITY_FACTOR);
        });
    });
    describe('prop: `density`', function () {
        it('should set the density value using density prop', function () {
            var rowHeight = 30;
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} density="compact" rowHeight={rowHeight}/>
        </div>);
            expectHeight(rowHeight * densitySelector_1.COMPACT_DENSITY_FACTOR);
        });
        it('should allow to control the density from the prop using state', function () {
            var rowHeight = 30;
            function Grid(props) {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} showToolbar slots={{ toolbar: x_data_grid_1.GridToolbar }} {...props}/>
          </div>);
            }
            var setProps = render(<Grid rowHeight={rowHeight} density="standard"/>).setProps;
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
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} slots={{
                        toolbar: x_data_grid_1.GridToolbar,
                    }} showToolbar onDensityChange={onDensityChange}/>
          </div>);
            }
            render(<Test />);
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
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} showToolbar slots={{ toolbar: x_data_grid_1.GridToolbar }} rowHeight={rowHeight}/>
        </div>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Density'));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Compact'));
            expectHeight(rowHeight * densitySelector_1.COMPACT_DENSITY_FACTOR);
        });
        it('should decrease grid density when selecting comfortable density', function () {
            var rowHeight = 30;
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} showToolbar slots={{ toolbar: x_data_grid_1.GridToolbar }} rowHeight={rowHeight}/>
        </div>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Density'));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Comfortable'));
            expectHeight(rowHeight * densitySelector_1.COMFORTABLE_DENSITY_FACTOR);
        });
        it('should increase grid density even if toolbar is not enabled', function () {
            var rowHeight = 30;
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} rowHeight={rowHeight} density="compact"/>
        </div>);
            expectHeight(rowHeight * densitySelector_1.COMPACT_DENSITY_FACTOR);
        });
        it('should decrease grid density even if toolbar is not enabled', function () {
            var rowHeight = 30;
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} rowHeight={rowHeight} density="comfortable"/>
        </div>);
            expectHeight(rowHeight * densitySelector_1.COMFORTABLE_DENSITY_FACTOR);
        });
        it('should apply to the root element a class corresponding to the current density', function () {
            function Test(props) {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...baselineProps} {...props}/>
          </div>);
            }
            var setProps = render(<Test />).setProps;
            expect((0, helperFn_1.grid)('root')).to.have.class(x_data_grid_1.gridClasses['root--densityStandard']);
            setProps({ density: 'compact' });
            expect((0, helperFn_1.grid)('root')).to.have.class(x_data_grid_1.gridClasses['root--densityCompact']);
            setProps({ density: 'comfortable' });
            expect((0, helperFn_1.grid)('root')).to.have.class(x_data_grid_1.gridClasses['root--densityComfortable']);
        });
    });
});
