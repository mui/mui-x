"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGrid /> - Slots', function () {
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
        columns: [{ field: 'brand' }],
    };
    describe('footer', function () {
        it('should hide footer if prop hideFooter is set', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} hideFooter/>
        </div>);
            expect(document.querySelectorAll('.MuiDataGrid-footerContainer').length).to.equal(0);
        });
        it('should hide custom footer if prop hideFooter is set', function () {
            function CustomFooter() {
                return <div className="customFooter">Custom Footer</div>;
            }
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} hideFooter slots={{ footer: CustomFooter }}/>
        </div>);
            expect(document.querySelectorAll('.customFooter').length).to.equal(0);
        });
    });
    describe('slotProps', function () {
        it('should pass the props from slotProps.cell to the cell', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} hideFooter disableVirtualization slotProps={{ cell: { 'data-name': 'foobar' } }}/>
        </div>);
            expect((0, helperFn_1.getCell)(0, 0)).to.have.attr('data-name', 'foobar');
        });
        it('should not override cell dimensions when passing `slotProps.cell.style` to the cell', function () {
            function Test(props) {
                return (<div style={{ width: 300, height: 500 }}>
            <x_data_grid_1.DataGrid {...baselineProps} {...props}/>
          </div>);
            }
            var setProps = render(<Test slotProps={{ cell: {} }}/>).setProps;
            var initialCellWidth = (0, helperFn_1.getCell)(0, 0).getBoundingClientRect().width;
            setProps({ slotProps: { cell: { style: { backgroundColor: 'red' } } } });
            var cell = (0, helperFn_1.getCell)(0, 0);
            expect(cell).toHaveInlineStyle({ backgroundColor: 'red' });
            expect(cell.getBoundingClientRect().width).to.equal(initialCellWidth);
        });
        it('should pass the props from slotProps.row to the row', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} hideFooter disableVirtualization slotProps={{ row: { 'data-name': 'foobar' } }}/>
        </div>);
            expect((0, helperFn_1.getRow)(0)).to.have.attr('data-name', 'foobar');
        });
        it('should pass the props from slotProps.columnHeaderFilterIconButton to the column header filter icon', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onClick, user, button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onClick = (0, sinon_1.spy)();
                        user = render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} hideFooter filterModel={{
                                items: [{ field: 'brand', operator: 'contains', value: 'a' }],
                            }} disableVirtualization slotProps={{ columnHeaderFilterIconButton: { onClick: onClick } }}/>
        </div>).user;
                        expect(onClick.callCount).to.equal(0);
                        button = internal_test_utils_1.screen.getByLabelText('Show filters');
                        return [4 /*yield*/, user.click(button)];
                    case 1:
                        _a.sent();
                        expect(onClick.lastCall.args[0]).to.have.property('field', 'brand');
                        expect(onClick.lastCall.args[1]).to.have.property('target', button);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('slots', function () {
        it('should render the cell with the component given in slots.Cell', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} hideFooter disableVirtualization slots={{
                    cell: function (_a) {
                        var colIndex = _a.colIndex;
                        return <span role="gridcell" data-colindex={colIndex}/>;
                    },
                }}/>
        </div>);
            expect((0, helperFn_1.getCell)(0, 0).tagName).to.equal('SPAN');
        });
        it('should render the row with the component given in slots.Row', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} hideFooter disableVirtualization slots={{ row: function (_a) {
                    var index = _a.index;
                    return <span role="row" data-rowindex={index}/>;
                } }}/>
        </div>);
            expect((0, helperFn_1.getRow)(0).tagName).to.equal('SPAN');
        });
    });
    // can't catch render errors in the browser for unknown reason
    // tried try-catch + error boundary + window onError preventDefault
    it.skipIf(!skipIf_1.isJSDOM)('should throw if a component is used without providing the context', function () {
        expect(function () {
            render(<internal_test_utils_1.ErrorBoundary>
          <x_data_grid_1.GridOverlay />
        </internal_test_utils_1.ErrorBoundary>);
        }).toErrorDev([
            'MUI X: useGridRootProps should only be used inside the DataGrid, DataGridPro or DataGridPremium component.',
            internal_test_utils_1.reactMajor < 19 &&
                'MUI X: useGridRootProps should only be used inside the DataGrid, DataGridPro or DataGridPremium component.',
            internal_test_utils_1.reactMajor < 19 && 'The above error occurred in the <ForwardRef(GridOverlay2)> component',
        ]);
    });
    // If an infinite loop occurs, this test won't trigger the timeout.
    // Instead, it will be hanging and block other tests.
    // See https://github.com/mochajs/mocha/issues/1609
    it('should not cause an infinite loop with two instances in the same page', function () {
        expect(function () {
            render(<div>
          <div style={{ width: 300, height: 500 }}>
            <x_data_grid_1.DataGrid {...baselineProps} hideFooter/>
          </div>
          <div style={{ width: 300, height: 500 }}>
            <x_data_grid_1.DataGrid {...baselineProps} hideFooter/>
          </div>
        </div>);
        }).not.toErrorDev();
    });
});
