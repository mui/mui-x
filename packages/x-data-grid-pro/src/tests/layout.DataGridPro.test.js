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
var styles_1 = require("@mui/material/styles");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var locales_1 = require("@mui/x-data-grid-pro/locales");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe.skipIf(skipIf_1.isJSDOM)('<DataGridPro /> - Layout', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
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
    // Adaptation of describeConformance()
    describe('MUI component API', function () {
        it("attaches the ref", function () {
            var _a;
            var ref = React.createRef();
            var container = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} ref={ref}/>
        </div>).container;
            expect(ref.current).to.be.instanceof(window.HTMLDivElement);
            expect(ref.current).to.equal((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild);
        });
        function randomStringValue() {
            return "r".concat(Math.random().toString(36).slice(2));
        }
        it('applies the className to the root component', function () {
            var _a, _b;
            var className = randomStringValue();
            var container = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} className={className}/>
        </div>).container;
            expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild).to.have.class(className);
            expect((_b = container.firstChild) === null || _b === void 0 ? void 0 : _b.firstChild).to.have.class('MuiDataGrid-root');
        });
        it('applies the style to the root component', function () {
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} style={{
                    mixBlendMode: 'darken',
                }}/>
        </div>);
            expect(document.querySelector('.MuiDataGrid-root')).toHaveInlineStyle({
                mixBlendMode: 'darken',
            });
        });
    });
    describe('columns width', function () {
        it('should resize flex: 1 column when changing column visibility to avoid exceeding grid width (apiRef setColumnVisibility method call)', function () {
            var apiRef;
            function TestCase(props) {
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 500 }}>
            <x_data_grid_pro_1.DataGridPro {...props} apiRef={apiRef}/>
          </div>);
            }
            render(<TestCase rows={[
                    {
                        id: 1,
                        first: 'Mike',
                        age: 11,
                    },
                    {
                        id: 2,
                        first: 'Jack',
                        age: 11,
                    },
                    {
                        id: 3,
                        first: 'Mike',
                        age: 20,
                    },
                ]} columns={[
                    { field: 'id', flex: 1 },
                    { field: 'first', width: 100 },
                    { field: 'age', width: 50 },
                ]} initialState={{
                    columns: {
                        columnVisibilityModel: {
                            age: false,
                        },
                    },
                }}/>);
            var firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
            expect(firstColumn).toHaveInlineStyle({
                width: '198px', // because of the 2px border
            });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setColumnVisibility('age', true); });
            firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
            expect(firstColumn).toHaveInlineStyle({
                width: '148px', // because of the 2px border
            });
        });
    });
    it('should work with `headerFilterHeight` prop', function () {
        render(<div style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
        <x_data_grid_pro_1.DataGridPro {...baselineProps} headerFilters columnHeaderHeight={20} headerFilterHeight={60} rowHeight={20}/>
      </div>);
        expect((0, helperFn_1.grid)('main').clientHeight).to.equal(baselineProps.rows.length * 20 + 20 + 60);
    });
    it('should support translations in the theme', function () {
        render(<styles_1.ThemeProvider theme={(0, styles_1.createTheme)({}, locales_1.ptBR)}>
        <div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps}/>
        </div>
      </styles_1.ThemeProvider>);
        expect(document.querySelector('[title="Ordenar"]')).not.to.equal(null);
    });
    it('should support the sx prop', function () {
        var theme = (0, styles_1.createTheme)({
            palette: {
                primary: {
                    main: 'rgb(0, 0, 255)',
                },
            },
        });
        render(<styles_1.ThemeProvider theme={theme}>
        <div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro columns={[]} rows={[]} sx={{ color: 'primary.main' }}/>
        </div>
      </styles_1.ThemeProvider>);
        expect((0, helperFn_1.grid)('root')).toHaveComputedStyle({
            color: 'rgb(0, 0, 255)',
        });
    });
    it('should have ownerState in the theme style overrides', function () {
        expect(function () {
            return render(<styles_1.ThemeProvider theme={(0, styles_1.createTheme)({
                    components: {
                        MuiDataGrid: {
                            styleOverrides: {
                                root: function (_a) {
                                    var ownerState = _a.ownerState;
                                    return (__assign({}, (ownerState.columns && {})));
                                },
                            },
                        },
                    },
                })}>
          <div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...baselineProps}/>
          </div>
        </styles_1.ThemeProvider>);
        }).not.to.throw();
    });
});
