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
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var exceljs_1 = require("exceljs");
var helperFn_1 = require("test/utils/helperFn");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
describe('<DataGridPremium /> - Export Excel', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    var columns = [{ field: 'id' }, { field: 'brand', headerName: 'Brand' }];
    var rows = [
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
    ];
    var baselineProps = {
        columns: columns,
        rows: rows,
        autoHeight: isJSDOM,
    };
    function TestCaseExcelExport(props) {
        apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_premium_1.DataGridPremium {...baselineProps} apiRef={apiRef} {...props}/>
      </div>);
    }
    describe('export interface', function () {
        it('should generate a file', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<TestCaseExcelExport />);
                        _a = expect;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getDataAsExcel(); })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should display export option', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCaseExcelExport showToolbar/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Export' }))];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Download as Excel' })).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('generated file', function () {
        it("should export column with correct type", function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test() {
                apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium columns={[
                        { field: 'str' },
                        { field: 'nb', type: 'number' },
                        { field: 'day', type: 'date' },
                        { field: 'hour', type: 'dateTime' },
                        { field: 'bool', type: 'boolean' },
                        { field: 'option', type: 'singleSelect', valueOptions: ['Yes', 'No'] },
                    ]} rows={[
                        {
                            id: 1,
                            str: 'test',
                            nb: 5,
                            day: new Date('01-01-2022'),
                            hour: new Date('01-01-2022'),
                            bool: false,
                            option: 'Yes',
                        },
                    ]} apiRef={apiRef}/>
          </div>);
            }
            var workbook, worksheet;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<Test />);
                        return [4 /*yield*/, ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getDataAsExcel())];
                    case 1:
                        workbook = _b.sent();
                        worksheet = workbook.worksheets[0];
                        expect(worksheet.getCell('A1').value).to.equal('str');
                        expect(typeof worksheet.getCell('A2').value).to.equal('string');
                        expect(worksheet.getCell('B1').value).to.equal('nb');
                        expect(typeof worksheet.getCell('B2').value).to.equal('number');
                        expect(worksheet.getCell('C1').value).to.equal('day');
                        expect(typeof worksheet.getCell('C2').value).to.equal('object');
                        expect(worksheet.getCell('C2').value instanceof Date).to.equal(true);
                        expect(worksheet.getCell('D1').value).to.equal('hour');
                        expect(typeof worksheet.getCell('D2').value).to.equal('object');
                        expect(worksheet.getCell('D2').value instanceof Date).to.equal(true);
                        expect(worksheet.getCell('E1').value).to.equal('bool');
                        expect(typeof worksheet.getCell('E2').value).to.equal('boolean');
                        expect(worksheet.getCell('F1').value).to.equal('option');
                        expect(typeof worksheet.getCell('F2').value).to.equal('string');
                        return [2 /*return*/];
                }
            });
        }); });
        it("should export singleSelect options", function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test() {
                apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium columns={[{ field: 'option', type: 'singleSelect', valueOptions: ['Yes', 'No'] }]} rows={[
                        {
                            id: 1,
                            option: 'Yes',
                        },
                    ]} apiRef={apiRef}/>
          </div>);
            }
            var workbook, worksheet;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<Test />);
                        return [4 /*yield*/, ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getDataAsExcel())];
                    case 1:
                        workbook = _b.sent();
                        worksheet = workbook.worksheets[0];
                        expect(worksheet.getCell('A1').value).to.equal('option');
                        expect(worksheet.getCell('A2').value).to.equal('Yes');
                        expect(worksheet.getCell('A2').dataValidation.formulae).to.deep.equal(['Options!$A$2:$A$3']);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should not export actions columns", function () { return __awaiter(void 0, void 0, void 0, function () {
            function Icon() {
                return <span>i</span>;
            }
            function Test() {
                apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium columns={[
                        { field: 'str' },
                        {
                            field: 'actions',
                            type: 'actions',
                            getActions: function () { return [
                                <x_data_grid_premium_1.GridActionsCellItem icon={<Icon />} onClick={undefined} label="Delete"/>,
                            ]; },
                        },
                    ]} rows={[
                        {
                            id: 1,
                            str: 'test',
                        },
                    ]} apiRef={apiRef}/>
          </div>);
            }
            var workbook, worksheet;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<Test />);
                        return [4 /*yield*/, ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getDataAsExcel())];
                    case 1:
                        workbook = _b.sent();
                        worksheet = workbook.worksheets[0];
                        expect(worksheet.getCell('A1').value).to.equal('str');
                        expect(worksheet.getCell('A2').value).to.equal('test');
                        expect(worksheet.getCell('B1').value).to.equal(null);
                        expect(worksheet.getCell('B2').value).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should merge cells with `colSpan`', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test() {
                apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 200 }}>
            <x_data_grid_premium_1.DataGridPremium columns={[
                        { field: 'id' },
                        { field: 'col1', colSpan: 2 },
                        { field: 'col2' },
                        { field: 'col3', colSpan: 3 },
                        { field: 'col4' },
                        { field: 'col5' },
                    ]} rows={[
                        { id: 1, col1: '1-1', col2: '1-2', col3: '1-3', col4: '1-4', col5: '1-5' },
                        { id: 2, col1: '2-1', col2: '2-2', col3: '2-3', col4: '2-4', col5: '2-5' },
                        { id: 3, col1: '3-1', col2: '3-2', col3: '3-3', col4: '3-4', col5: '3-5' },
                        { id: 4, col1: '4-1', col2: '4-2', col3: '4-3', col4: '4-4', col5: '4-5' },
                        { id: 5, col1: '5-1', col2: '5-2', col3: '5-3', col4: '5-4', col5: '5-5' },
                        { id: 6, col1: '6-1', col2: '6-2', col3: '6-3', col4: '6-4', col5: '6-5' },
                    ]} apiRef={apiRef}/>
          </div>);
            }
            var workbook, worksheet, firstRow, lastRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<Test />);
                        workbook = null;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getDataAsExcel())];
                                        case 1:
                                            workbook = _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        worksheet = workbook.worksheets[0];
                        firstRow = worksheet.getRow(2);
                        expect(firstRow.getCell(2).value).to.equal('1-1');
                        expect(firstRow.getCell(2).type).to.equal(exceljs_1.default.ValueType.String);
                        expect(firstRow.getCell(3).type).to.equal(exceljs_1.default.ValueType.Merge);
                        expect(firstRow.getCell(4).value).to.equal('1-3');
                        expect(firstRow.getCell(4).type).to.equal(exceljs_1.default.ValueType.String);
                        expect(firstRow.getCell(5).type).to.equal(exceljs_1.default.ValueType.Merge);
                        expect(firstRow.getCell(6).type).to.equal(exceljs_1.default.ValueType.Merge);
                        lastRow = worksheet.getRow(worksheet.rowCount);
                        expect(lastRow.getCell(2).value).to.equal('6-1');
                        expect(lastRow.getCell(2).type).to.equal(exceljs_1.default.ValueType.String);
                        expect(lastRow.getCell(3).type).to.equal(exceljs_1.default.ValueType.Merge);
                        expect(lastRow.getCell(4).value).to.equal('6-3');
                        expect(lastRow.getCell(4).type).to.equal(exceljs_1.default.ValueType.String);
                        expect(lastRow.getCell(5).type).to.equal(exceljs_1.default.ValueType.Merge);
                        expect(lastRow.getCell(6).type).to.equal(exceljs_1.default.ValueType.Merge);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should export hidden columns when `allColumns=true`', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test() {
                apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 200 }}>
            <x_data_grid_premium_1.DataGridPremium columns={[{ field: 'id' }, { field: 'col1' }, { field: 'col2' }, { field: 'col3' }]} rows={[
                        { id: 1, col1: '1-1', col2: '1-2', col3: '1-3' },
                        { id: 2, col1: '2-1', col2: '2-2', col3: '2-3' },
                        { id: 3, col1: '3-1', col2: '3-2', col3: '3-3' },
                        { id: 4, col1: '4-1', col2: '4-2', col3: '4-3' },
                        { id: 5, col1: '5-1', col2: '5-2', col3: '5-3' },
                        { id: 6, col1: '6-1', col2: '6-2', col3: '6-3' },
                    ]} apiRef={apiRef} initialState={{
                        columns: {
                            columnVisibilityModel: {
                                col2: false,
                                col3: false,
                            },
                        },
                    }}/>
          </div>);
            }
            var workbook, worksheet, headerRow;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<Test />);
                        return [4 /*yield*/, ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getDataAsExcel({
                                allColumns: true,
                            }))];
                    case 1:
                        workbook = _b.sent();
                        worksheet = workbook.worksheets[0];
                        headerRow = worksheet.getRow(1);
                        expect(headerRow.getCell(1).value).to.equal('id');
                        expect(headerRow.getCell(2).value).to.equal('col1');
                        expect(headerRow.getCell(3).value).to.equal('col2');
                        expect(headerRow.getCell(4).value).to.equal('col3');
                        return [2 /*return*/];
                }
            });
        }); });
        it("should export column grouping", function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test() {
                apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium columns={[{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }]} rows={[
                        {
                            id: 1,
                            col1: 1,
                            col2: 2,
                            col3: 3,
                        },
                    ]} columnGroupingModel={[
                        { groupId: 'group1', children: [{ field: 'col1' }] },
                        {
                            groupId: 'group23',
                            children: [
                                { field: 'col2' },
                                {
                                    groupId: 'group3',
                                    headerName: 'special col3',
                                    children: [{ field: 'col3' }],
                                },
                            ],
                        },
                    ]} apiRef={apiRef}/>
          </div>);
            }
            var workbook, worksheet;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<Test />);
                        return [4 /*yield*/, ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getDataAsExcel())];
                    case 1:
                        workbook = _b.sent();
                        worksheet = workbook.worksheets[0];
                        // line 1: | group1 | group23 |
                        expect(worksheet.getCell('A1').value).to.equal('group1');
                        expect(worksheet.getCell('B1').value).to.equal('group23');
                        expect(worksheet.getCell('A1').type).to.equal(exceljs_1.default.ValueType.String);
                        expect(worksheet.getCell('B1').type).to.equal(exceljs_1.default.ValueType.String);
                        expect(worksheet.getCell('C1').type).to.equal(exceljs_1.default.ValueType.Merge);
                        // line 2: |  |  | special col3 |
                        expect(worksheet.getCell('A2').value).to.equal(null);
                        expect(worksheet.getCell('B2').value).to.equal(null);
                        expect(worksheet.getCell('C2').value).to.equal('special col3');
                        expect(worksheet.getCell('A2').type).to.equal(exceljs_1.default.ValueType.Null);
                        expect(worksheet.getCell('B2').type).to.equal(exceljs_1.default.ValueType.Null);
                        expect(worksheet.getCell('C2').type).to.equal(exceljs_1.default.ValueType.String);
                        // line 3: | col1 | col2 | col3 |
                        expect(worksheet.getCell('A3').value).to.equal('col1');
                        expect(worksheet.getCell('B3').value).to.equal('col2');
                        expect(worksheet.getCell('C3').value).to.equal('col3');
                        expect(worksheet.getCell('A3').type).to.equal(exceljs_1.default.ValueType.String);
                        expect(worksheet.getCell('B3').type).to.equal(exceljs_1.default.ValueType.String);
                        expect(worksheet.getCell('C3').type).to.equal(exceljs_1.default.ValueType.String);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should escape formulas in the cells', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test() {
                apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_premium_1.DataGridPremium apiRef={apiRef} columns={[{ field: 'name' }]} rows={[
                        { id: 0, name: '=1+1' },
                        { id: 1, name: '+1+1' },
                        { id: 2, name: '-1+1' },
                        { id: 3, name: '@1+1' },
                        { id: 4, name: '\t1+1' },
                        { id: 5, name: '\r1+1' },
                        { id: 6, name: ',=1+1' },
                        { id: 7, name: 'value,=1+1' },
                    ]}/>
          </div>);
            }
            var workbook, worksheet;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<Test />);
                        return [4 /*yield*/, ((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getDataAsExcel())];
                    case 1:
                        workbook = _b.sent();
                        worksheet = workbook.worksheets[0];
                        expect(worksheet.getCell('A1').value).to.equal('name');
                        expect(worksheet.getCell('A2').value).to.equal("'=1+1");
                        expect(worksheet.getCell('A3').value).to.equal("'+1+1");
                        expect(worksheet.getCell('A4').value).to.equal("'-1+1");
                        expect(worksheet.getCell('A5').value).to.equal("'@1+1");
                        expect(worksheet.getCell('A6').value).to.equal("'\t1+1");
                        expect(worksheet.getCell('A7').value).to.equal("'\r1+1");
                        expect(worksheet.getCell('A8').value).to.equal(',=1+1');
                        expect(worksheet.getCell('A9').value).to.equal('value,=1+1');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('web worker', function () {
        var workerMock;
        beforeEach(function () {
            workerMock = {
                postMessage: (0, sinon_1.spy)(),
            };
        });
        it('should not call getDataAsExcel', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getDataAsExcelSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCaseExcelExport />);
                        getDataAsExcelSpy = (0, helperFn_1.spyApi)(apiRef.current, 'getDataAsExcel');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportDataAsExcel({ worker: function () { return workerMock; } }); })];
                    case 1:
                        _a.sent();
                        expect(getDataAsExcelSpy.calledOnce).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should post a message to the web worker with the serialized columns', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCaseExcelExport />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportDataAsExcel({ worker: function () { return workerMock; } }); })];
                    case 1:
                        _a.sent();
                        expect(workerMock.postMessage.lastCall.args[0].serializedColumns).to.deep.equal([
                            { key: 'id', headerText: 'id', style: {}, width: 100 / 7.5 },
                            { key: 'brand', headerText: 'Brand', style: {}, width: 100 / 7.5 },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should post a message to the web worker with the serialized rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCaseExcelExport />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportDataAsExcel({ worker: function () { return workerMock; } }); })];
                    case 1:
                        _a.sent();
                        expect(workerMock.postMessage.lastCall.args[0].serializedRows).to.deep.equal([
                            {
                                dataValidation: {},
                                mergedCells: [],
                                outlineLevel: 0,
                                row: baselineProps.rows[0],
                            },
                            {
                                dataValidation: {},
                                mergedCells: [],
                                outlineLevel: 0,
                                row: baselineProps.rows[1],
                            },
                            {
                                dataValidation: {},
                                mergedCells: [],
                                outlineLevel: 0,
                                row: baselineProps.rows[2],
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
