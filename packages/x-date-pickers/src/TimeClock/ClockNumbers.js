"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinutesNumbers = exports.getHourNumbers = void 0;
var React = require("react");
var ClockNumber_1 = require("./ClockNumber");
/**
 * @ignore - internal component.
 */
var getHourNumbers = function (_a) {
    var ampm = _a.ampm, value = _a.value, getClockNumberText = _a.getClockNumberText, isDisabled = _a.isDisabled, selectedId = _a.selectedId, adapter = _a.adapter;
    var currentHours = value ? adapter.getHours(value) : null;
    var hourNumbers = [];
    var startHour = ampm ? 1 : 0;
    var endHour = ampm ? 12 : 23;
    var isSelected = function (hour) {
        if (currentHours === null) {
            return false;
        }
        if (ampm) {
            if (hour === 12) {
                return currentHours === 12 || currentHours === 0;
            }
            return currentHours === hour || currentHours - 12 === hour;
        }
        return currentHours === hour;
    };
    for (var hour = startHour; hour <= endHour; hour += 1) {
        var label = hour.toString();
        if (hour === 0) {
            label = '00';
        }
        var inner = !ampm && (hour === 0 || hour > 12);
        label = adapter.formatNumber(label);
        var selected = isSelected(hour);
        hourNumbers.push(<ClockNumber_1.ClockNumber key={hour} id={selected ? selectedId : undefined} index={hour} inner={inner} selected={selected} disabled={isDisabled(hour)} label={label} aria-label={getClockNumberText(label)}/>);
    }
    return hourNumbers;
};
exports.getHourNumbers = getHourNumbers;
var getMinutesNumbers = function (_a) {
    var adapter = _a.adapter, value = _a.value, isDisabled = _a.isDisabled, getClockNumberText = _a.getClockNumberText, selectedId = _a.selectedId;
    var f = adapter.formatNumber;
    return [
        [5, f('05')],
        [10, f('10')],
        [15, f('15')],
        [20, f('20')],
        [25, f('25')],
        [30, f('30')],
        [35, f('35')],
        [40, f('40')],
        [45, f('45')],
        [50, f('50')],
        [55, f('55')],
        [0, f('00')],
    ].map(function (_a, index) {
        var numberValue = _a[0], label = _a[1];
        var selected = numberValue === value;
        return (<ClockNumber_1.ClockNumber key={numberValue} label={label} id={selected ? selectedId : undefined} index={index + 1} inner={false} disabled={isDisabled(numberValue)} selected={selected} aria-label={getClockNumberText(label)}/>);
    });
};
exports.getMinutesNumbers = getMinutesNumbers;
