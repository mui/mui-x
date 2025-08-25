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
var DateCalendar_1 = require("@mui/x-date-pickers/DateCalendar");
var pickers_1 = require("test/utils/pickers");
function WrappedDateCalendar(props) {
    var initialValue = props.initialValue, other = __rest(props, ["initialValue"]);
    var _a = React.useState(initialValue), value = _a[0], setValue = _a[1];
    var handleChange = React.useCallback(function (newValue) {
        setValue(newValue);
    }, []);
    return <DateCalendar_1.DateCalendar {...other} value={value} onChange={handleChange}/>;
}
describe('<DateCalendar /> - Validation', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    // Test about `shouldDisableMonth` on the "month" view is on the `MonthCalendar` test file.
    describe('props.shouldDisableMonth', function () {
        it('should disable all the dates on the "day" view when `shouldDisableMonth` returns false for its month`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<WrappedDateCalendar initialValue={pickers_1.adapterToUse.date('2018-06-01')} shouldDisableMonth={function (date) { return pickers_1.adapterToUse.getMonth(date) === 6; }} views={['day']} openTo={'day'}/>).user;
                        // No date should be disabled in the month before the disabled month
                        internal_test_utils_1.screen.getAllByTestId('day').forEach(function (day) {
                            expect(day).not.to.have.attribute('disabled');
                        });
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByTitle('Next month'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                internal_test_utils_1.screen.getAllByTestId('day').forEach(function (day) {
                                    expect(day).to.have.attribute('disabled');
                                });
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByTitle('Next month'))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                internal_test_utils_1.screen.getAllByTestId('day').forEach(function (day) {
                                    expect(day).not.to.have.attribute('disabled');
                                });
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Test about `shouldDisableYear` on the "year" view is on the `YearCalendar` test file.
    describe('props.shouldDisableYear', function () {
        it('should disable all the dates on the "day" view when `shouldDisableYear` returns false for its year`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<WrappedDateCalendar initialValue={pickers_1.adapterToUse.date('2017-12-01')} shouldDisableYear={function (date) { return pickers_1.adapterToUse.getYear(date) === 2018; }} views={['day']} openTo={'day'}/>).user;
                        // No date should be disabled in the month before the disabled year
                        internal_test_utils_1.screen.getAllByTestId('day').forEach(function (day) {
                            expect(day).not.to.have.attribute('disabled');
                        });
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByTitle('Next month'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                internal_test_utils_1.screen.getAllByTestId('day').forEach(function (day) {
                                    expect(day).to.have.attribute('disabled');
                                });
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
