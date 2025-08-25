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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var sinon_1 = require("sinon");
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
describe('<DataGridPremium /> - Row selection', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    describe('props: rowSelectionPropagation = { descendants: true, parents: true }', function () {
        var apiRef;
        function Test(props) {
            apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_premium_1.DataGridPremium {...baselineProps} checkboxSelection apiRef={apiRef} rowSelectionPropagation={{
                    descendants: true,
                    parents: true,
                }} initialState={{ rowGrouping: { model: ['category1'] } }} {...props}/>
        </div>);
        }
        it('should auto select parents when controlling row selection model', function () {
            var onRowSelectionModelChange = (0, sinon_1.spy)();
            render(<Test rowSelectionModel={(0, helperFn_1.includeRowSelection)([3, 4])} onRowSelectionModelChange={onRowSelectionModelChange}/>);
            expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([3, 4, 'auto-generated-row-category1/Cat B']));
        });
        it('should auto select the parent when updating the controlled row selection model', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, setProps;
            return __generator(this, function (_a) {
                onRowSelectionModelChange = (0, sinon_1.spy)();
                setProps = render(<Test rowSelectionModel={(0, helperFn_1.includeRowSelection)([])} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([3, 4]) });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(1);
                expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([3, 4, 'auto-generated-row-category1/Cat B']));
                return [2 /*return*/];
            });
        }); });
        it('should auto select descendants when updating the controlled row selection model', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, setProps;
            return __generator(this, function (_a) {
                onRowSelectionModelChange = (0, sinon_1.spy)();
                setProps = render(<Test rowSelectionModel={(0, helperFn_1.includeRowSelection)([])} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({
                        rowSelectionModel: (0, helperFn_1.includeRowSelection)(['auto-generated-row-category1/Cat B']),
                    });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(1);
                expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([3, 4, 'auto-generated-row-category1/Cat B']));
                return [2 /*return*/];
            });
        }); });
        it('should select all the children when selecting a parent', function () {
            var _a;
            render(<Test />);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(1, 0).querySelector('input'));
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([
                'auto-generated-row-category1/Cat B',
                3,
                4,
            ]);
        });
        it('should deselect all the children when deselecting a parent', function () {
            var _a, _b;
            render(<Test />);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(1, 0).querySelector('input'));
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([
                'auto-generated-row-category1/Cat B',
                3,
                4,
            ]);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(1, 0).querySelector('input'));
            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows().size).to.equal(0);
        });
        it('should auto select the parent if all the children are selected', function () {
            var _a;
            render(<Test defaultGroupingExpansionDepth={-1} density="compact"/>);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(1, 0).querySelector('input'));
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(2, 0).querySelector('input'));
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(3, 0).querySelector('input'));
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([
                0,
                1,
                2,
                'auto-generated-row-category1/Cat A',
            ]);
        });
        it('should deselect auto selected parent if one of the children is deselected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<Test defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 0).querySelector('input'))];
                    case 3:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([
                            0,
                            1,
                            2,
                            'auto-generated-row-category1/Cat A',
                        ]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 4:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([0, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
        // Context: https://github.com/mui/mui-x/issues/15206
        it('should keep the correct selection items and the selection count when rows are updated', function () {
            var _a, _b, _c, _d, _e, _f;
            render(<Test />);
            var expectedKeys = ['auto-generated-row-category1/Cat B', 3, 4];
            var expectedCount = 3;
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(1, 0).querySelector('input'));
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys(expectedKeys);
            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.state.rowSelection.type).to.equal('include');
            expect((_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.state.rowSelection.ids.size).to.equal(expectedCount);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows(__spreadArray([], rows, true));
            });
            expect((_d = apiRef.current) === null || _d === void 0 ? void 0 : _d.getSelectedRows()).to.have.keys(expectedKeys);
            expect((_e = apiRef.current) === null || _e === void 0 ? void 0 : _e.state.rowSelection.type).to.equal('include');
            expect((_f = apiRef.current) === null || _f === void 0 ? void 0 : _f.state.rowSelection.ids.size).to.equal(expectedCount);
        });
        it('should select all the children when selecting an indeterminate parent', function () {
            var _a;
            render(<Test defaultGroupingExpansionDepth={-1} density="compact"/>);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(2, 0).querySelector('input'));
            expect((0, helperFn_1.getCell)(0, 0).querySelector('input')).to.have.attr('data-indeterminate', 'true');
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 0).querySelector('input'));
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([
                0,
                1,
                2,
                'auto-generated-row-category1/Cat A',
            ]);
        });
        // Use case yet to be supported
        describe.skip('prop: keepNonExistentRowsSelected', function () {
            it('should auto select the parent of a previously selected non existent rows when it is added back', function () {
                var onRowSelectionModelChange = (0, sinon_1.spy)();
                var setProps = render(<Test keepNonExistentRowsSelected rowSelectionModel={(0, helperFn_1.includeRowSelection)([3, 4])} rows={[]} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rows: rows });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(1);
                expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([3, 4, 'auto-generated-row-category1/Cat B']));
            });
            it('should auto select the children of a previously non existent parent row when it is added back', function () {
                var onRowSelectionModelChange = (0, sinon_1.spy)();
                var setProps = render(<Test keepNonExistentRowsSelected rowSelectionModel={(0, helperFn_1.includeRowSelection)(['auto-generated-row-category1/Cat B'])} rows={[]} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rows: rows });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(1);
                expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)(['auto-generated-row-category1/Cat B', 3, 4]));
            });
        });
    });
});
