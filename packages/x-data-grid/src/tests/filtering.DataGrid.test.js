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
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var sinon_1 = require("sinon");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGrid /> - Filter', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: skipIf_1.isJSDOM,
        disableVirtualization: true,
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
    var disableEval = false;
    function testEval(fn) {
        disableEval = false;
        fn();
        disableEval = true;
        fn();
        disableEval = false;
    }
    function TestCase(props) {
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} {...props} disableEval={disableEval}/>
      </div>);
    }
    describe('prop: filterModel', function () {
        it('should throw for more than one filter item', function () {
            expect(function () {
                render(<TestCase rows={[]} columns={[]} filterModel={{
                        items: [
                            { id: 0, field: 'brand', operator: 'contains' },
                            { id: 1, field: 'brand', operator: 'contains' },
                        ],
                    }}/>);
            }).toErrorDev('MUI X: The `filterModel` can only contain a single item when the `disableMultipleColumnsFiltering` prop is set to `true`.');
        });
        it('should apply the model for `filterable: false` columns but the applied filter should be readonly', function () {
            render(<TestCase columns={[{ field: 'brand', filterable: false }]} filterModel={{ items: [{ field: 'brand', operator: 'contains', value: 'Adidas' }] }} initialState={{
                    preferencePanel: {
                        open: true,
                        openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                    },
                }}/>);
            // filter has been applied
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
            // field has the applied value and is read-only
            var valueInput = internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' });
            expect(valueInput).to.have.value('Adidas');
            expect(valueInput).to.have.property('disabled', true);
        });
        it('should apply the model', function () {
            render(<TestCase filterModel={{ items: [{ field: 'brand', operator: 'contains', value: 'a' }] }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
        });
        it('should apply the model when row prop changes', function () {
            render(<TestCase filterModel={{ items: [{ field: 'brand', operator: 'contains', value: 'a' }] }} rows={[
                    {
                        id: 3,
                        brand: 'Asics',
                    },
                    {
                        id: 4,
                        brand: 'RedBull',
                    },
                    {
                        id: 5,
                        brand: 'Hugo',
                    },
                ]}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Asics']);
        });
        it('should support new dataset', function () {
            var setProps = render(<TestCase filterModel={{ items: [{ field: 'brand', operator: 'contains', value: 'a' }] }}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
            setProps({
                rows: [
                    {
                        id: 0,
                        country: 'France',
                    },
                    {
                        id: 1,
                        country: 'UK',
                    },
                    {
                        id: 12,
                        country: 'US',
                    },
                ],
                columns: [{ field: 'country' }],
                filterModel: { items: [{ field: 'country', operator: 'contains', value: 'a' }] },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['France']);
        });
    });
    describe('prop: initialState.filter', function () {
        it('should allow to initialize the filterModel', function () {
            render(<TestCase initialState={{
                    filter: {
                        filterModel: {
                            items: [{ field: 'brand', operator: 'equals', value: 'Adidas' }],
                        },
                    },
                }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
        });
        it('should allow to initialize the filterModel for non-filterable columns', function () {
            render(<TestCase columns={[{ field: 'brand', filterable: false }]} initialState={{
                    filter: {
                        filterModel: {
                            items: [{ field: 'brand', operator: 'equals', value: 'Adidas' }],
                        },
                    },
                }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
        });
        it('should use the control state upon the initialize state when both are defined', function () {
            render(<TestCase filterModel={{
                    items: [{ field: 'brand', operator: 'equals', value: 'Adidas' }],
                }} initialState={{
                    filter: {
                        filterModel: {
                            items: [{ field: 'brand', operator: 'equals', value: 'Puma' }],
                        },
                    },
                }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
        });
        it('should not update the filters when updating the initial state', function () {
            var setProps = render(<TestCase initialState={{
                    filter: {
                        filterModel: {
                            items: [{ field: 'brand', operator: 'equals', value: 'Adidas' }],
                        },
                    },
                }}/>).setProps;
            setProps({
                initialState: {
                    filter: {
                        filterModel: {
                            items: [{ field: 'brand', operator: 'equals', value: 'Puma' }],
                        },
                    },
                },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
        });
        it('should allow to update the filters when initialized with initialState', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCase initialState={{
                                preferencePanel: {
                                    open: true,
                                    openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                                },
                                filter: {
                                    filterModel: {
                                        items: [{ field: 'brand', operator: 'equals', value: 'Adidas' }],
                                    },
                                },
                            }}/>);
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
                        internal_test_utils_1.fireEvent.change(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }), {
                            target: { value: 'Puma' },
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma']);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: getRowId', function () {
        it('works with filter', function () {
            render(<TestCase getRowId={function (row) { return row.brand; }} filterModel={{
                    items: [{ id: 0, field: 'brand', operator: 'contains', value: 'Nike' }],
                }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike']);
        });
        it('works with quick filter', function () {
            render(<TestCase getRowId={function (row) { return row.brand; }} filterModel={{
                    items: [],
                    quickFilterValues: ['Nike'],
                }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike']);
        });
    });
    describe('column type: string', function () {
        var getRows = function (item) {
            var unmount = render(<TestCase filterModel={{
                    items: [__assign({ field: 'country' }, item)],
                }} rows={[
                    { id: 0, country: undefined },
                    { id: 1, country: null },
                    { id: 2, country: '' },
                    { id: 3, country: 'France (fr)' },
                    { id: 4, country: 'Germany' },
                    { id: 5, country: 0 },
                    { id: 6, country: 1 },
                ]} columns={[
                    {
                        field: 'country',
                        type: 'string',
                    },
                ]}/>).unmount;
            var values = (0, helperFn_1.getColumnValues)(0);
            unmount();
            return values;
        };
        var ALL_ROWS = ['', '', '', 'France (fr)', 'Germany', '0', '1'];
        it('should filter with operator "contains"', function () {
            testEval(function () {
                expect(getRows({ operator: 'contains', value: 'Fra' })).to.deep.equal(['France (fr)']);
                // Trim value
                expect(getRows({ operator: 'contains', value: ' Fra ' })).to.deep.equal(['France (fr)']);
                // Case-insensitive
                expect(getRows({ operator: 'contains', value: 'fra' })).to.deep.equal(['France (fr)']);
                // Number casting
                expect(getRows({ operator: 'contains', value: '0' })).to.deep.equal(['0']);
                expect(getRows({ operator: 'contains', value: '1' })).to.deep.equal(['1']);
                // Empty values
                expect(getRows({ operator: 'contains', value: undefined })).to.deep.equal(ALL_ROWS);
                expect(getRows({ operator: 'contains', value: '' })).to.deep.equal(ALL_ROWS);
                // Value with regexp special literal
                expect(getRows({ operator: 'contains', value: '[-[]{}()*+?.,\\^$|#s]' })).to.deep.equal([]);
                expect(getRows({ operator: 'contains', value: '(fr)' })).to.deep.equal(['France (fr)']);
            });
        });
        it('should filter with operator "does not contain"', function () {
            testEval(function () {
                expect(getRows({ operator: 'doesNotContain', value: 'Fra' })).to.deep.equal([
                    '',
                    '',
                    '',
                    'Germany',
                    '0',
                    '1',
                ]);
                // Trim value
                expect(getRows({ operator: 'doesNotContain', value: ' Fra ' })).to.deep.equal([
                    '',
                    '',
                    '',
                    'Germany',
                    '0',
                    '1',
                ]);
                // Case-insensitive
                expect(getRows({ operator: 'doesNotContain', value: 'fra' })).to.deep.equal([
                    '',
                    '',
                    '',
                    'Germany',
                    '0',
                    '1',
                ]);
                // Number casting
                expect(getRows({ operator: 'doesNotContain', value: '0' })).to.deep.equal([
                    '',
                    '',
                    '',
                    'France (fr)',
                    'Germany',
                    '1',
                ]);
                expect(getRows({ operator: 'doesNotContain', value: '1' })).to.deep.equal([
                    '',
                    '',
                    '',
                    'France (fr)',
                    'Germany',
                    '0',
                ]);
                // Empty values
                expect(getRows({ operator: 'doesNotContain', value: undefined })).to.deep.equal(ALL_ROWS);
                expect(getRows({ operator: 'doesNotContain', value: '' })).to.deep.equal(ALL_ROWS);
                // Value with regexp special literal
                expect(getRows({ operator: 'doesNotContain', value: '[-[]{}()*+?.,\\^$|#s]' })).to.deep.equal(ALL_ROWS);
                expect(getRows({ operator: 'doesNotContain', value: '(fr)' })).to.deep.equal([
                    '',
                    '',
                    '',
                    'Germany',
                    '0',
                    '1',
                ]);
            });
        });
        it('should filter with operator "equals"', function () {
            expect(getRows({ operator: 'equals', value: 'France (fr)' })).to.deep.equal(['France (fr)']);
            // Trim value
            expect(getRows({ operator: 'equals', value: ' France (fr) ' })).to.deep.equal([
                'France (fr)',
            ]);
            // Case-insensitive
            expect(getRows({ operator: 'equals', value: 'france (fr)' })).to.deep.equal(['France (fr)']);
            // Number casting
            expect(getRows({ operator: 'equals', value: '0' })).to.deep.equal(['0']);
            expect(getRows({ operator: 'equals', value: '1' })).to.deep.equal(['1']);
            // Empty values
            expect(getRows({ operator: 'equals', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'equals', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "doesNotEqual"', function () {
            expect(getRows({ operator: 'doesNotEqual', value: 'France (fr)' })).to.deep.equal([
                '',
                '',
                '',
                'Germany',
                '0',
                '1',
            ]);
            // Trim value
            expect(getRows({ operator: 'doesNotEqual', value: ' France (fr) ' })).to.deep.equal([
                '',
                '',
                '',
                'Germany',
                '0',
                '1',
            ]);
            // Case-insensitive
            expect(getRows({ operator: 'doesNotEqual', value: 'france (fr)' })).to.deep.equal([
                '',
                '',
                '',
                'Germany',
                '0',
                '1',
            ]);
            // Number casting
            expect(getRows({ operator: 'doesNotEqual', value: '0' })).to.deep.equal([
                '',
                '',
                '',
                'France (fr)',
                'Germany',
                '1',
            ]);
            expect(getRows({ operator: 'doesNotEqual', value: '1' })).to.deep.equal([
                '',
                '',
                '',
                'France (fr)',
                'Germany',
                '0',
            ]);
            // Empty values
            expect(getRows({ operator: 'doesNotEqual', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'doesNotEqual', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "startsWith"', function () {
            expect(getRows({ operator: 'startsWith', value: 'Fra' })).to.deep.equal(['France (fr)']);
            // Trim value
            expect(getRows({ operator: 'startsWith', value: ' Fra ' })).to.deep.equal(['France (fr)']);
            // Case-insensitive
            expect(getRows({ operator: 'startsWith', value: 'fra' })).to.deep.equal(['France (fr)']);
            // Empty values
            expect(getRows({ operator: 'startsWith', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'startsWith', value: '' })).to.deep.equal(ALL_ROWS);
            // Number casting
            expect(getRows({ operator: 'startsWith', value: '0' })).to.deep.equal(['0']);
            expect(getRows({ operator: 'startsWith', value: '1' })).to.deep.equal(['1']);
            // Value with regexp special literal
            expect(getRows({ operator: 'startsWith', value: '[-[]{}()*+?.,\\^$|#s]' })).to.deep.equal([]);
            expect(getRows({ operator: 'contains', value: 'France (' })).to.deep.equal(['France (fr)']);
        });
        it('should filter with operator "endsWith"', function () {
            expect(getRows({ operator: 'endsWith', value: 'many' })).to.deep.equal(['Germany']);
            // Trim value
            expect(getRows({ operator: 'endsWith', value: ' many ' })).to.deep.equal(['Germany']);
            // Number casting
            expect(getRows({ operator: 'endsWith', value: '0' })).to.deep.equal(['0']);
            expect(getRows({ operator: 'endsWith', value: '1' })).to.deep.equal(['1']);
            // Empty values
            expect(getRows({ operator: 'endsWith', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'endsWith', value: '' })).to.deep.equal(ALL_ROWS);
            // Value with regexp special literal
            expect(getRows({ operator: 'endsWith', value: '[-[]{}()*+?.,\\^$|#s]' })).to.deep.equal([]);
            expect(getRows({ operator: 'contains', value: '(fr)' })).to.deep.equal(['France (fr)']);
        });
        it('should filter with operator "isAnyOf"', function () {
            expect(getRows({ operator: 'isAnyOf', value: ['France (fr)'] })).to.deep.equal([
                'France (fr)',
            ]);
            // `isAnyOf` has a `or` behavior
            expect(getRows({ operator: 'isAnyOf', value: ['France (fr)', 'Germany'] })).to.deep.equal([
                'France (fr)',
                'Germany',
            ]);
            // Number casting
            expect(getRows({ operator: 'isAnyOf', value: ['0'] })).to.deep.equal(['0']);
            expect(getRows({ operator: 'isAnyOf', value: ['1'] })).to.deep.equal(['1']);
            // Empty values
            expect(getRows({ operator: 'isAnyOf', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'isAnyOf', value: [] })).to.deep.equal(ALL_ROWS);
            // `isAnyOf` trim values
            expect(getRows({ operator: 'isAnyOf', value: [' France (fr)', 'Germany '] })).to.deep.equal([
                'France (fr)',
                'Germany',
            ]);
        });
        it('should filter with operator "isEmpty"', function () {
            expect(getRows({ operator: 'isEmpty' })).to.deep.equal(['', '', '']);
        });
        it('should filter with operator "isNotEmpty"', function () {
            expect(getRows({ operator: 'isNotEmpty' })).to.deep.equal([
                'France (fr)',
                'Germany',
                '0',
                '1',
            ]);
        });
        describe('ignoreDiacritics', function () {
            function DiacriticsTestCase(_a) {
                var filterValue = _a.filterValue, props = __rest(_a, ["filterValue"]);
                return (<TestCase filterModel={{
                        items: [{ field: 'label', operator: 'contains', value: filterValue }],
                    }} {...props} rows={[{ id: 0, label: 'Apă' }]} columns={[{ field: 'label', type: 'string' }]}/>);
            }
            it('should not ignore diacritics by default', function () {
                testEval(function () {
                    var unmount = render(<DiacriticsTestCase filterValue="apa"/>).unmount;
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
                    unmount();
                });
                testEval(function () {
                    var unmount = render(<DiacriticsTestCase filterValue="apă"/>).unmount;
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Apă']);
                    unmount();
                });
            });
            it('should ignore diacritics when `ignoreDiacritics` is enabled', function () {
                testEval(function () {
                    var unmount = render(<DiacriticsTestCase filterValue="apa" ignoreDiacritics/>).unmount;
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Apă']);
                    unmount();
                });
                testEval(function () {
                    var unmount = render(<DiacriticsTestCase filterValue="apă" ignoreDiacritics/>).unmount;
                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Apă']);
                    unmount();
                });
            });
        });
    });
    describe('column type: number', function () {
        var getRows = function (item) {
            var unmount = render(<TestCase filterModel={{
                    items: [__assign({ field: 'year' }, item)],
                }} rows={[
                    { id: 0, year: undefined },
                    { id: 1, year: null },
                    { id: 2, year: '' },
                    { id: 3, year: 0 },
                    {
                        id: 4,
                        year: 1954,
                    },
                    {
                        id: 5,
                        year: 1974,
                    },
                    {
                        id: 6,
                        year: 1984,
                    },
                ]} columns={[
                    {
                        field: 'year',
                        type: 'number',
                        // Avoid the localization of the number to simplify the checks
                        valueFormatter: function (value) { return value; },
                    },
                ]}/>).unmount;
            var values = (0, helperFn_1.getColumnValues)(0);
            unmount();
            return values;
        };
        var ALL_ROWS = ['', '', '', '0', '1954', '1974', '1984'];
        it('should filter with operator "="', function () {
            expect(getRows({ operator: '=', value: 1974 })).to.deep.equal(['1974']);
            expect(getRows({ operator: '=', value: 0 })).to.deep.equal(['', '0']);
            expect(getRows({ operator: '=', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: '=', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "!="', function () {
            expect(getRows({ operator: '!=', value: 1974 })).to.deep.equal([
                '',
                '',
                '',
                '0',
                '1954',
                '1984',
            ]);
            expect(getRows({ operator: '!=', value: 0 })).to.deep.equal(['', '', '1954', '1974', '1984']);
            expect(getRows({ operator: '!=', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: '!=', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator ">"', function () {
            expect(getRows({ operator: '>', value: 1974 })).to.deep.equal(['1984']);
            expect(getRows({ operator: '>', value: 0 })).to.deep.equal(['1954', '1974', '1984']);
            expect(getRows({ operator: '>', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: '>', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator ">=', function () {
            expect(getRows({ operator: '>=', value: 1974 })).to.deep.equal(['1974', '1984']);
            expect(getRows({ operator: '>=', value: 0 })).to.deep.equal([
                '',
                '0',
                '1954',
                '1974',
                '1984',
            ]);
            expect(getRows({ operator: '>=', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: '>=', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "<"', function () {
            expect(getRows({ operator: '<', value: 1974 })).to.deep.equal(['', '0', '1954']);
            expect(getRows({ operator: '<', value: 0 })).to.deep.equal([]);
            expect(getRows({ operator: '<', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: '<', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "<="', function () {
            expect(getRows({ operator: '<=', value: 1974 })).to.deep.equal(['', '0', '1954', '1974']);
            expect(getRows({ operator: '<=', value: 0 })).to.deep.equal(['', '0']);
            expect(getRows({ operator: '<=', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: '<=', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "isAnyOf"', function () {
            expect(getRows({ operator: 'isAnyOf', value: [1954, 1984] })).to.deep.equal(['1954', '1984']);
            expect(getRows({ operator: 'isAnyOf', value: [] })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'isAnyOf', value: undefined })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "isEmpty"', function () {
            expect(getRows({ operator: 'isEmpty' })).to.deep.equal(['', '']);
        });
        it('should filter with operator "isNotEmpty"', function () {
            expect(getRows({ operator: 'isNotEmpty' })).to.deep.equal(['', '0', '1954', '1974', '1984']);
        });
    });
    describe('column type: date', function () {
        var getRows = function (item) {
            var unmount = render(<TestCase filterModel={{
                    items: [__assign({ field: 'date' }, item)],
                }} rows={[
                    {
                        id: 0,
                        date: undefined,
                    },
                    {
                        id: 1,
                        date: null,
                    },
                    {
                        id: 2,
                        date: '',
                    },
                    {
                        id: 3,
                        date: new Date(2000, 0, 1),
                    },
                    {
                        id: 4,
                        date: new Date(2001, 0, 1),
                    },
                    {
                        id: 5,
                        date: new Date(2001, 0, 1, 8, 30),
                    },
                    {
                        id: 6,
                        date: new Date(2002, 0, 1),
                    },
                ]} columns={[
                    {
                        field: 'date',
                        type: 'date',
                        // Avoid the localization of the date to simplify the checks
                        valueFormatter: function (value) {
                            if (value === null) {
                                return 'null';
                            }
                            if (value === undefined) {
                                return 'undefined';
                            }
                            if (value === '') {
                                return '';
                            }
                            return value.toLocaleString('en-US');
                        },
                    },
                ]}/>).unmount;
            var values = (0, helperFn_1.getColumnValues)(0);
            unmount();
            return values;
        };
        var ALL_ROWS = [
            'undefined',
            'null',
            '',
            '1/1/2000, 12:00:00 AM',
            '1/1/2001, 12:00:00 AM',
            '1/1/2001, 8:30:00 AM',
            '1/1/2002, 12:00:00 AM',
        ];
        it('should filter with operator "is"', function () {
            expect(getRows({ operator: 'is', value: '2001-01-01' })).to.deep.equal([
                '1/1/2001, 12:00:00 AM',
                '1/1/2001, 8:30:00 AM',
            ]);
            expect(getRows({ operator: 'is', value: new Date('2001-01-01') })).to.deep.equal([
                '1/1/2001, 12:00:00 AM',
                '1/1/2001, 8:30:00 AM',
            ]);
            expect(getRows({ operator: 'is', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'is', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "not"', function () {
            // TODO: Should this filter return the invalid dates like for the numeric filters ?
            expect(getRows({ operator: 'not', value: '2001-01-01' })).to.deep.equal([
                '1/1/2000, 12:00:00 AM',
                '1/1/2002, 12:00:00 AM',
            ]);
            expect(getRows({ operator: 'not', value: new Date('2001-01-01') })).to.deep.equal([
                '1/1/2000, 12:00:00 AM',
                '1/1/2002, 12:00:00 AM',
            ]);
            expect(getRows({ operator: 'not', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'not', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "before"', function () {
            expect(getRows({ operator: 'before', value: '2001-01-01' })).to.deep.equal([
                '1/1/2000, 12:00:00 AM',
            ]);
            expect(getRows({ operator: 'before', value: new Date('2001-01-01') })).to.deep.equal([
                '1/1/2000, 12:00:00 AM',
            ]);
            expect(getRows({ operator: 'before', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'before', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "onOrBefore"', function () {
            expect(getRows({ operator: 'onOrBefore', value: '2001-01-01' })).to.deep.equal([
                '1/1/2000, 12:00:00 AM',
                '1/1/2001, 12:00:00 AM',
                '1/1/2001, 8:30:00 AM',
            ]);
            expect(getRows({ operator: 'onOrBefore', value: new Date('2001-01-01') })).to.deep.equal([
                '1/1/2000, 12:00:00 AM',
                '1/1/2001, 12:00:00 AM',
                '1/1/2001, 8:30:00 AM',
            ]);
            expect(getRows({ operator: 'onOrBefore', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'onOrBefore', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "after"', function () {
            expect(getRows({ operator: 'after', value: '2001-01-01' })).to.deep.equal([
                '1/1/2002, 12:00:00 AM',
            ]);
            expect(getRows({ operator: 'after', value: new Date('2001-01-01') })).to.deep.equal([
                '1/1/2002, 12:00:00 AM',
            ]);
            expect(getRows({ operator: 'after', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'after', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "onOrAfter"', function () {
            expect(getRows({ operator: 'onOrAfter', value: '2001-01-01' })).to.deep.equal([
                '1/1/2001, 12:00:00 AM',
                '1/1/2001, 8:30:00 AM',
                '1/1/2002, 12:00:00 AM',
            ]);
            expect(getRows({ operator: 'onOrAfter', value: new Date('2001-01-01') })).to.deep.equal([
                '1/1/2001, 12:00:00 AM',
                '1/1/2001, 8:30:00 AM',
                '1/1/2002, 12:00:00 AM',
            ]);
            expect(getRows({ operator: 'onOrAfter', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'onOrAfter', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "isEmpty"', function () {
            expect(getRows({ operator: 'isEmpty' })).to.deep.equal(['undefined', 'null']);
        });
        it('should filter with operator "isNotEmpty"', function () {
            expect(getRows({ operator: 'isNotEmpty' })).to.deep.equal([
                '',
                '1/1/2000, 12:00:00 AM',
                '1/1/2001, 12:00:00 AM',
                '1/1/2001, 8:30:00 AM',
                '1/1/2002, 12:00:00 AM',
            ]);
        });
    });
    describe('column type: dateTime', function () {
        var getRows = function (item) {
            var unmount = render(<TestCase filterModel={{
                    items: [__assign({ field: 'date' }, item)],
                }} rows={[
                    {
                        id: 0,
                        date: undefined,
                    },
                    {
                        id: 1,
                        date: null,
                    },
                    {
                        id: 2,
                        date: '',
                    },
                    {
                        id: 3,
                        date: new Date(2001, 0, 1, 6, 30),
                    },
                    {
                        id: 4,
                        date: new Date(2001, 0, 1, 7, 30),
                    },
                    {
                        id: 5,
                        date: new Date(2001, 0, 1, 8, 30),
                    },
                ]} columns={[
                    {
                        field: 'date',
                        type: 'dateTime',
                        // Avoid the localization of the date to simplify the checks
                        valueFormatter: function (value) {
                            if (value === null) {
                                return 'null';
                            }
                            if (value === undefined) {
                                return 'undefined';
                            }
                            if (value === '') {
                                return '';
                            }
                            return value.toLocaleString('en-US');
                        },
                    },
                ]}/>).unmount;
            var values = (0, helperFn_1.getColumnValues)(0);
            unmount();
            return values;
        };
        var ALL_ROWS = [
            'undefined',
            'null',
            '',
            '1/1/2001, 6:30:00 AM',
            '1/1/2001, 7:30:00 AM',
            '1/1/2001, 8:30:00 AM',
        ];
        it('should filter with operator "is"', function () {
            expect(getRows({ operator: 'is', value: '2001-01-01T07:30' })).to.deep.equal([
                '1/1/2001, 7:30:00 AM',
            ]);
            expect(getRows({ operator: 'is', value: new Date('2001-01-01T07:30') })).to.deep.equal([
                '1/1/2001, 7:30:00 AM',
            ]);
            expect(getRows({ operator: 'is', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'is', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "not"', function () {
            // TODO: Should this filter return the invalid dates like for the numeric filters ?
            expect(getRows({ operator: 'not', value: '2001-01-01T07:30' })).to.deep.equal([
                '1/1/2001, 6:30:00 AM',
                '1/1/2001, 8:30:00 AM',
            ]);
            expect(getRows({ operator: 'not', value: new Date('2001-01-01T07:30') })).to.deep.equal([
                '1/1/2001, 6:30:00 AM',
                '1/1/2001, 8:30:00 AM',
            ]);
            expect(getRows({ operator: 'not', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'not', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "before"', function () {
            expect(getRows({ operator: 'before', value: '2001-01-01T07:30' })).to.deep.equal([
                '1/1/2001, 6:30:00 AM',
            ]);
            expect(getRows({ operator: 'before', value: new Date('2001-01-01T07:30') })).to.deep.equal([
                '1/1/2001, 6:30:00 AM',
            ]);
            expect(getRows({ operator: 'before', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'before', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "onOrBefore"', function () {
            expect(getRows({ operator: 'onOrBefore', value: '2001-01-01T07:30' })).to.deep.equal([
                '1/1/2001, 6:30:00 AM',
                '1/1/2001, 7:30:00 AM',
            ]);
            expect(getRows({ operator: 'onOrBefore', value: new Date('2001-01-01T07:30') })).to.deep.equal(['1/1/2001, 6:30:00 AM', '1/1/2001, 7:30:00 AM']);
            expect(getRows({ operator: 'onOrBefore', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'onOrBefore', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "after"', function () {
            expect(getRows({ operator: 'after', value: '2001-01-01T07:30' })).to.deep.equal([
                '1/1/2001, 8:30:00 AM',
            ]);
            expect(getRows({ operator: 'after', value: new Date('2001-01-01T07:30') })).to.deep.equal([
                '1/1/2001, 8:30:00 AM',
            ]);
            expect(getRows({ operator: 'after', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'after', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "onOrAfter"', function () {
            expect(getRows({ operator: 'onOrAfter', value: '2001-01-01T07:30' })).to.deep.equal([
                '1/1/2001, 7:30:00 AM',
                '1/1/2001, 8:30:00 AM',
            ]);
            expect(getRows({ operator: 'onOrAfter', value: new Date('2001-01-01T07:30') })).to.deep.equal(['1/1/2001, 7:30:00 AM', '1/1/2001, 8:30:00 AM']);
            expect(getRows({ operator: 'onOrAfter', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'onOrAfter', value: '' })).to.deep.equal(ALL_ROWS);
        });
        it('should filter with operator "isEmpty"', function () {
            expect(getRows({ operator: 'isEmpty' })).to.deep.equal(['undefined', 'null']);
        });
        it('should filter with operator "isNotEmpty"', function () {
            expect(getRows({ operator: 'isNotEmpty' })).to.deep.equal([
                '',
                '1/1/2001, 6:30:00 AM',
                '1/1/2001, 7:30:00 AM',
                '1/1/2001, 8:30:00 AM',
            ]);
        });
    });
    describe('column type: boolean', function () {
        var getRows = function (item) {
            var unmount = render(<TestCase filterModel={{
                    items: [__assign({ field: 'isPublished' }, item)],
                }} rows={[
                    {
                        id: 0,
                        isPublished: undefined,
                    },
                    {
                        id: 1,
                        isPublished: null,
                    },
                    {
                        id: 2,
                        isPublished: true,
                    },
                    {
                        id: 3,
                        isPublished: false,
                    },
                ]} columns={[
                    {
                        field: 'isPublished',
                        type: 'boolean',
                        // The boolean cell does not handle the formatted value, so we override it
                        renderCell: function (params) {
                            var value = params.value;
                            if (value === null) {
                                return 'null';
                            }
                            if (value === undefined) {
                                return 'undefined';
                            }
                            return value.toString();
                        },
                    },
                ]}/>).unmount;
            var values = (0, helperFn_1.getColumnValues)(0);
            unmount();
            return values;
        };
        var ALL_ROWS = ['undefined', 'null', 'true', 'false'];
        var TRUTHY_ROWS = ['true'];
        var FALSY_ROWS = ['undefined', 'null', 'false'];
        it('should filter with operator "is"', function () {
            expect(getRows({ operator: 'is', value: 'TRUE' })).to.deep.equal(TRUTHY_ROWS);
            expect(getRows({ operator: 'is', value: 'True' })).to.deep.equal(TRUTHY_ROWS);
            expect(getRows({ operator: 'is', value: 'true' })).to.deep.equal(TRUTHY_ROWS);
            expect(getRows({ operator: 'is', value: true })).to.deep.equal(TRUTHY_ROWS);
            expect(getRows({ operator: 'is', value: 'FALSE' })).to.deep.equal(FALSY_ROWS);
            expect(getRows({ operator: 'is', value: 'False' })).to.deep.equal(FALSY_ROWS);
            expect(getRows({ operator: 'is', value: 'false' })).to.deep.equal(FALSY_ROWS);
            expect(getRows({ operator: 'is', value: false })).to.deep.equal(FALSY_ROWS);
            expect(getRows({ operator: 'is', value: '' })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'is', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'is', value: null })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'is', value: 'test' })).to.deep.equal(ALL_ROWS); // Ignores invalid values
        });
    });
    describe('column type: singleSelect', function () {
        var getRows = function (item) {
            var unmount = render(<TestCase filterModel={{
                    items: [item],
                }} rows={[
                    {
                        id: 0,
                        country: undefined,
                        year: undefined,
                    },
                    {
                        id: 1,
                        country: null,
                        year: null,
                    },
                    {
                        id: 2,
                        country: 'United States',
                        year: 1974,
                    },
                    {
                        id: 3,
                        country: 'Germany',
                        year: 1984,
                    },
                ]} columns={[
                    {
                        field: 'country',
                        type: 'singleSelect',
                        valueOptions: ['United States', 'Germany', 'France'],
                    },
                    {
                        field: 'year',
                        type: 'singleSelect',
                        valueOptions: [
                            { label: 'Year 1974', value: 1974 },
                            { label: 'Year 1984', value: 1984 },
                        ],
                    },
                ]}/>).unmount;
            var values = {
                country: (0, helperFn_1.getColumnValues)(0),
                year: (0, helperFn_1.getColumnValues)(1),
            };
            unmount();
            return values;
        };
        var ALL_ROWS_COUNTRY = ['', '', 'United States', 'Germany'];
        var ALL_ROWS_YEAR = ['', '', 'Year 1974', 'Year 1984'];
        it('should filter with operator "is"', function () {
            // With simple options
            expect(getRows({ field: 'country', operator: 'is', value: 'United States' }).country).to.deep.equal(['United States']);
            expect(getRows({ field: 'country', operator: 'is', value: undefined }).country).to.deep.equal(ALL_ROWS_COUNTRY);
            expect(getRows({ field: 'country', operator: 'is', value: '' }).country).to.deep.equal(ALL_ROWS_COUNTRY);
            // With object options
            expect(getRows({ field: 'year', operator: 'is', value: 1974 }).year).to.deep.equal([
                'Year 1974',
            ]);
            expect(getRows({ field: 'year', operator: 'is', value: undefined }).year).to.deep.equal(ALL_ROWS_YEAR);
            expect(getRows({ field: 'year', operator: 'is', value: '' }).year).to.deep.equal(ALL_ROWS_YEAR);
        });
        it('should filter with operator "not"', function () {
            // With simple options
            expect(getRows({ field: 'country', operator: 'not', value: 'United States' }).country).to.deep.equal(['', '', 'Germany']);
            expect(getRows({ field: 'country', operator: 'not', value: undefined }).country).to.deep.equal(ALL_ROWS_COUNTRY);
            expect(getRows({ field: 'country', operator: 'not', value: '' }).country).to.deep.equal(ALL_ROWS_COUNTRY);
            // With object options
            expect(getRows({ field: 'year', operator: 'not', value: 1974 }).year).to.deep.equal([
                '',
                '',
                'Year 1984',
            ]);
            expect(getRows({ field: 'year', operator: 'not', value: undefined }).year).to.deep.equal(ALL_ROWS_YEAR);
            expect(getRows({ field: 'year', operator: 'not', value: '' }).year).to.deep.equal(ALL_ROWS_YEAR);
        });
        it('should filter with operator "isAnyOf"', function () {
            // With simple options
            expect(getRows({ field: 'country', operator: 'isAnyOf', value: ['United States'] }).country).to.deep.equal(['United States']);
            expect(getRows({ field: 'country', operator: 'isAnyOf', value: [] }).country).to.deep.equal(ALL_ROWS_COUNTRY);
            expect(getRows({ field: 'country', operator: 'isAnyOf', value: undefined }).country).to.deep.equal(ALL_ROWS_COUNTRY);
            // With object options
            expect(getRows({ field: 'year', operator: 'isAnyOf', value: [1974] }).year).to.deep.equal([
                'Year 1974',
            ]);
            expect(getRows({ field: 'year', operator: 'isAnyOf', value: [] }).year).to.deep.equal(ALL_ROWS_YEAR);
            expect(getRows({ field: 'year', operator: 'isAnyOf', value: undefined }).year).to.deep.equal(ALL_ROWS_YEAR);
        });
        it('should support `valueParser`', function () {
            var valueOptions = [
                { value: 'Status 0', label: 'Payment Pending' },
                { value: 'Status 1', label: 'Shipped' },
                { value: 'Status 2', label: 'Delivered' },
            ];
            var setProps = render(<TestCase filterModel={{
                    items: [{ field: 'status', operator: 'is', value: 0 }],
                }} rows={[
                    { id: 0, status: 'Status 0' },
                    { id: 1, status: 'Status 1' },
                    { id: 2, status: 'Status 2' },
                ]} columns={[
                    { field: 'id' },
                    {
                        field: 'status',
                        type: 'singleSelect',
                        valueOptions: valueOptions,
                        valueParser: function (value) {
                            return "Status ".concat(value);
                        },
                    },
                ]}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0']);
            setProps({
                filterModel: {
                    items: [{ field: 'status', operator: 'not', value: 0 }],
                },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1', '2']);
            setProps({
                filterModel: {
                    items: [{ field: 'status', operator: 'isAnyOf', value: [0, 2] }],
                },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '2']);
        });
        it('should support a function for `valueOptions`', function () {
            var setProps = render(<TestCase rows={[
                    { id: 1, name: 'Hair Dryer', voltage: 220 },
                    { id: 2, name: 'Dishwasher', voltage: 110 },
                    { id: 3, name: 'Microwave', voltage: 220 },
                ]} columns={[
                    { field: 'name' },
                    {
                        field: 'voltage',
                        type: 'singleSelect',
                        valueOptions: function (_a) {
                            var row = _a.row;
                            return (row && row.name === 'Dishwasher' ? [110] : [220, 110]);
                        },
                    },
                ]} filterModel={{
                    items: [{ field: 'voltage', operator: 'is' }],
                }}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Hair Dryer', 'Dishwasher', 'Microwave']);
            setProps({
                filterModel: { items: [{ field: 'voltage', operator: 'is', value: 220 }] },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Hair Dryer', 'Microwave']);
        });
        it('should work if valueOptions is not provided', function () {
            var setProps = render(<TestCase rows={[
                    { id: 1, name: 'Hair Dryer', voltage: 220 },
                    { id: 2, name: 'Dishwasher', voltage: 110 },
                    { id: 3, name: 'Microwave', voltage: 220 },
                ]} columns={[{ field: 'name' }, { field: 'voltage', type: 'singleSelect' }]} filterModel={{ items: [{ field: 'voltage', operator: 'is' }] }}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Hair Dryer', 'Dishwasher', 'Microwave']);
            setProps({
                filterModel: { items: [{ field: 'voltage', operator: 'is', value: 220 }] },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Hair Dryer', 'Microwave']);
        });
    });
    describe('toolbar active filter count', function () {
        it('should not include operators with value when the value is empty', function () {
            var getFilterCount = function (item) {
                var unmount = render(<TestCase rows={[]} columns={[
                        { field: 'brand', type: 'string' },
                        { field: 'year', type: 'number' },
                        { field: 'status', type: 'singleSelect' },
                    ]} filterModel={{
                        items: [item],
                    }}/>).unmount;
                var hasNoActiveFilter = internal_test_utils_1.screen.queryByLabelText('0 active filter') == null;
                unmount();
                return hasNoActiveFilter ? 0 : 1;
            };
            expect(getFilterCount({ field: 'brand', operator: 'contains', value: '' })).to.equal(0);
            expect(getFilterCount({ field: 'brand', operator: 'contains', value: undefined })).to.equal(0);
            expect(getFilterCount({ field: 'brand', operator: 'isAnyOf', value: [] })).to.equal(0);
            expect(getFilterCount({ field: 'year', operator: '=', value: undefined })).to.equal(0);
            expect(getFilterCount({ field: 'year', operator: '=', value: '' })).to.equal(0);
        });
        it('should include value-less operators', function () {
            render(<TestCase rows={[]} columns={[{ field: 'brand', type: 'string' }]} filterModel={{
                    items: [
                        {
                            field: 'brand',
                            operator: 'isNotEmpty',
                        },
                    ],
                }}/>);
            expect(internal_test_utils_1.screen.queryByLabelText('1 active filter')).not.to.equal(null);
        });
    });
    describe('filter button tooltip', function () {
        it('should display `falsy` value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, setProps, user, filterButton, tooltip;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render(<x_data_grid_1.DataGrid filterModel={{
                                items: [{ id: 0, field: 'isAdmin', operator: 'is', value: false }],
                            }} autoHeight rows={[
                                {
                                    id: 0,
                                    isAdmin: false,
                                    level: 0,
                                },
                            ]} columns={[
                                {
                                    field: 'isAdmin',
                                    type: 'singleSelect',
                                    valueOptions: [
                                        {
                                            value: false,
                                            label: false,
                                        },
                                    ],
                                },
                                {
                                    field: 'level',
                                    type: 'number',
                                },
                            ]} slots={{ toolbar: x_data_grid_1.GridToolbarFilterButton }} showToolbar/>), setProps = _a.setProps, user = _a.user;
                        filterButton = document.querySelector('button[aria-label="Show filters"]');
                        expect(internal_test_utils_1.screen.queryByRole('tooltip')).to.equal(null);
                        return [4 /*yield*/, user.hover(filterButton)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.queryByRole('tooltip')).not.to.equal(null);
                            }, {
                                timeout: 2000,
                            })];
                    case 2:
                        _b.sent();
                        tooltip = internal_test_utils_1.screen.getByRole('tooltip');
                        expect(tooltip).toBeVisible();
                        expect(tooltip.textContent).to.contain('false');
                        setProps({ filterModel: { items: [{ id: 0, field: 'level', operator: '=', value: 0 }] } });
                        expect(tooltip.textContent).to.contain('0');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('custom `filterOperators`', function () {
        it('should allow to customize filter tooltip using `filterOperator.getValueAsString`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, filterButton, tooltip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: '100%', height: '400px' }}>
          <x_data_grid_1.DataGrid filterModel={{
                                items: [{ field: 'name', operator: 'contains', value: 'John' }],
                            }} rows={[
                                {
                                    id: 0,
                                    name: 'John Doe',
                                },
                                {
                                    id: 1,
                                    name: 'Mike Smith',
                                },
                            ]} columns={[
                                {
                                    field: 'name',
                                    type: 'string',
                                    filterOperators: [
                                        {
                                            label: 'Contains',
                                            value: 'contains',
                                            getApplyFilterFn: function (filterItem) {
                                                return function (value) {
                                                    if (!filterItem.field ||
                                                        !filterItem.value ||
                                                        !filterItem.operator ||
                                                        !value) {
                                                        return null;
                                                    }
                                                    return value.includes(filterItem.value);
                                                };
                                            },
                                            getValueAsString: function (value) { return "\"".concat(value, "\" text string"); },
                                        },
                                    ],
                                },
                            ]} slots={{ toolbar: x_data_grid_1.GridToolbarFilterButton }} showToolbar/>
        </div>).user;
                        filterButton = document.querySelector('button[aria-label="Show filters"]');
                        expect(internal_test_utils_1.screen.queryByRole('tooltip')).to.equal(null);
                        return [4 /*yield*/, user.hover(filterButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.queryByRole('tooltip')).not.to.equal(null);
                            })];
                    case 2:
                        _a.sent();
                        tooltip = internal_test_utils_1.screen.getByRole('tooltip');
                        expect(tooltip).toBeVisible();
                        expect(tooltip.textContent).to.contain('"John" text string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should translate operators dynamically in toolbar without crashing ', function () {
        expect(function () {
            return (<div style={{ height: 400, width: '100%' }}>
          <x_data_grid_1.DataGrid rows={[
                    {
                        id: 1,
                        quantity: 1,
                    },
                ]} columns={[{ field: 'quantity', type: 'number', width: 150 }]} filterModel={{
                    items: [
                        {
                            field: 'quantity',
                            id: 1619547587572,
                            operator: '=',
                            value: '1',
                        },
                    ],
                }} showToolbar/>
        </div>);
        }).not.to.throw();
    });
    it('should update the filter model on columns change', function () {
        var columns = [{ field: 'id' }, { field: 'brand' }];
        var rows = [
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
        ];
        var onFilterModelChange = (0, sinon_1.spy)();
        function Demo(props) {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid autoHeight={skipIf_1.isJSDOM} columns={columns} filterModel={{
                    items: [{ field: 'brand', operator: 'equals', value: 'Puma' }],
                }} onFilterModelChange={onFilterModelChange} {...props}/>
        </div>);
        }
        var setProps = render(<Demo rows={rows}/>).setProps;
        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Puma']);
        setProps({ columns: [{ field: 'id' }] });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2']);
        expect(onFilterModelChange.callCount).to.equal(2);
        expect(onFilterModelChange.lastCall.firstArg).to.deep.equal({ items: [] });
    });
    // See https://github.com/mui/mui-x/issues/9204
    it('should not clear the filter model when both columns and filterModel change', function () { return __awaiter(void 0, void 0, void 0, function () {
        function Demo(props) {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid autoHeight={skipIf_1.isJSDOM} columns={columns} filterModel={{
                    items: [{ field: 'brand', operator: 'equals', value: 'Puma' }],
                }} onFilterModelChange={onFilterModelChange} {...props}/>
        </div>);
        }
        var columns, rows, onFilterModelChange, setProps;
        return __generator(this, function (_a) {
            columns = [{ field: 'id' }, { field: 'brand' }];
            rows = [
                { id: 0, brand: 'Nike' },
                { id: 1, brand: 'Adidas' },
                { id: 2, brand: 'Puma' },
            ];
            onFilterModelChange = (0, sinon_1.spy)();
            setProps = render(<Demo rows={rows}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Puma']);
            setProps({
                columns: [{ field: 'id' }],
                filterModel: {
                    items: [{ field: 'id', operator: 'equals', value: '1' }],
                },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            expect(onFilterModelChange.callCount).to.equal(0);
            return [2 /*return*/];
        });
    }); });
});
