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
exports.default = transformer;
var defaultPropsToKey = {
    cancelText: ['cancelButtonLabel'],
    okText: ['okButtonLabel'],
    todayText: ['todayButtonLabel'],
    clearText: ['clearButtonLabel'],
    endText: ['end'],
    getClockLabelText: ['clockLabelText'],
    getHoursClockNumberText: ['hoursClockNumberText'],
    getMinutesClockNumberText: ['minutesClockNumberText'],
    getSecondsClockNumberText: ['secondsClockNumberText'],
    getViewSwitchingButtonText: ['calendarViewSwitchingButtonAriaLabel'],
    startText: ['start'],
};
var isMonthSwitchComponent = {
    DatePicker: true,
    StaticDatePicker: true,
    MobileDatePicker: true,
    DesktopDatePicker: true,
    DateRangePicker: true,
    StaticDateRangePicker: true,
    MobileDateRangePicker: true,
    DesktopDateRangePicker: true,
    CalendarPicker: true,
    // Special cases of DateTimePickers present in both
    DateTimePicker: true,
    StaticDateTimePicker: true,
    MobileDateTimePicker: true,
    DesktopDateTimePicker: true,
};
var isViewSwitchComponent = {
    TimePicker: true,
    StaticTimePicker: true,
    MobileTimePicker: true,
    DesktopTimePicker: true,
    DateTimePicker: true,
    ClockPicker: true,
    // Special cases of DateTimePickers present in both
    StaticDateTimePicker: true,
    MobileDateTimePicker: true,
    DesktopDateTimePicker: true,
};
var needsWrapper = {
    ClockPicker: true,
    CalendarPicker: true,
};
var impactedComponents = [
    'DateRangePicker',
    'CalendarPicker',
    'ClockPicker',
    'DatePicker',
    'DateRangePicker',
    'DateRangePickerDay',
    'DateTimePicker',
    'DesktopDatePicker',
    'DesktopDateRangePicker',
    'DesktopDateTimePicker',
    'DesktopTimePicker',
    'MobileDatePicker',
    'MobileDateRangePicker',
    'MobileDateTimePicker',
    'MobileTimePicker',
    'StaticDatePicker',
    'StaticDateRangePicker',
    'StaticDateTimePicker',
    'StaticTimePicker',
    'TimePicker',
];
/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var printOptions = options.printOptions;
    var root = j(file.source);
    impactedComponents.forEach(function (componentName) {
        var propsToKey = __assign(__assign({}, defaultPropsToKey), { leftArrowButtonText: __spreadArray(__spreadArray([], (isViewSwitchComponent[componentName] ? ['openPreviousView'] : []), true), (isMonthSwitchComponent[componentName] ? ['previousMonth'] : []), true), rightArrowButtonText: __spreadArray(__spreadArray([], (isViewSwitchComponent[componentName] ? ['openNextView'] : []), true), (isMonthSwitchComponent[componentName] ? ['nextMonth'] : []), true) });
        root.findJSXElements(componentName).forEach(function (path) {
            var newLocaleText = [];
            var attributes = path.node.openingElement.attributes;
            attributes.forEach(function (node, index) {
                if (node.type === 'JSXAttribute' && propsToKey[node.name.name] !== undefined) {
                    var newNames = propsToKey[node.name.name];
                    newNames.forEach(function (newName) {
                        var property = j.objectProperty(j.identifier(newName), node.value.expression ? node.value.expression : j.literal(node.value.value));
                        property.shorthand = node.value.expression && node.value.expression.name === newName;
                        newLocaleText.push(property);
                    });
                    delete attributes[index];
                }
            });
            if (newLocaleText.length > 0) {
                if (needsWrapper[componentName]) {
                    // From : https://www.codeshiftcommunity.com/docs/react/#wrapping-components
                    // Create a new JSXElement called "LocalizationProvider" and use the original component as children
                    var wrappedComponent = j.jsxElement(j.jsxOpeningElement(j.jsxIdentifier('LocalizationProvider'), [
                        // Add the new localeText prop
                        j.jsxAttribute(j.jsxIdentifier('localeText'), j.jsxExpressionContainer(j.objectExpression(newLocaleText))),
                    ]), j.jsxClosingElement(j.jsxIdentifier('LocalizationProvider')), [path.value]);
                    j(path).replaceWith(wrappedComponent);
                }
                else {
                    attributes.push(j.jsxAttribute(j.jsxIdentifier('localeText'), j.jsxExpressionContainer(j.objectExpression(newLocaleText))));
                }
            }
        });
    });
    return root.toSource(printOptions);
}
