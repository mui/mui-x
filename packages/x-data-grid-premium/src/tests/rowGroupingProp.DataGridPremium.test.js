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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var fireUserEvent_1 = require("test/utils/fireUserEvent");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var sinon_1 = require("sinon");
var skipIf_1 = require("test/utils/skipIf");
var rows = [
    { id: 0, category1: 'Cat A', category2: 'Cat 1' },
    { id: 1, category1: 'Cat A', category2: 'Cat 2' },
    { id: 2, category1: 'Cat A', category2: 'Cat 2' },
    { id: 3, category1: 'Cat B', category2: 'Cat 2' },
    { id: 4, category1: 'Cat B', category2: 'Cat 1' },
];
var baselineProps = {
    autoHeight: skipIf_1.isJSDOM,
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
describe('<DataGridPremium /> - Row grouping', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function Test(props) {
        apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_premium_1.DataGridPremium {...baselineProps} apiRef={apiRef} {...props}/>
      </div>);
    }
    describe('prop: rowGroupingColumnMode', function () {
        it('should gather all the grouping criteria into a single column when rowGroupingColumnMode is not defined', function () {
            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'Group',
                'id',
                'category1',
                'category2',
            ]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat 1 (1)',
                '',
                'Cat 2 (2)',
                '',
                '',
                'Cat B (2)',
                'Cat 2 (1)',
                '',
                'Cat 1 (1)',
                '',
            ]);
        });
        it('should gather all the grouping criteria into a single column when rowGroupingColumnMode = "single"', function () {
            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'Group',
                'id',
                'category1',
                'category2',
            ]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat 1 (1)',
                '',
                'Cat 2 (2)',
                '',
                '',
                'Cat B (2)',
                'Cat 2 (1)',
                '',
                'Cat 1 (1)',
                '',
            ]);
        });
        it('should create one grouping column per grouping criteria when rowGroupingColumnMode = "multiple"', function () {
            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} defaultGroupingExpansionDepth={-1} rowGroupingColumnMode="multiple"/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'category1',
                'category2',
                'id',
                'category1',
                'category2',
            ]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                '',
                '',
                '',
                '',
                '',
                'Cat B (2)',
                '',
                '',
                '',
                '',
            ]);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                '',
                'Cat 1 (1)',
                '',
                'Cat 2 (2)',
                '',
                '',
                '',
                'Cat 2 (1)',
                '',
                'Cat 1 (1)',
                '',
            ]);
        });
        it('should support rowGroupingColumnMode switch', function () {
            var setProps = render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} defaultGroupingExpansionDepth={-1} rowGroupingColumnMode="multiple"/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'category1',
                'category2',
                'id',
                'category1',
                'category2',
            ]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                '',
                '',
                '',
                '',
                '',
                'Cat B (2)',
                '',
                '',
                '',
                '',
            ]);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                '',
                'Cat 1 (1)',
                '',
                'Cat 2 (2)',
                '',
                '',
                '',
                'Cat 2 (1)',
                '',
                'Cat 1 (1)',
                '',
            ]);
            setProps({ rowGroupingColumnMode: 'single' });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'Group',
                'id',
                'category1',
                'category2',
            ]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat 1 (1)',
                '',
                'Cat 2 (2)',
                '',
                '',
                'Cat B (2)',
                'Cat 2 (1)',
                '',
                'Cat 1 (1)',
                '',
            ]);
            setProps({ rowGroupingColumnMode: 'multiple' });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'category1',
                'category2',
                'id',
                'category1',
                'category2',
            ]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                '',
                '',
                '',
                '',
                '',
                'Cat B (2)',
                '',
                '',
                '',
                '',
            ]);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                '',
                'Cat 1 (1)',
                '',
                'Cat 2 (2)',
                '',
                '',
                '',
                'Cat 2 (1)',
                '',
                'Cat 1 (1)',
                '',
            ]);
        });
        // https://github.com/mui/mui-x/issues/17046
        it('should support rowGroupingColumnMode switch with one grouping column', function () {
            var setProps = render(<Test rowGroupingModel={['category1']} rowGroupingColumnMode="multiple" defaultGroupingExpansionDepth={-1}/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'category1',
                'id',
                'category1',
                'category2',
            ]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
            setProps({ rowGroupingColumnMode: 'single' });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'category1',
                'id',
                'category1',
                'category2',
            ]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
        });
        it('should respect the model grouping order when rowGroupingColumnMode = "single"', function () {
            render(<Test initialState={{ rowGrouping: { model: ['category2', 'category1'] } }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'Group',
                'id',
                'category1',
                'category2',
            ]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat 1 (2)',
                'Cat A (1)',
                '',
                'Cat B (1)',
                '',
                'Cat 2 (3)',
                'Cat A (2)',
                '',
                '',
                'Cat B (1)',
                '',
            ]);
        });
        it('should respect the model grouping order when rowGroupingColumnMode = "multiple"', function () {
            render(<Test initialState={{ rowGrouping: { model: ['category2', 'category1'] } }} defaultGroupingExpansionDepth={-1} rowGroupingColumnMode="multiple"/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'category2',
                'category1',
                'id',
                'category1',
                'category2',
            ]);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat 1 (2)',
                '',
                '',
                '',
                '',
                'Cat 2 (3)',
                '',
                '',
                '',
                '',
                '',
            ]);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                '',
                'Cat A (1)',
                '',
                'Cat B (1)',
                '',
                '',
                'Cat A (2)',
                '',
                '',
                'Cat B (1)',
                '',
            ]);
        });
    });
    describe('prop: disableRowGrouping', function () {
        it('should disable the row grouping when `prop.disableRowGrouping = true`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category1Menuitem, category2Menuitem;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} defaultGroupingExpansionDepth={-1} disableRowGrouping/>);
                        // No grouping applied on rows
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rows.groupingName).to.equal('none');
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4']);
                        // No grouping column rendered
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'category1', 'category2']);
                        // No menu item on column menu to add / remove grouping criteria
                        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('category1'); });
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        category1Menuitem = internal_test_utils_1.screen.queryByRole('menuitem', {
                            name: 'Stop grouping by category1',
                        });
                        expect(category1Menuitem).to.equal(null);
                        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.hideColumnMenu(); });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                            })];
                    case 1:
                        _b.sent();
                        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('category2'); });
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        category2Menuitem = internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Group by category2' });
                        expect(category2Menuitem).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: defaultGroupingExpansionDepth', function () {
        it('should not expand any row if defaultGroupingExpansionDepth = 0', function () {
            render(<Test defaultGroupingExpansionDepth={0} initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', 'Cat B (2)']);
        });
        it('should expand all top level rows if defaultGroupingExpansionDepth = 1', function () {
            render(<Test defaultGroupingExpansionDepth={1} initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat 1 (1)',
                'Cat 2 (2)',
                'Cat B (2)',
                'Cat 2 (1)',
                'Cat 1 (1)',
            ]);
        });
        it('should expand all rows up to depth of 2 if defaultGroupingExpansionDepth = 2', function () {
            render(<Test defaultGroupingExpansionDepth={2} initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat 1 (1)',
                '',
                'Cat 2 (2)',
                '',
                '',
                'Cat B (2)',
                'Cat 2 (1)',
                '',
                'Cat 1 (1)',
                '',
            ]);
        });
        it('should expand all rows if defaultGroupingExpansionDepth = -1', function () {
            render(<Test defaultGroupingExpansionDepth={-1} initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat 1 (1)',
                '',
                'Cat 2 (2)',
                '',
                '',
                'Cat B (2)',
                'Cat 2 (1)',
                '',
                'Cat 1 (1)',
                '',
            ]);
        });
        it('should not re-apply default expansion on rerender after expansion manually toggled', function () {
            var setProps = render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', 'Cat B (2)']);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowChildrenExpansion('auto-generated-row-category1/Cat B', true);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat B (2)',
                'Cat 2 (1)',
                'Cat 1 (1)',
            ]);
            setProps({ sortModel: [{ field: '__row_group_by_columns_group__', sort: 'desc' }] });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat B (2)',
                'Cat 2 (1)',
                'Cat 1 (1)',
                'Cat A (3)',
            ]);
        });
    });
    describe('prop: isGroupExpandedByDefault', function () {
        it('should expand groups according to isGroupExpandedByDefault when defined', function () {
            var _a;
            var isGroupExpandedByDefault = (0, sinon_1.spy)(function (node) { return node.groupingKey === 'Cat A' && node.groupingField === 'category1'; });
            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} isGroupExpandedByDefault={isGroupExpandedByDefault}/>);
            expect(isGroupExpandedByDefault.callCount).to.equal(internal_test_utils_1.reactMajor >= 19 ? 6 : 12); // Should not be called on leaves
            var _b = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rows.tree['auto-generated-row-category1/Cat A'], childrenExpanded = _b.childrenExpanded, node = __rest(_b, ["childrenExpanded"]);
            var callForNodeA = isGroupExpandedByDefault
                .getCalls()
                .find(function (call) {
                return call.firstArg.groupingKey === 'Cat A' && call.firstArg.groupingField === 'category1';
            });
            expect(callForNodeA.firstArg).to.deep.includes(node);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat 1 (1)',
                'Cat 2 (2)',
                'Cat B (2)',
            ]);
        });
        it('should have priority over defaultGroupingExpansionDepth when both defined', function () {
            var isGroupExpandedByDefault = function (node) {
                return node.groupingKey === 'Cat A' && node.groupingField === 'category1';
            };
            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} isGroupExpandedByDefault={isGroupExpandedByDefault} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat 1 (1)',
                'Cat 2 (2)',
                'Cat B (2)',
            ]);
        });
    });
    describe('prop: groupingColDef when groupingColumnMode = "single"', function () {
        it('should not allow to override the field', function () {
            var _a;
            render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} groupingColDef={{
                    // @ts-expect-error
                    field: 'custom-field',
                }}/>);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getAllColumns()[0].field).to.equal('__row_group_by_columns_group__');
        });
        it('should react to groupingColDef update', function () {
            var setProps = render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} groupingColDef={{}}/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'category1',
                'id',
                'category1',
                'category2',
            ]);
            setProps({
                groupingColDef: {
                    headerName: 'Custom group',
                },
            });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'Custom group',
                'id',
                'category1',
                'category2',
            ]);
        });
        it('should keep the grouping column width between generations', function () {
            render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} groupingColDef={{ width: 200 }}/>);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '200px' });
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([
                    { field: x_data_grid_premium_1.GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, width: 100 },
                ]);
            });
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '100px' });
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([
                    {
                        field: 'id',
                        headerName: 'New id',
                    },
                ]);
            });
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '100px' });
        });
        describe('prop: groupColDef.leafField', function () {
            it('should render the leafField `value` on leaves', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} groupingColDef={{ leafField: 'id' }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    '0',
                    '1',
                    '2',
                    'Cat B (2)',
                    '3',
                    '4',
                ]);
            });
            it('should render the leafField `formattedValue` on leaves if `valueFormatter` is defined on the leafColDef', function () {
                render(<Test columns={[
                        {
                            field: 'id',
                            type: 'number',
                            valueFormatter: function (value) {
                                if (value == null) {
                                    return null;
                                }
                                return "#".concat(value);
                            },
                        },
                        {
                            field: 'category1',
                        },
                    ]} initialState={{ rowGrouping: { model: ['category1'] } }} groupingColDef={{ leafField: 'id' }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    '#0',
                    '#1',
                    '#2',
                    'Cat B (2)',
                    '#3',
                    '#4',
                ]);
            });
            it('should render the leafField `renderCell` on leaves  if `renderCell` is defined on the leafColDef', function () {
                var renderIdCell = (0, sinon_1.spy)(function () { return 'Custom leaf'; });
                render(<Test columns={[
                        {
                            field: 'id',
                            type: 'number',
                            renderCell: renderIdCell,
                        },
                        {
                            field: 'category1',
                        },
                    ]} initialState={{ rowGrouping: { model: ['category1'] } }} groupingColDef={{ leafField: 'id' }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    'Custom leaf',
                    'Custom leaf',
                    'Custom leaf',
                    'Cat B (2)',
                    'Custom leaf',
                    'Custom leaf',
                ]);
            });
            // See https://github.com/mui/mui-x/issues/7949
            it('should correctly pass `hasFocus` to `renderCell` defined on the leafColDef', function () {
                var renderIdCell = (0, sinon_1.spy)(function (params) { return "Focused: ".concat(params.hasFocus); });
                render(<Test columns={[
                        {
                            field: 'id',
                            type: 'number',
                            renderCell: renderIdCell,
                        },
                        {
                            field: 'category1',
                        },
                    ]} initialState={{ rowGrouping: { model: ['category1'] } }} groupingColDef={{ leafField: 'id' }} defaultGroupingExpansionDepth={-1}/>);
                fireUserEvent_1.fireUserEvent.mousePress((0, helperFn_1.getCell)(1, 0));
                expect(renderIdCell.lastCall.firstArg.field).to.equal('id');
                expect((0, helperFn_1.getCell)(1, 0)).to.have.text('Focused: true');
            });
        });
        describe('prop: groupColDef.headerName', function () {
            it('should allow to override the headerName in object mode', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} groupingColDef={{
                        headerName: 'Main category',
                    }}/>);
                expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                    'Main category',
                    'id',
                    'category1',
                    'category2',
                ]);
            });
            it('should allow to override the headerName in callback mode', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} groupingColDef={function (params) {
                        return params.fields.includes('category1')
                            ? {
                                headerName: 'Main category',
                            }
                            : {};
                    }}/>);
                expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                    'Main category',
                    'id',
                    'category1',
                    'category2',
                ]);
            });
        });
        describe('prop: groupColDef.valueFormatter', function () {
            it('should allow to format the value in object mode', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} defaultGroupingExpansionDepth={1} groupingColDef={{
                        valueFormatter: function (value, row) {
                            var _a, _b;
                            var rowId = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRowId(row);
                            if (!rowId) {
                                return '';
                            }
                            var node = (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getRowNode(rowId);
                            if (node.type !== 'group') {
                                return '';
                            }
                            return "".concat(node.groupingField, " / ").concat(node.groupingKey);
                        },
                    }}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'category1 / Cat A (3)',
                    'category2 / Cat 1 (1)',
                    'category2 / Cat 2 (2)',
                    'category1 / Cat B (2)',
                    'category2 / Cat 2 (1)',
                    'category2 / Cat 1 (1)',
                ]);
            });
            it('should allow to format the value in callback mode', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} defaultGroupingExpansionDepth={1} groupingColDef={function () { return ({
                        valueFormatter: function (value, row) {
                            var _a, _b;
                            var rowId = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRowId(row);
                            if (!rowId) {
                                return '';
                            }
                            var node = (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getRowNode(rowId);
                            if (node.type !== 'group') {
                                return '';
                            }
                            return "".concat(node.groupingField, " / ").concat(node.groupingKey);
                        },
                    }); }}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'category1 / Cat A (3)',
                    'category2 / Cat 1 (1)',
                    'category2 / Cat 2 (2)',
                    'category1 / Cat B (2)',
                    'category2 / Cat 2 (1)',
                    'category2 / Cat 1 (1)',
                ]);
            });
        });
        describe('prop: groupingColDef.hideDescendantCount', function () {
            it('should render descendant count when hideDescendantCount = false', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} groupingColDef={{ hideDescendantCount: false }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    'Cat 1 (1)',
                    '',
                    'Cat 2 (2)',
                    '',
                    '',
                    'Cat B (2)',
                    'Cat 2 (1)',
                    '',
                    'Cat 1 (1)',
                    '',
                ]);
            });
            it('should not render descendant count when hideDescendantCount = true', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} groupingColDef={{ hideDescendantCount: true }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A',
                    'Cat 1',
                    '',
                    'Cat 2',
                    '',
                    '',
                    'Cat B',
                    'Cat 2',
                    '',
                    'Cat 1',
                    '',
                ]);
            });
        });
    });
    describe('prop: groupingColDef when groupingColumnMode = "multiple"', function () {
        it('should not allow to override the field', function () {
            var _a;
            render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} rowGroupingColumnMode="multiple" groupingColDef={{
                    // @ts-expect-error
                    field: 'custom-field',
                }}/>);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getAllColumns()[0].field).to.equal('__row_group_by_columns_group_category1__');
        });
        it('should react to groupingColDef update', function () {
            var setProps = render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" groupingColDef={function (params) {
                    return params.fields.includes('category1')
                        ? {
                            headerName: 'Custom group',
                        }
                        : {};
                }}/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'Custom group',
                'category2',
                'id',
                'category1',
                'category2',
            ]);
            setProps({
                groupingColDef: function (params) {
                    return params.fields.includes('category2')
                        ? {
                            headerName: 'Custom group',
                        }
                        : {};
                },
            });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'category1',
                'Custom group',
                'id',
                'category1',
                'category2',
            ]);
        });
        it('should keep the grouping column width between generations', function () {
            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" groupingColDef={function (params) {
                    return params.fields.includes('category1') ? { width: 200 } : { width: 300 };
                }}/>);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '200px' });
            expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '300px' });
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([
                    { field: (0, x_data_grid_premium_1.getRowGroupingFieldFromGroupingCriteria)('category1'), width: 100 },
                ]);
            });
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '100px' });
            expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '300px' });
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([
                    {
                        field: 'id',
                        headerName: 'New id',
                    },
                ]);
            });
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '100px' });
            expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '300px' });
        });
        describe('prop: groupColDef.leafField', function () {
            it('should render the leafField `value` on leaves', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" groupingColDef={function (params) {
                        return params.fields.includes('category2')
                            ? {
                                leafField: 'id',
                            }
                            : {};
                    }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'Cat B (2)',
                    '',
                    '',
                    '',
                    '',
                ]);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                    '',
                    'Cat 1 (1)',
                    '0',
                    'Cat 2 (2)',
                    '1',
                    '2',
                    '',
                    'Cat 2 (1)',
                    '3',
                    'Cat 1 (1)',
                    '4',
                ]);
            });
            it('should render the leafField `formattedValue` on leaves if `valueFormatter` is defined on the leafColDef', function () {
                render(<Test columns={[
                        {
                            field: 'id',
                            type: 'number',
                            valueFormatter: function (value) {
                                if (value == null) {
                                    return null;
                                }
                                return "#".concat(value);
                            },
                        },
                        {
                            field: 'category1',
                        },
                        {
                            field: 'category2',
                        },
                    ]} initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" groupingColDef={function (params) {
                        return params.fields.includes('category2')
                            ? {
                                leafField: 'id',
                            }
                            : {};
                    }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'Cat B (2)',
                    '',
                    '',
                    '',
                    '',
                ]);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                    '',
                    'Cat 1 (1)',
                    '#0',
                    'Cat 2 (2)',
                    '#1',
                    '#2',
                    '',
                    'Cat 2 (1)',
                    '#3',
                    'Cat 1 (1)',
                    '#4',
                ]);
            });
            it('should render the leafField `renderCell` on leaves  if `renderCell` is defined on the leafColDef', function () {
                var renderIdCell = (0, sinon_1.spy)(function () { return 'Custom leaf'; });
                render(<Test columns={[
                        {
                            field: 'id',
                            type: 'number',
                            renderCell: renderIdCell,
                        },
                        {
                            field: 'category1',
                        },
                        {
                            field: 'category2',
                        },
                    ]} initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" groupingColDef={function (params) {
                        return params.fields.includes('category2')
                            ? {
                                leafField: 'id',
                            }
                            : {};
                    }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'Cat B (2)',
                    '',
                    '',
                    '',
                    '',
                ]);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                    '',
                    'Cat 1 (1)',
                    'Custom leaf',
                    'Cat 2 (2)',
                    'Custom leaf',
                    'Custom leaf',
                    '',
                    'Cat 2 (1)',
                    'Custom leaf',
                    'Cat 1 (1)',
                    'Custom leaf',
                ]);
            });
        });
        describe('prop: groupColDef.headerName', function () {
            it('should allow to override the headerName in object mode', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" groupingColDef={{
                        headerName: 'Main category',
                    }}/>);
                expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                    'Main category',
                    'Main category',
                    'id',
                    'category1',
                    'category2',
                ]);
            });
            it('should allow to override the headerName in callback mode', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" groupingColDef={function (params) {
                        return params.fields.includes('category1')
                            ? {
                                headerName: 'Main category',
                            }
                            : {};
                    }}/>);
                expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                    'Main category',
                    'category2',
                    'id',
                    'category1',
                    'category2',
                ]);
            });
        });
        describe('prop: groupColDef.valueFormatter', function () {
            it('should allow to format the value in object mode', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" defaultGroupingExpansionDepth={1} groupingColDef={{
                        valueFormatter: function (value, row) {
                            var _a, _b;
                            var rowId = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRowId(row);
                            if (!rowId) {
                                return '';
                            }
                            var node = (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getRowNode(rowId);
                            if (node.type !== 'group') {
                                return '';
                            }
                            return "".concat(node.groupingField, " / ").concat(node.groupingKey);
                        },
                    }}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'category1 / Cat A (3)',
                    '',
                    '',
                    'category1 / Cat B (2)',
                    '',
                    '',
                ]);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                    '',
                    'category2 / Cat 1 (1)',
                    'category2 / Cat 2 (2)',
                    '',
                    'category2 / Cat 2 (1)',
                    'category2 / Cat 1 (1)',
                ]);
            });
            it('should allow to format the value in callback mode', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" defaultGroupingExpansionDepth={1} groupingColDef={function (_a) {
                        var fields = _a.fields;
                        if (!fields.includes('category1')) {
                            return {};
                        }
                        return {
                            valueFormatter: function (value, row) {
                                var _a, _b;
                                var rowId = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRowId(row);
                                if (!rowId) {
                                    return '';
                                }
                                var node = (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getRowNode(rowId);
                                if (node.type !== 'group') {
                                    return '';
                                }
                                return "".concat(node.groupingField, " / ").concat(node.groupingKey);
                            },
                        };
                    }}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'category1 / Cat A (3)',
                    '',
                    '',
                    'category1 / Cat B (2)',
                    '',
                    '',
                ]);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                    '',
                    'Cat 1 (1)',
                    'Cat 2 (2)',
                    '',
                    'Cat 2 (1)',
                    'Cat 1 (1)',
                ]);
            });
        });
        describe('prop: groupingColDef.hideDescendantCount', function () {
            it('should render descendant count when hideDescendantCount = false', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" groupingColDef={{ hideDescendantCount: false }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'Cat B (2)',
                    '',
                    '',
                    '',
                    '',
                ]);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                    '',
                    'Cat 1 (1)',
                    '',
                    'Cat 2 (2)',
                    '',
                    '',
                    '',
                    'Cat 2 (1)',
                    '',
                    'Cat 1 (1)',
                    '',
                ]);
            });
            it('should not render descendant count when hideDescendantCount = true', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" groupingColDef={{ hideDescendantCount: true }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'Cat B',
                    '',
                    '',
                    '',
                    '',
                ]);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                    '',
                    'Cat 1',
                    '',
                    'Cat 2',
                    '',
                    '',
                    '',
                    'Cat 2',
                    '',
                    'Cat 1',
                    '',
                ]);
            });
        });
    });
});
