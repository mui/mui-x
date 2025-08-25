"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var date_range_manager_1 = require("./date-range-manager");
var start2018 = pickers_1.adapterToUse.date('2018-01-01');
var start2018At4PM = pickers_1.adapterToUse.date('2018-01-01T16:00:00');
var mid2018 = pickers_1.adapterToUse.date('2018-07-01');
var end2019 = pickers_1.adapterToUse.date('2019-01-01');
describe('date-range-manager', function () {
    [
        {
            range: [null, null],
            rangePosition: 'start',
            newDate: start2018,
            expectedRange: [start2018, null],
            expectedNextSelection: 'end',
        },
        {
            range: [null, null],
            rangePosition: 'start',
            newDate: start2018,
            expectedRange: [start2018At4PM, null],
            expectedNextSelection: 'end',
            shouldMergeDateAndTime: true,
            referenceDate: start2018At4PM,
        },
        {
            range: [start2018, null],
            rangePosition: 'start',
            newDate: end2019,
            expectedRange: [end2019, null],
            expectedNextSelection: 'end',
        },
        {
            range: [null, end2019],
            rangePosition: 'start',
            newDate: mid2018,
            expectedRange: [mid2018, end2019],
            expectedNextSelection: 'end',
        },
        {
            range: [null, end2019],
            rangePosition: 'end',
            newDate: mid2018,
            expectedRange: [null, mid2018],
            expectedNextSelection: 'start',
        },
        {
            range: [mid2018, null],
            rangePosition: 'start',
            newDate: start2018,
            expectedRange: [start2018, null],
            expectedNextSelection: 'end',
        },
        {
            range: [start2018, end2019],
            rangePosition: 'start',
            newDate: mid2018,
            expectedRange: [mid2018, end2019],
            expectedNextSelection: 'end',
        },
        {
            range: [start2018, end2019],
            rangePosition: 'end',
            newDate: mid2018,
            expectedRange: [start2018, mid2018],
            expectedNextSelection: 'start',
        },
        {
            range: [mid2018, end2019],
            rangePosition: 'start',
            newDate: start2018,
            expectedRange: [start2018, end2019],
            expectedNextSelection: 'end',
        },
        {
            range: [start2018, mid2018],
            rangePosition: 'end',
            newDate: mid2018,
            expectedRange: [start2018, mid2018],
            expectedNextSelection: 'start',
        },
        {
            range: [start2018, mid2018],
            rangePosition: 'start',
            newDate: end2019,
            expectedRange: [mid2018, end2019],
            allowRangeFlip: true,
            expectedNextSelection: 'start',
        },
        {
            range: [mid2018, end2019],
            rangePosition: 'end',
            newDate: start2018,
            expectedRange: [start2018, mid2018],
            allowRangeFlip: true,
            expectedNextSelection: 'end',
        },
        {
            range: [start2018At4PM, null],
            rangePosition: 'end',
            newDate: start2018,
            expectedRange: [start2018At4PM, start2018],
            allowRangeFlip: false,
            expectedNextSelection: 'start',
        },
    ].forEach(function (_a) {
        var range = _a.range, rangePosition = _a.rangePosition, newDate = _a.newDate, expectedRange = _a.expectedRange, allowRangeFlip = _a.allowRangeFlip, expectedNextSelection = _a.expectedNextSelection, shouldMergeDateAndTime = _a.shouldMergeDateAndTime, referenceDate = _a.referenceDate;
        it("calculateRangeChange should return ".concat(expectedRange, " when selecting ").concat(rangePosition, " of ").concat(range, " with user input ").concat(newDate), function () {
            expect((0, date_range_manager_1.calculateRangeChange)({
                adapter: pickers_1.adapterToUse,
                range: range,
                newDate: newDate,
                rangePosition: rangePosition,
                allowRangeFlip: allowRangeFlip,
                shouldMergeDateAndTime: shouldMergeDateAndTime,
                referenceDate: referenceDate,
            })).to.deep.equal({
                nextSelection: expectedNextSelection,
                newRange: expectedRange,
            });
        });
    });
    [
        {
            range: [start2018, end2019],
            rangePosition: 'start',
            newDate: null,
            expectedRangePreview: [null, null],
        },
        {
            range: [null, null],
            rangePosition: 'start',
            newDate: start2018,
            expectedRangePreview: [start2018, null],
        },
        {
            range: [start2018, null],
            rangePosition: 'start',
            newDate: end2019,
            expectedRangePreview: [end2019, null],
        },
        {
            range: [null, end2019],
            rangePosition: 'start',
            newDate: mid2018,
            expectedRangePreview: [mid2018, end2019],
        },
        {
            range: [null, end2019],
            rangePosition: 'end',
            newDate: mid2018,
            expectedRangePreview: [null, mid2018],
        },
        {
            range: [mid2018, null],
            rangePosition: 'start',
            newDate: start2018,
            expectedRangePreview: [start2018, null],
        },
        {
            range: [mid2018, end2019],
            rangePosition: 'start',
            newDate: start2018,
            expectedRangePreview: [start2018, mid2018],
        },
        {
            range: [start2018, mid2018],
            rangePosition: 'end',
            newDate: end2019,
            expectedRangePreview: [mid2018, end2019],
        },
    ].forEach(function (_a) {
        var range = _a.range, rangePosition = _a.rangePosition, newDate = _a.newDate, expectedRangePreview = _a.expectedRangePreview;
        it("calculateRangePreview should return ".concat(expectedRangePreview, " when selecting ").concat(rangePosition, " of $range when user hover ").concat(newDate), function () {
            expect((0, date_range_manager_1.calculateRangePreview)({
                adapter: pickers_1.adapterToUse,
                range: range,
                newDate: newDate,
                rangePosition: rangePosition,
            })).to.deep.equal(expectedRangePreview);
        });
    });
});
