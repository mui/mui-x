"use strict";
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
exports.buildPickerDragInteractions = exports.rangeCalendarDayTouches = void 0;
var internal_test_utils_1 = require("@mui/internal-test-utils");
exports.rangeCalendarDayTouches = {
    '2018-01-01': {
        clientX: 85,
        clientY: 125,
    },
    '2018-01-02': {
        clientX: 125,
        clientY: 125,
    },
    '2018-01-09': {
        clientX: 125,
        clientY: 165,
    },
    '2018-01-10': {
        clientX: 165,
        clientY: 165,
    },
    '2018-01-11': {
        clientX: 205,
        clientY: 165,
    },
};
var buildPickerDragInteractions = function (getDataTransfer) {
    var createDragEvent = function (type, target) {
        var createdEvent = internal_test_utils_1.createEvent[type](target);
        Object.defineProperty(createdEvent, 'dataTransfer', {
            value: getDataTransfer(),
        });
        return createdEvent;
    };
    var executeDateDragWithoutDrop = function (startDate) {
        var otherDates = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            otherDates[_i - 1] = arguments[_i];
        }
        var endDate = otherDates[otherDates.length - 1];
        (0, internal_test_utils_1.fireEvent)(startDate, createDragEvent('dragStart', startDate));
        (0, internal_test_utils_1.fireEvent)(startDate, createDragEvent('dragLeave', startDate));
        otherDates.slice(0, otherDates.length - 1).forEach(function (date) {
            (0, internal_test_utils_1.fireEvent)(date, createDragEvent('dragEnter', date));
            (0, internal_test_utils_1.fireEvent)(date, createDragEvent('dragOver', date));
            (0, internal_test_utils_1.fireEvent)(date, createDragEvent('dragLeave', date));
        });
        (0, internal_test_utils_1.fireEvent)(endDate, createDragEvent('dragEnter', endDate));
        (0, internal_test_utils_1.fireEvent)(endDate, createDragEvent('dragOver', endDate));
    };
    var executeDateDrag = function (startDate) {
        var otherDates = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            otherDates[_i - 1] = arguments[_i];
        }
        executeDateDragWithoutDrop.apply(void 0, __spreadArray([startDate], otherDates, false));
        var endDate = otherDates[otherDates.length - 1];
        (0, internal_test_utils_1.fireEvent)(endDate, createDragEvent('drop', endDate));
        (0, internal_test_utils_1.fireEvent)(endDate, createDragEvent('dragEnd', endDate));
    };
    return { executeDateDragWithoutDrop: executeDateDragWithoutDrop, executeDateDrag: executeDateDrag };
};
exports.buildPickerDragInteractions = buildPickerDragInteractions;
