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
var MobileDateTimePicker_1 = require("@mui/x-date-pickers/MobileDateTimePicker");
var pickers_1 = require("test/utils/pickers");
var skipIf_1 = require("test/utils/skipIf");
describe('<MobileDateTimePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    it('should render date and time by default', function () {
        render(<MobileDateTimePicker_1.MobileDateTimePicker open slotProps={{ toolbar: { hidden: false } }} defaultValue={pickers_1.adapterToUse.date('2021-11-20T10:01:22')}/>);
        expect(internal_test_utils_1.screen.queryByTestId('seconds')).to.equal(null);
        expect(internal_test_utils_1.screen.getByTestId('hours')).to.have.text('10');
        expect(internal_test_utils_1.screen.getByTestId('minutes')).to.have.text('01');
        expect(internal_test_utils_1.screen.getByTestId('datetimepicker-toolbar-year')).to.have.text('2021');
        expect(internal_test_utils_1.screen.getByTestId('datetimepicker-toolbar-day')).to.have.text('Nov 20');
    });
    it('should render toolbar and tabs by default', function () {
        render(<MobileDateTimePicker_1.MobileDateTimePicker open value={pickers_1.adapterToUse.date('2021-11-20T10:01:22')}/>);
        expect(internal_test_utils_1.screen.queryByTestId('picker-toolbar-title')).not.to.equal(null);
        expect(internal_test_utils_1.screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
    });
    it('can render seconds on view', function () {
        render(<MobileDateTimePicker_1.MobileDateTimePicker open slotProps={{ toolbar: { hidden: false } }} openTo="seconds" views={['seconds']} defaultValue={pickers_1.adapterToUse.date('2021-11-20T10:01:22')}/>);
        expect(internal_test_utils_1.screen.getByTestId('seconds')).to.have.text('22');
    });
    describe('Component slot: Tabs', function () {
        it('should not render tabs when `hidden` is `true`', function () {
            render(<MobileDateTimePicker_1.MobileDateTimePicker open defaultValue={pickers_1.adapterToUse.date('2021-11-20T10:01:22')} slotProps={{
                    tabs: { hidden: true },
                }}/>);
            expect(internal_test_utils_1.screen.queryByTestId('picker-toolbar-title')).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
        });
    });
    describe('Component slot: Toolbar', function () {
        it('should not render only toolbar when `hidden` is `true`', function () {
            render(<MobileDateTimePicker_1.MobileDateTimePicker open slotProps={{ toolbar: { hidden: true } }} defaultValue={pickers_1.adapterToUse.date('2021-11-20T10:01:22')}/>);
            expect(internal_test_utils_1.screen.queryByTestId('picker-toolbar-title')).to.equal(null);
            expect(internal_test_utils_1.screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
        });
    });
    describe('picker state', function () {
        it.skipIf(!skipIf_1.hasTouchSupport)('should call onChange when selecting each view', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, defaultValue, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = pickers_1.adapterToUse.date('2018-01-01');
                        user = render(<MobileDateTimePicker_1.MobileDateTimePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue} ampm/>).user;
                        (0, pickers_1.openPicker)({ type: 'date-time' });
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Change the year view
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText(/switch to year view/))];
                    case 1:
                        // Change the year view
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('2010', { selector: 'button' }))];
                    case 2:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2010, 0, 1));
                        // Change the date
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '15' }))];
                    case 3:
                        // Change the date
                        _a.sent();
                        expect(onChange.callCount).to.equal(2);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2010, 0, 15));
                        // Change the hours
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Next' }));
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: '11 hours' }));
                        expect(onChange.callCount).to.equal(3);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(pickers_1.adapterToUse.date('2010-01-15T11:00:00'));
                        // Change the minutes
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('option', { name: '55 minutes' }));
                        expect(onChange.callCount).to.equal(4);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(pickers_1.adapterToUse.date('2010-01-15T11:55:00'));
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
