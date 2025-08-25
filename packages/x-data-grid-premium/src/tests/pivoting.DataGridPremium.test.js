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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var helperFn_1 = require("test/utils/helperFn");
var ROWS = [
    {
        id: 1,
        date: '2024-03-15',
        ticker: 'AAPL',
        price: 192.45,
        volume: 5500,
        type: 'stock',
    },
    {
        id: 2,
        date: '2024-03-16',
        ticker: 'GOOGL',
        price: 125.67,
        volume: 3200,
        type: 'stock',
    },
    {
        id: 3,
        date: '2024-03-17',
        ticker: 'MSFT',
        price: 345.22,
        volume: 4100,
        type: 'stock',
    },
    {
        id: 4,
        date: '2023-03-18',
        ticker: 'AAPL',
        price: 193.1,
        volume: 6700,
        type: 'stock',
    },
    {
        id: 5,
        date: '2024-03-19',
        ticker: 'AMZN',
        price: 145.33,
        volume: 2900,
        type: 'stock',
    },
    {
        id: 6,
        date: '2024-03-20',
        ticker: 'GOOGL',
        price: 126.45,
        volume: 3600,
        type: 'stock',
    },
    {
        id: 7,
        date: '2024-03-21',
        ticker: 'US_TREASURY_2Y',
        price: 98.75,
        volume: 1000,
        type: 'bond',
    },
    {
        id: 8,
        date: '2024-03-22',
        ticker: 'MSFT',
        price: 347.89,
        volume: 4500,
        type: 'stock',
    },
    {
        id: 9,
        date: '2024-03-23',
        ticker: 'US_TREASURY_10Y',
        price: 95.6,
        volume: 750,
        type: 'bond',
    },
    {
        id: 10,
        date: '2024-03-24',
        ticker: 'AMZN',
        price: 146.22,
        volume: 3100,
        type: 'stock',
    },
];
var COLUMNS = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'date',
        type: 'date',
        headerName: 'Date',
        valueGetter: function (value) { return new Date(value); },
        // Avoid the localization of the date to simplify the checks
        valueFormatter: function (value) {
            if (value == null) {
                return '';
            }
            return value.toLocaleDateString('en-GB');
        },
    },
    { field: 'ticker', headerName: 'Ticker' },
    {
        field: 'price',
        type: 'number',
        headerName: 'Price',
        valueFormatter: function (value) { return (value ? "$".concat(value.toFixed(2)) : null); },
    },
    { field: 'volume', type: 'number', headerName: 'Volume' },
    {
        field: 'type',
        type: 'singleSelect',
        valueOptions: ['stock', 'bond'],
        headerName: 'Type',
    },
];
describe('<DataGridPremium /> - Pivoting', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function Test(props) {
        return (<div style={{ height: 600, width: 600 }}>
        <x_data_grid_premium_1.DataGridPremium rows={ROWS} columns={COLUMNS} showToolbar cellSelection {...props}/>
      </div>);
    }
    it('should pivot the data without pivot columns', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, pivotButton, pivotSwitch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<Test initialState={{
                            pivoting: {
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [],
                                    values: [{ field: 'volume', aggFunc: 'sum' }],
                                },
                            },
                        }}/>).user;
                    pivotButton = internal_test_utils_1.screen.getByRole('button', { name: 'Pivot' });
                    return [4 /*yield*/, user.click(pivotButton)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            internal_test_utils_1.screen.getByRole('switch', { name: 'Pivot' });
                        })];
                case 2:
                    _a.sent();
                    pivotSwitch = internal_test_utils_1.screen.getByRole('switch', { name: 'Pivot' });
                    if (!!pivotSwitch.checked) return [3 /*break*/, 5];
                    return [4 /*yield*/, user.click(pivotSwitch)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(pivotSwitch).to.have.property('checked', true);
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '12,200']);
                    expect((0, helperFn_1.getRowValues)(1)).to.deep.equal(['GOOGL (2)', '6,800']);
                    expect((0, helperFn_1.getRowValues)(2)).to.deep.equal(['MSFT (2)', '8,600']);
                    expect((0, helperFn_1.getRowValues)(3)).to.deep.equal(['AMZN (2)', '6,000']);
                    expect((0, helperFn_1.getRowValues)(4)).to.deep.equal(['US_TREASURY_2Y (1)', '1,000']);
                    expect((0, helperFn_1.getRowValues)(5)).to.deep.equal(['US_TREASURY_10Y (1)', '750']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should pivot the data with 2 pivot values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, pivotButton, pivotSwitch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<Test initialState={{
                            pivoting: {
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [],
                                    values: [
                                        { field: 'volume', aggFunc: 'sum' },
                                        { field: 'price', aggFunc: 'avg' },
                                    ],
                                },
                            },
                        }}/>).user;
                    pivotButton = internal_test_utils_1.screen.getByRole('button', { name: 'Pivot' });
                    return [4 /*yield*/, user.click(pivotButton)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            internal_test_utils_1.screen.getByRole('switch', { name: 'Pivot' });
                        })];
                case 2:
                    _a.sent();
                    pivotSwitch = internal_test_utils_1.screen.getByRole('switch', { name: 'Pivot' });
                    if (!!pivotSwitch.checked) return [3 /*break*/, 5];
                    return [4 /*yield*/, user.click(pivotSwitch)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(pivotSwitch).to.have.property('checked', true);
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '12,200', '$192.77']);
                    expect((0, helperFn_1.getRowValues)(1)).to.deep.equal(['GOOGL (2)', '6,800', '$126.06']);
                    expect((0, helperFn_1.getRowValues)(2)).to.deep.equal(['MSFT (2)', '8,600', '$346.56']);
                    expect((0, helperFn_1.getRowValues)(3)).to.deep.equal(['AMZN (2)', '6,000', '$145.78']);
                    expect((0, helperFn_1.getRowValues)(4)).to.deep.equal(['US_TREASURY_2Y (1)', '1,000', '$98.75']);
                    expect((0, helperFn_1.getRowValues)(5)).to.deep.equal(['US_TREASURY_10Y (1)', '750', '$95.60']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should pivot the data with a pivot column and 2 pivot values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, pivotButton, pivotSwitch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<Test initialState={{
                            pivoting: {
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [{ field: 'date-year' }],
                                    values: [
                                        { field: 'price', aggFunc: 'avg' },
                                        { field: 'volume', aggFunc: 'sum' },
                                    ],
                                },
                            },
                        }}/>).user;
                    pivotButton = internal_test_utils_1.screen.getByRole('button', { name: 'Pivot' });
                    return [4 /*yield*/, user.click(pivotButton)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            internal_test_utils_1.screen.getByRole('switch', { name: 'Pivot' });
                        })];
                case 2:
                    _a.sent();
                    pivotSwitch = internal_test_utils_1.screen.getByRole('switch', { name: 'Pivot' });
                    if (!!pivotSwitch.checked) return [3 /*break*/, 5];
                    return [4 /*yield*/, user.click(pivotSwitch)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(pivotSwitch).to.have.property('checked', true);
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '$192.45', '5,500', '$193.10', '6,700']);
                    expect((0, helperFn_1.getRowValues)(1)).to.deep.equal(['GOOGL (2)', '$126.06', '6,800', '', '']);
                    expect((0, helperFn_1.getRowValues)(2)).to.deep.equal(['MSFT (2)', '$346.56', '8,600', '', '']);
                    expect((0, helperFn_1.getRowValues)(3)).to.deep.equal(['AMZN (2)', '$145.78', '6,000', '', '']);
                    expect((0, helperFn_1.getRowValues)(4)).to.deep.equal(['US_TREASURY_2Y (1)', '$98.75', '1,000', '', '']);
                    expect((0, helperFn_1.getRowValues)(5)).to.deep.equal(['US_TREASURY_10Y (1)', '$95.60', '750', '', '']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should render in pivot mode when mounted with pivoting enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<Test initialState={{
                            pivoting: {
                                enabled: true,
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [{ field: 'date-year' }],
                                    values: [
                                        { field: 'price', aggFunc: 'avg' },
                                        { field: 'volume', aggFunc: 'sum' },
                                    ],
                                },
                            },
                        }}/>);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '$192.45', '5,500', '$193.10', '6,700']);
                        })];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getRowValues)(1)).to.deep.equal(['GOOGL (2)', '$126.06', '6,800', '', '']);
                    expect((0, helperFn_1.getRowValues)(2)).to.deep.equal(['MSFT (2)', '$346.56', '8,600', '', '']);
                    expect((0, helperFn_1.getRowValues)(3)).to.deep.equal(['AMZN (2)', '$145.78', '6,000', '', '']);
                    expect((0, helperFn_1.getRowValues)(4)).to.deep.equal(['US_TREASURY_2Y (1)', '$98.75', '1,000', '', '']);
                    expect((0, helperFn_1.getRowValues)(5)).to.deep.equal(['US_TREASURY_10Y (1)', '$95.60', '750', '', '']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should render in pivot mode when mounted with pivoting enabled and async data loading', function () { return __awaiter(void 0, void 0, void 0, function () {
        function Component(_a) {
            var loading = _a.loading, rows = _a.rows;
            return (<Test loading={loading} rows={rows} initialState={{
                    pivoting: {
                        enabled: true,
                        model: {
                            rows: [{ field: 'ticker' }],
                            columns: [{ field: 'date-year' }],
                            values: [
                                { field: 'price', aggFunc: 'avg' },
                                { field: 'volume', aggFunc: 'sum' },
                            ],
                        },
                    },
                }}/>);
        }
        var setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProps = render(<Component loading rows={[]}/>).setProps;
                    return [4 /*yield*/, (0, helperFn_1.sleep)(500)];
                case 1:
                    _a.sent();
                    setProps({ loading: false, rows: ROWS });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '$192.45', '5,500', '$193.10', '6,700']);
                        })];
                case 2:
                    _a.sent();
                    expect((0, helperFn_1.getRowValues)(1)).to.deep.equal(['GOOGL (2)', '$126.06', '6,800', '', '']);
                    expect((0, helperFn_1.getRowValues)(2)).to.deep.equal(['MSFT (2)', '$346.56', '8,600', '', '']);
                    expect((0, helperFn_1.getRowValues)(3)).to.deep.equal(['AMZN (2)', '$145.78', '6,000', '', '']);
                    expect((0, helperFn_1.getRowValues)(4)).to.deep.equal(['US_TREASURY_2Y (1)', '$98.75', '1,000', '', '']);
                    expect((0, helperFn_1.getRowValues)(5)).to.deep.equal(['US_TREASURY_10Y (1)', '$95.60', '750', '', '']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should render column groups with empty columns when there are no pivot values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var yearHeaders, typeHeaders;
        return __generator(this, function (_a) {
            render(<Test initialState={{
                    pivoting: {
                        enabled: true,
                        model: {
                            rows: [],
                            columns: [{ field: 'date-year' }, { field: 'type' }],
                            values: [], // No pivot values
                        },
                    },
                }}/>);
            yearHeaders = document.querySelectorAll('[aria-rowindex="1"] [role="columnheader"]');
            typeHeaders = document.querySelectorAll('[aria-rowindex="2"] [role="columnheader"]');
            expect(Array.from(yearHeaders).map(function (header) { return header.textContent; })).to.deep.equal([
                '2024',
                '2023',
            ]);
            expect(Array.from(typeHeaders).map(function (header) { return header.textContent; })).to.deep.equal([
                'stock',
                'bond',
                'stock',
            ]);
            return [2 /*return*/];
        });
    }); });
    it('should render "empty pivot overlay" when pivot mode is enabled but no rows are defined', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            render(<Test initialState={{
                    pivoting: {
                        enabled: true,
                        model: {
                            rows: [],
                            columns: [],
                            values: [],
                        },
                    },
                }}/>);
            expect(internal_test_utils_1.screen.getByText('Add fields to rows, columns, and values to create a pivot table')).not.to.equal(null);
            return [2 /*return*/];
        });
    }); });
    it('should not render "empty pivot overlay" when pivot mode is enabled and there are rows', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            render(<Test initialState={{
                    pivoting: {
                        enabled: true,
                        model: {
                            rows: [{ field: 'ticker' }],
                            columns: [],
                            values: [],
                        },
                    },
                }}/>);
            expect(internal_test_utils_1.screen.queryByText('Add fields to rows, columns, and values to create a pivot table')).to.equal(null);
            return [2 /*return*/];
        });
    }); });
    it('should not throw when a field is moved from pivot values to pivot rows', function () { return __awaiter(void 0, void 0, void 0, function () {
        function Component(_a) {
            var pivotModel = _a.pivotModel;
            return (<Test initialState={{
                    pivoting: {
                        panelOpen: true,
                        enabled: true,
                    },
                }} pivotModel={pivotModel}/>);
        }
        var setProps;
        return __generator(this, function (_a) {
            setProps = render(<Component pivotModel={{
                    rows: [],
                    columns: [],
                    values: [{ field: 'date-year', aggFunc: 'size' }],
                }}/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Date (Year)size']);
            expect((0, helperFn_1.getColumnValues)(0)).to.have.length(0);
            setProps({
                pivotModel: {
                    rows: [{ field: 'date-year' }],
                    columns: [],
                    values: [],
                },
            });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Date (Year)']);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['2024 (9)', '2023 (1)']);
            return [2 /*return*/];
        });
    }); });
    it('should allow to filter rows in pivot mode using original columns', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, columnSelector, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<Test initialState={{
                            pivoting: {
                                enabled: true,
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [{ field: 'date-year' }],
                                    values: [
                                        { field: 'price', aggFunc: 'avg' },
                                        { field: 'volume', aggFunc: 'sum' },
                                    ],
                                },
                            },
                        }}/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Filters' }))];
                case 1:
                    _a.sent();
                    columnSelector = internal_test_utils_1.screen.getByRole('combobox', { name: 'Columns' });
                    return [4 /*yield*/, user.click(columnSelector)];
                case 2:
                    _a.sent();
                    options = internal_test_utils_1.screen.getAllByRole('option').map(function (option) { return option.textContent; });
                    expect(options).to.deep.equal([
                        'ID',
                        'Date',
                        'Date (Year)',
                        'Date (Quarter)',
                        'Ticker',
                        'Type',
                        'Price',
                        'Volume',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should support derived columns as pivot values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var derivedColumn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    derivedColumn = {
                        field: 'total',
                        type: 'number',
                        valueGetter: function (value, row) {
                            return row.price * row.volume;
                        },
                    };
                    render(<Test columns={COLUMNS.concat(derivedColumn)} rows={ROWS.slice(0, 4)} initialState={{
                            pivoting: {
                                enabled: true,
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [{ field: 'date-year' }],
                                    values: [{ field: 'total', aggFunc: 'sum' }],
                                },
                            },
                        }}/>);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '1,058,475', '1,293,770']);
                        })];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getRowValues)(1)).to.deep.equal(['GOOGL (1)', '402,144', '']);
                    expect((0, helperFn_1.getRowValues)(2)).to.deep.equal(['MSFT (1)', '1,415,402', '']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update available fields when new column is added', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setProps, getAvailableFields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProps = render(<Test initialState={{
                            pivoting: {
                                enabled: true,
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [{ field: 'date-year' }],
                                    values: [{ field: 'volume', aggFunc: 'sum' }],
                                },
                                panelOpen: true,
                            },
                        }}/>).setProps;
                    getAvailableFields = function () {
                        return Array.from(document.querySelectorAll('.MuiDataGrid-pivotPanelAvailableFields .MuiDataGrid-pivotPanelField')).map(function (field) { return field.textContent; });
                    };
                    setProps({
                        columns: COLUMNS.concat({
                            field: 'total',
                            type: 'number',
                            headerName: 'Total',
                            valueGetter: function (value, row) {
                                return row.price * row.volume;
                            },
                        }),
                    });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(getAvailableFields()).to.deep.equal([
                                'ID',
                                'Date',
                                'Date (Quarter)',
                                'Price',
                                'Type',
                                'Total',
                            ]);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update available fields when a column is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setProps, getAvailableFields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProps = render(<Test initialState={{
                            pivoting: {
                                enabled: true,
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [{ field: 'date-year' }],
                                    values: [{ field: 'volume', aggFunc: 'sum' }],
                                },
                                panelOpen: true,
                            },
                        }}/>).setProps;
                    getAvailableFields = function () {
                        return Array.from(document.querySelectorAll('.MuiDataGrid-pivotPanelAvailableFields .MuiDataGrid-pivotPanelField')).map(function (field) { return field.textContent; });
                    };
                    setProps({
                        columns: COLUMNS.filter(function (col) { return col.field !== 'date'; }),
                    });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(getAvailableFields()).to.deep.equal(['ID', 'Price', 'Type']);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should recalculate pivot values when a row is updated while in pivot mode', function () { return __awaiter(void 0, void 0, void 0, function () {
        var apiRef, setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiRef = { current: null };
                    setProps = render(<Test apiRef={apiRef} initialState={{
                            pivoting: {
                                enabled: true,
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [],
                                    values: [{ field: 'volume', aggFunc: 'sum' }],
                                },
                            },
                        }}/>).setProps;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '12,200']);
                        })];
                case 1:
                    _a.sent();
                    (0, internal_test_utils_1.act)(function () {
                        var _a;
                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([__assign(__assign({}, ROWS[0]), { volume: 6000 })]);
                    });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '12,700']);
                        })];
                case 2:
                    _a.sent();
                    setProps({ pivotActive: false });
                    // The row should keep the updated volume after disabling pivot mode
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal([
                                '1',
                                '15/03/2024',
                                'AAPL',
                                '$192.45',
                                '6,000',
                                'stock',
                            ]);
                        })];
                case 3:
                    // The row should keep the updated volume after disabling pivot mode
                    _a.sent();
                    setProps({ pivotActive: true });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '12,700']);
                        })];
                case 4:
                    _a.sent();
                    (0, internal_test_utils_1.act)(function () {
                        var _a;
                        // Remove the first row
                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRows(ROWS.slice(1));
                    });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(2)).to.deep.equal(['AAPL (1)', '6,700']);
                        })];
                case 5:
                    _a.sent();
                    expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['GOOGL (2)', '6,800']);
                    setProps({ pivotActive: false });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal([
                                '2',
                                '16/03/2024',
                                'GOOGL',
                                '$125.67',
                                '3,200',
                                'stock',
                            ]);
                        })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not throw if the ID column is used as a value', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<Test initialState={{
                            pivoting: {
                                enabled: true,
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [{ field: 'date-year' }],
                                    values: [{ field: 'id', aggFunc: 'size' }],
                                },
                            },
                        }}/>);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '1', '1']);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not revert prior edits when pivot mode is disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var columns, _a, setProps, user, cell;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    columns = COLUMNS.map(function (col) {
                        if (col.field === 'ticker') {
                            return __assign(__assign({}, col), { editable: true });
                        }
                        return col;
                    });
                    _a = render(<Test columns={columns} initialState={{
                            pivoting: {
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [],
                                    values: [{ field: 'volume', aggFunc: 'sum' }],
                                },
                            },
                        }}/>), setProps = _a.setProps, user = _a.user;
                    cell = (0, helperFn_1.getCell)(0, 2);
                    return [4 /*yield*/, user.dblClick(cell)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, user.keyboard('[Backspace>4]BRKB')];
                case 2:
                    _b.sent();
                    // await user.keyboard('{Enter}'); // This kept showing act warning in karma, so I used click instead
                    return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 2))];
                case 3:
                    // await user.keyboard('{Enter}'); // This kept showing act warning in karma, so I used click instead
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal([
                                '1',
                                '15/03/2024',
                                'BRKB',
                                '$192.45',
                                '5,500',
                                'stock',
                            ]);
                        })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                setProps({ pivotActive: true });
                                return [2 /*return*/];
                            });
                        }); })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['BRKB (1)', '5,500']);
                        })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                setProps({ pivotActive: false });
                                return [2 /*return*/];
                            });
                        }); })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['1', '15/03/2024', 'BRKB', '$192.45', '5,500', 'stock'], 'The value should not revert to the original value');
                        })];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should recalculate pivot values when `rows` prop changes while in pivot mode', function () { return __awaiter(void 0, void 0, void 0, function () {
        var apiRef, rowsProp, setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiRef = { current: null };
                    rowsProp = ROWS;
                    setProps = render(<Test apiRef={apiRef} initialState={{
                            pivoting: {
                                enabled: true,
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [],
                                    values: [{ field: 'volume', aggFunc: 'sum' }],
                                },
                            },
                        }}/>).setProps;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '12,200']);
                        })];
                case 1:
                    _a.sent();
                    rowsProp = ROWS.map(function (row, index) {
                        if (index === 0) {
                            return __assign(__assign({}, row), { volume: 6000 });
                        }
                        return row;
                    });
                    setProps({ rows: rowsProp });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '12,700']);
                        })];
                case 2:
                    _a.sent();
                    setProps({ rows: rowsProp, pivotActive: false });
                    // The row should keep the updated volume after disabling pivot mode
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal([
                                '1',
                                '15/03/2024',
                                'AAPL',
                                '$192.45',
                                '6,000',
                                'stock',
                            ]);
                        })];
                case 3:
                    // The row should keep the updated volume after disabling pivot mode
                    _a.sent();
                    setProps({ rows: rowsProp, pivotActive: true });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['AAPL (2)', '12,700']);
                        })];
                case 4:
                    _a.sent();
                    rowsProp = ROWS.slice(1);
                    setProps({ rows: rowsProp });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(2)).to.deep.equal(['AAPL (1)', '6,700']);
                        })];
                case 5:
                    _a.sent();
                    expect((0, helperFn_1.getRowValues)(0)).to.deep.equal(['GOOGL (2)', '6,800']);
                    setProps({ rows: rowsProp, pivotActive: false });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getRowValues)(0)).to.deep.equal([
                                '2',
                                '16/03/2024',
                                'GOOGL',
                                '$125.67',
                                '3,200',
                                'stock',
                            ]);
                        })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should work with complex singleSelect values as pivot columns', function () { return __awaiter(void 0, void 0, void 0, function () {
        var apiRef, columns, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiRef = { current: null };
                    columns = [
                        { field: 'id', headerName: 'ID' },
                        { field: 'ticker' },
                        {
                            field: 'country',
                            type: 'singleSelect',
                            valueOptions: [
                                { countryName: 'France', value: 'FR' },
                                { countryName: 'Germany', value: 'DE' },
                                { countryName: 'Italy', value: 'IT' },
                            ],
                            getOptionLabel: function (option) { return option.countryName; },
                        },
                    ];
                    rows = [
                        { id: 1, ticker: 'FR1', country: { countryName: 'France', value: 'FR' } },
                        { id: 2, ticker: 'DE2', country: { countryName: 'Germany', value: 'DE' } },
                        { id: 3, ticker: 'IT3', country: { countryName: 'Italy', value: 'IT' } },
                    ];
                    render(<div style={{ height: 600, width: 600 }}>
        <x_data_grid_premium_1.DataGridPremium rows={rows} columns={columns} showToolbar cellSelection apiRef={apiRef} initialState={{
                            pivoting: {
                                enabled: true,
                                model: {
                                    rows: [{ field: 'ticker' }],
                                    columns: [{ field: 'country' }],
                                    values: [{ field: 'id', aggFunc: 'size' }],
                                },
                            },
                        }}/>
      </div>);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                                '',
                                'France',
                                'Germany',
                                'Italy',
                                'ticker',
                                'IDsize',
                                'IDsize',
                                'IDsize',
                            ]);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
