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
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
var rows = [{ id: 1, idBis: 1 }];
var columns = [{ field: 'id' }, { field: 'idBis' }];
describe('<DataGrid /> - Columns', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function TestDataGrid(props) {
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid columns={columns} rows={rows} {...props} autoHeight={skipIf_1.isJSDOM}/>
      </div>);
    }
    describe('prop: initialState.columns.orderedFields / initialState.columns.dimensions', function () {
        it('should allow to initialize the columns order and dimensions', function () {
            render(<TestDataGrid initialState={{
                    columns: { orderedFields: ['idBis', 'id'], dimensions: { idBis: { width: 150 } } },
                }}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['idBis', 'id']);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '150px' });
        });
        it('should not add a column when present in the initial state but not in the props', function () {
            render(<TestDataGrid initialState={{ columns: { orderedFields: ['idTres'] } }}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
        });
        it('should move the columns not present in the initial state after the one present in it', function () {
            render(<TestDataGrid initialState={{ columns: { orderedFields: ['idBis'] } }}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['idBis', 'id']);
        });
        it('should allow to remove the sizing properties by setting them to `undefined`', function () {
            render(<TestDataGrid columns={[{ field: 'id', flex: 1 }]} initialState={{ columns: { dimensions: { id: { flex: undefined } } } }}/>);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '100px' });
        });
    });
    it('should allow to change the column type', function () {
        var setProps = render(<TestDataGrid columns={[{ field: 'id', type: 'string' }, { field: 'idBis' }]}/>).setProps;
        expect((0, helperFn_1.getColumnHeaderCell)(0)).not.to.have.class('MuiDataGrid-columnHeader--numeric');
        setProps({ columns: [{ field: 'id', type: 'number' }, { field: 'idBis' }] });
        expect((0, helperFn_1.getColumnHeaderCell)(0)).to.have.class('MuiDataGrid-columnHeader--numeric');
    });
    it('should not persist valueFormatter on column type change', function () {
        var setProps = render(<TestDataGrid columns={[{ field: 'price', type: 'number', valueFormatter: function (value) { return "$".concat(value); } }]} rows={[{ id: 0, price: 1 }]}/>).setProps;
        expect((0, helperFn_1.getCell)(0, 0).textContent).to.equal('$1');
        setProps({ columns: [{ field: 'price' }] });
        expect((0, helperFn_1.getCell)(0, 0).textContent).to.equal('1');
    });
    it('should not override column properties when changing column type', function () {
        var setProps = render(<TestDataGrid columns={[
                {
                    field: 'id',
                    type: 'string',
                    width: 200,
                    valueFormatter: function (value) {
                        return "formatted: ".concat(value);
                    },
                },
                { field: 'idBis' },
            ]}/>).setProps;
        expect((0, helperFn_1.getColumnHeaderCell)(0)).not.to.have.class('MuiDataGrid-columnHeader--numeric');
        expect((0, helperFn_1.getCell)(0, 0).textContent).to.equal('formatted: 1');
        setProps({
            columns: [
                {
                    field: 'id',
                    type: 'number',
                    width: 200,
                    valueFormatter: function (value) {
                        return "formatted: ".concat(value);
                    },
                },
                { field: 'idBis' },
            ],
        });
        expect((0, helperFn_1.getColumnHeaderCell)(0)).to.have.class('MuiDataGrid-columnHeader--numeric');
        // should not override valueFormatter with the default numeric one
        expect((0, helperFn_1.getCell)(0, 0).textContent).to.equal('formatted: 1');
    });
    // https://github.com/mui/mui-x/issues/13719
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should not crash when updating columns immediately after scrolling', function () { return __awaiter(void 0, void 0, void 0, function () {
        function DynamicVirtualizationRange() {
            var _a = React.useState([{ field: 'id' }, { field: 'value' }]), cols = _a[0], setCols = _a[1];
            return (<div style={{ width: '100%' }}>
            <button onClick={function () { return setCols([{ field: 'id' }]); }}>Update columns</button>
            <div style={{ height: 400 }}>
              <x_data_grid_1.DataGrid rows={data} columns={cols}/>
            </div>
          </div>);
        }
        var data, user, virtualScroller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = [
                        { id: 1, value: 'A' },
                        { id: 2, value: 'B' },
                        { id: 3, value: 'C' },
                        { id: 4, value: 'D' },
                        { id: 5, value: 'E' },
                        { id: 6, value: 'E' },
                        { id: 7, value: 'F' },
                        { id: 8, value: 'G' },
                        { id: 9, value: 'H' },
                    ];
                    user = render(<DynamicVirtualizationRange />).user;
                    virtualScroller = document.querySelector(".".concat(x_data_grid_1.gridClasses.virtualScroller));
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, virtualScroller.scrollTo({ top: 1000, behavior: 'instant' })];
                        }); }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('Update columns'))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should revert to the default column properties if not specified otherwise', function () { return __awaiter(void 0, void 0, void 0, function () {
        function Component(props) {
            return (<div style={{ height: 560, width: '100%' }}>
          <x_data_grid_1.DataGrid apiRef={apiRef} rows={[{ id: 1, status: 'pending' }]} {...props}/>
        </div>);
        }
        var columns1, columns2, apiRef, setProps;
        return __generator(this, function (_a) {
            columns1 = [{ field: 'status', type: 'string' }];
            columns2 = [
                { field: 'status', type: 'string', sortable: false, filterable: false },
            ];
            apiRef = { current: null };
            setProps = render(<Component columns={columns1}/>).setProps;
            expect((0, x_data_grid_1.gridColumnLookupSelector)(apiRef).status).to.deep.include({
                sortable: true,
                filterable: true,
            });
            setProps({ columns: columns2 });
            expect((0, x_data_grid_1.gridColumnLookupSelector)(apiRef).status).to.deep.include({
                sortable: false,
                filterable: false,
            });
            setProps({ columns: columns1 });
            expect((0, x_data_grid_1.gridColumnLookupSelector)(apiRef).status).to.deep.include({
                sortable: true,
                filterable: true,
            });
            return [2 /*return*/];
        });
    }); });
});
