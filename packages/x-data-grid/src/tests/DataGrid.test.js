"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
describe('<DataGrid />', function () {
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
    };
    it('should accept aria & data attributes props using `slotProps`', function () {
        var rootRef = React.createRef();
        render(<div style={{ width: 300, height: 500 }}>
        <x_data_grid_1.DataGrid {...baselineProps} ref={rootRef} columns={[{ field: 'brand' }]} slotProps={{
                main: {
                    'data-custom-id': 'grid-1',
                    'aria-label': 'Grid one',
                },
                root: {
                    'data-custom-id': 'root-1',
                    'aria-label': 'Root one',
                },
            }}/>
      </div>);
        expect(document.querySelector('[data-custom-id="root-1"]')).to.equal(rootRef.current);
        expect(document.querySelector('[aria-label="Root one"]')).to.equal(rootRef.current);
        var mainElement = document.querySelector('[role="grid"]');
        expect(document.querySelector('[data-custom-id="grid-1"]')).to.equal(mainElement);
        expect(document.querySelector('[aria-label="Grid one"]')).to.equal(mainElement);
    });
    it('should not fail when row have IDs match Object prototype keys (constructor, hasOwnProperty, etc)', function () {
        var rows = [
            { id: 'a', col1: 'Hello', col2: 'World' },
            { id: 'constructor', col1: 'DataGridPro', col2: 'is Awesome' },
            { id: 'hasOwnProperty', col1: 'MUI', col2: 'is Amazing' },
        ];
        var columns = [
            { field: 'col1', headerName: 'Column 1', width: 150 },
            { field: 'col2', headerName: 'Column 2', width: 150 },
        ];
        render(<div style={{ height: 300, width: '100%' }}>
        <x_data_grid_1.DataGrid rows={rows} columns={columns}/>
      </div>);
    });
    it('should not cause unexpected behavior when props are explictly set to undefined', function () {
        var rows = [
            { id: 'a', col1: 'Hello', col2: 'World' },
            { id: 'constructor', col1: 'DataGridPro', col2: 'is Awesome' },
            { id: 'hasOwnProperty', col1: 'MUI', col2: 'is Amazing' },
        ];
        var columns = [
            { field: 'col1', headerName: 'Column 1', width: 150 },
            { field: 'col2', headerName: 'Column 2', width: 150 },
        ];
        expect(function () {
            render(<div style={{ height: 300, width: 300 }}>
          <x_data_grid_1.DataGrid {...Object.keys(x_data_grid_1.DATA_GRID_PROPS_DEFAULT_VALUES).reduce(function (acc, key) {
                // @ts-ignore
                acc[key] = undefined;
                return acc;
            }, {})} rows={rows} columns={columns}/>
        </div>);
        }).not.toErrorDev();
    });
});
