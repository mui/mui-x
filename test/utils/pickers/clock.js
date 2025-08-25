"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeClockValue = exports.getClockTouchEvent = void 0;
var shared_1 = require("@mui/x-date-pickers/TimeClock/shared");
var TimeClock_1 = require("@mui/x-date-pickers/TimeClock");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var getClockTouchEvent = function (value, view) {
    // TODO: Handle 24 hours clock
    if (view === '24hours') {
        throw new Error('Do not support 24 hours clock yet');
    }
    var itemCount;
    if (view === 'minutes') {
        itemCount = 60;
    }
    else {
        itemCount = 12;
    }
    var angle = Math.PI / 2 - (Math.PI * 2 * Number(value)) / itemCount;
    var clientX = Math.round(((1 + Math.cos(angle)) * shared_1.CLOCK_WIDTH) / 2);
    var clientY = Math.round(((1 - Math.sin(angle)) * shared_1.CLOCK_WIDTH) / 2);
    return {
        changedTouches: [
            {
                clientX: clientX,
                clientY: clientY,
            },
        ],
    };
};
exports.getClockTouchEvent = getClockTouchEvent;
var getTimeClockValue = function () {
    var _a, _b, _c, _d, _e;
    var clockPointer = document.querySelector(".".concat(TimeClock_1.clockPointerClasses.root));
    var transform = (_b = (_a = clockPointer === null || clockPointer === void 0 ? void 0 : clockPointer.style) === null || _a === void 0 ? void 0 : _a.transform) !== null && _b !== void 0 ? _b : '';
    var isMinutesView = (_c = internal_test_utils_1.screen.getByRole('listbox').getAttribute('aria-label')) === null || _c === void 0 ? void 0 : _c.includes('minutes');
    var rotation = Number((_e = (_d = /rotateZ\(([0-9]+)deg\)/.exec(transform)) === null || _d === void 0 ? void 0 : _d[1]) !== null && _e !== void 0 ? _e : '0');
    if (isMinutesView) {
        return rotation / 6;
    }
    return rotation / 30;
};
exports.getTimeClockValue = getTimeClockValue;
