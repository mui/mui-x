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
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
describe('<DataGridPremium />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: isJSDOM,
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
    var apiRef;
    function TestCase(props) {
        var _a;
        apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_premium_1.DataGridPremium {...baselineProps} apiRef={apiRef} showToolbar disableColumnSelector disableDensitySelector disableColumnFilter {...props} slotProps={__assign(__assign({}, props === null || props === void 0 ? void 0 : props.slotProps), { toolbar: __assign({ showQuickFilter: true }, (_a = props === null || props === void 0 ? void 0 : props.slotProps) === null || _a === void 0 ? void 0 : _a.toolbar) })}/>
      </div>);
    }
    // https://github.com/mui/mui-x/issues/9677
    it('should not fail when adding a grouping criterion', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProps = render(<TestCase rows={[
                            {
                                id: 1,
                                company: '20th Century Fox',
                                director: 'James Cameron',
                                year: 1999,
                                title: 'Titanic',
                            },
                        ]} columns={[
                            { field: 'company' },
                            { field: 'director' },
                            { field: 'year' },
                            { field: 'title' },
                        ]} initialState={{
                            rowGrouping: {
                                model: ['company'],
                            },
                            aggregation: {
                                model: {
                                    director: 'size',
                                },
                            },
                        }}/>).setProps;
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.addRowGroupingCriteria('year')];
                        }); }); })];
                case 1:
                    _a.sent();
                    setProps({
                        filterModel: {
                            items: [],
                            quickFilterValues: ['Cameron'],
                        },
                    });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['20th Century Fox (1)', '']);
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
