"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tickFrequencies = void 0;
function yearNumber(from, to) {
    return Math.abs(to.getFullYear() - from.getFullYear());
}
function monthNumber(from, to) {
    return Math.abs(to.getFullYear() * 12 + to.getMonth() - 12 * from.getFullYear() - from.getMonth());
}
function dayNumber(from, to) {
    return Math.abs(to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
}
function hourNumber(from, to) {
    return Math.abs(to.getTime() - from.getTime()) / (1000 * 60 * 60);
}
exports.tickFrequencies = {
    years: {
        getTickNumber: yearNumber,
        isTick: function (prev, value) { return value.getFullYear() !== prev.getFullYear(); },
        format: function (d) { return d.getFullYear().toString(); },
    },
    quarterly: {
        getTickNumber: function (from, to) { return Math.floor(monthNumber(from, to) / 3); },
        isTick: function (prev, value) {
            return value.getMonth() !== prev.getMonth() && value.getMonth() % 3 === 0;
        },
        format: new Intl.DateTimeFormat('default', { month: 'short' }).format,
    },
    months: {
        getTickNumber: monthNumber,
        isTick: function (prev, value) { return value.getMonth() !== prev.getMonth(); },
        format: new Intl.DateTimeFormat('default', { month: 'short' }).format,
    },
    biweekly: {
        getTickNumber: function (from, to) { return dayNumber(from, to) / 14; },
        isTick: function (prev, value) {
            return (value.getDay() < prev.getDay() || dayNumber(value, prev) > 7) &&
                Math.floor(value.getDate() / 7) % 2 === 1;
        },
        format: new Intl.DateTimeFormat('default', { day: 'numeric' }).format,
    },
    weeks: {
        getTickNumber: function (from, to) { return dayNumber(from, to) / 7; },
        isTick: function (prev, value) {
            return value.getDay() < prev.getDay() || dayNumber(value, prev) >= 7;
        },
        format: new Intl.DateTimeFormat('default', { day: 'numeric' }).format,
    },
    days: {
        getTickNumber: dayNumber,
        isTick: function (prev, value) { return value.getDate() !== prev.getDate(); },
        format: new Intl.DateTimeFormat('default', { day: 'numeric' }).format,
    },
    hours: {
        getTickNumber: hourNumber,
        isTick: function (prev, value) { return value.getHours() !== prev.getHours(); },
        format: new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit' }).format,
    },
};
