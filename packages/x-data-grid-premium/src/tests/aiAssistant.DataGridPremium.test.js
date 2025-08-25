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
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var skipIf_1 = require("test/utils/skipIf");
var rows = [
    { id: 0, category1: 'CatA', category2: 'Cat1' },
    { id: 1, category1: 'CatA', category2: 'Cat2' },
    { id: 2, category1: 'CatA', category2: 'Cat2' },
    { id: 3, category1: 'CatB', category2: 'Cat2' },
    { id: 4, category1: 'CatB', category2: 'Cat1' },
];
var baselineProps = {
    rows: rows,
    columns: [
        {
            field: 'id',
            type: 'number',
            examples: [10, 20, 30, 40, 50],
        },
        {
            field: 'category1',
            examples: ['ExampleA', 'ExampleB', 'ExampleC'],
        },
        {
            field: 'category2',
            examples: ['Example1', 'Example2', 'Example3'],
        },
    ],
};
describe('<DataGridPremium /> - Prompt', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    var promptSpy = (0, sinon_1.stub)().resolves({});
    function Test(props) {
        apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_premium_1.DataGridPremium {...baselineProps} apiRef={apiRef} aiAssistant showToolbar slots={{
                aiAssistantPanel: x_data_grid_premium_1.GridAiAssistantPanel,
            }} onPrompt={promptSpy} {...props}/>
      </div>);
    }
    beforeEach(function () {
        promptSpy.reset();
    });
    describe.skipIf(skipIf_1.isJSDOM)('data sampling', function () {
        it('should not show AI Assistant button in the Toolbarif the feature is disabled', function () {
            render(<Test aiAssistant={false}/>);
            expect(internal_test_utils_1.screen.queryByTestId('AssistantIcon')).to.equal(null);
        });
        it('should use `examples` to generate the prompt context', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, aiAssistantToolbarButton, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<Test />).user;
                        aiAssistantToolbarButton = internal_test_utils_1.screen.getByTestId('AssistantIcon');
                        return [4 /*yield*/, user.click(aiAssistantToolbarButton)];
                    case 1:
                        _a.sent();
                        input = internal_test_utils_1.screen.queryAllByPlaceholderText('Type or record a prompt…')[0];
                        return [4 /*yield*/, user.type(input, 'Do something with the data')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Enter}')];
                    case 3:
                        _a.sent();
                        expect(promptSpy.callCount).to.equal(1);
                        expect(promptSpy.firstCall.args[1]).contains('Example1');
                        expect(promptSpy.firstCall.args[1]).not.contains('CatA');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should sample rows to generate the prompt context', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, aiAssistantToolbarButton, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<Test allowAiAssistantDataSampling/>).user;
                        aiAssistantToolbarButton = internal_test_utils_1.screen.getByTestId('AssistantIcon');
                        return [4 /*yield*/, user.click(aiAssistantToolbarButton)];
                    case 1:
                        _a.sent();
                        input = internal_test_utils_1.screen.queryAllByPlaceholderText('Type or record a prompt…')[0];
                        return [4 /*yield*/, user.type(input, 'Do something with the data')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Enter}')];
                    case 3:
                        _a.sent();
                        expect(promptSpy.callCount).to.equal(1);
                        expect(promptSpy.firstCall.args[1]).not.contains('Example1');
                        expect(promptSpy.firstCall.args[1]).contains('CatA');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('API', function () {
        it('should not do anything if the feature is disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sortChangeSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sortChangeSpy = (0, sinon_1.spy)();
                        promptSpy.resolves({
                            select: -1,
                            filters: [],
                            aggregation: {},
                            sorting: [
                                {
                                    column: 'id',
                                    direction: 'desc',
                                },
                            ],
                            grouping: [],
                            pivoting: {},
                        });
                        render(<Test aiAssistant={false} onSortModelChange={sortChangeSpy}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.aiAssistant.processPrompt('Do something with the data'); })];
                    case 1:
                        _a.sent();
                        expect(sortChangeSpy.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should apply the prompt result', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sortChangeSpy, filterChangeSpy, aggregationChangeSpy, rowSelectionChangeSpy, rowGroupingChangeSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sortChangeSpy = (0, sinon_1.spy)();
                        filterChangeSpy = (0, sinon_1.spy)();
                        aggregationChangeSpy = (0, sinon_1.spy)();
                        rowSelectionChangeSpy = (0, sinon_1.spy)();
                        rowGroupingChangeSpy = (0, sinon_1.spy)();
                        promptSpy.resolves({
                            select: 1,
                            filters: [
                                {
                                    column: 'id',
                                    operator: '>=',
                                    value: 0,
                                },
                            ],
                            aggregation: {
                                id: 'size',
                            },
                            sorting: [
                                {
                                    column: 'id',
                                    direction: 'desc',
                                },
                            ],
                            grouping: [
                                {
                                    column: 'category1',
                                },
                            ],
                            pivoting: {},
                        });
                        render(<Test onSortModelChange={sortChangeSpy} onFilterModelChange={filterChangeSpy} onAggregationModelChange={aggregationChangeSpy} onRowSelectionModelChange={rowSelectionChangeSpy} onRowGroupingModelChange={rowGroupingChangeSpy}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.aiAssistant.processPrompt('Do something with the data'); })];
                    case 1:
                        _a.sent();
                        expect(sortChangeSpy.callCount).to.equal(1);
                        expect(filterChangeSpy.callCount).to.equal(1);
                        expect(aggregationChangeSpy.callCount).to.equal(1);
                        expect(rowSelectionChangeSpy.callCount).to.equal(1);
                        expect(rowGroupingChangeSpy.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return the prompt processing error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var errorMsg, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorMsg = 'Prompt processing error';
                        promptSpy.rejects(new Error(errorMsg));
                        render(<Test />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.aiAssistant.processPrompt('Do something with the data'); })];
                    case 1:
                        response = (_a.sent());
                        expect(response.message).to.equal(errorMsg);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
