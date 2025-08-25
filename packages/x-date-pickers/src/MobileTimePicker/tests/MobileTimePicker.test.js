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
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var MobileTimePicker_1 = require("@mui/x-date-pickers/MobileTimePicker");
var pickers_1 = require("test/utils/pickers");
var skipIf_1 = require("test/utils/skipIf");
describe('<MobileTimePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    describe('picker state', function () {
        it('should fire a change event when meridiem changes', function () {
            var handleChange = (0, sinon_1.spy)();
            render(<MobileTimePicker_1.MobileTimePicker ampm onChange={handleChange} open slotProps={{ toolbar: { hidden: false } }} value={pickers_1.adapterToUse.date('2019-01-01T04:20:00')}/>);
            var buttonPM = internal_test_utils_1.screen.getByRole('button', { name: 'PM' });
            internal_test_utils_1.fireEvent.click(buttonPM);
            expect(handleChange.callCount).to.equal(1);
            expect(handleChange.firstCall.args[0]).toEqualDateTime(new Date(2019, 0, 1, 16, 20));
        });
        it.skipIf(!skipIf_1.hasTouchSupport)('should call onChange when selecting each view', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, defaultValue, user, hourClockEvent, minuteClockEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = pickers_1.adapterToUse.date('2018-01-01');
                        user = render(<MobileTimePicker_1.MobileTimePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue}/>).user;
                        (0, pickers_1.openPicker)({ type: 'time' });
                        hourClockEvent = (0, pickers_1.getClockTouchEvent)(11, '12hours');
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[TouchA]',
                                    target: internal_test_utils_1.screen.getByTestId('clock'),
                                    coords: hourClockEvent.changedTouches[0],
                                },
                            ])];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(pickers_1.adapterToUse.date('2018-01-01T11:00:00'));
                        minuteClockEvent = (0, pickers_1.getClockTouchEvent)(53, 'minutes');
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[TouchA]',
                                    target: internal_test_utils_1.screen.getByTestId('clock'),
                                    coords: minuteClockEvent.changedTouches[0],
                                },
                            ])];
                    case 2:
                        _a.sent();
                        expect(onChange.callCount).to.equal(2);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(pickers_1.adapterToUse.date('2018-01-01T11:53:00'));
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
