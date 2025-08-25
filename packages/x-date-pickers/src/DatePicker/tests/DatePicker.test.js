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
var sinon_1 = require("sinon");
var DatePicker_1 = require("@mui/x-date-pickers/DatePicker");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
describe('<DatePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    it('should render in mobile mode when `useMediaQuery` returns `false`', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, pickers_1.stubMatchMedia)(false);
                    user = render(<DatePicker_1.DatePicker />).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText(/Choose date/))];
                case 1:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByRole('dialog')).to.not.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('form behavior', function () {
        function TestComponent(_a) {
            var onSubmit = _a.onSubmit, other = __rest(_a, ["onSubmit"]);
            return (<form onSubmit={function (event) {
                    event.preventDefault();
                    onSubmit(new window.FormData(event.target));
                }}>
          <DatePicker_1.DatePicker name="testDate" defaultValue={new Date('2022-04-17')} {...other}/>
          <button type="submit">Submit</button>
        </form>);
        }
        it('should submit the form when "Enter" is pressed on the input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleSubmit, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleSubmit = (0, sinon_1.spy)();
                        user = render(<TestComponent onSubmit={handleSubmit}/>).user;
                        // focus the input
                        return [4 /*yield*/, user.keyboard('{Tab}')];
                    case 1:
                        // focus the input
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Enter}')];
                    case 2:
                        _a.sent();
                        expect(handleSubmit.callCount).to.equal(1);
                        expect(__spreadArray([], handleSubmit.lastCall.args[0], true)[0]).to.deep.equal(['testDate', '04/17/2022']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not submit the form when "Enter" is pressed on the input with "defaultMuiPrevented" set to "true"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleSubmit, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleSubmit = (0, sinon_1.spy)();
                        user = render(<TestComponent onSubmit={handleSubmit} slotProps={{
                                textField: {
                                    onKeyDown: function (event) {
                                        if (event.key === 'Enter') {
                                            event.defaultMuiPrevented = true;
                                        }
                                    },
                                },
                            }}/>).user;
                        // focus the input
                        return [4 /*yield*/, user.keyboard('{Tab}')];
                    case 1:
                        // focus the input
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Enter}')];
                    case 2:
                        _a.sent();
                        expect(handleSubmit.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
