"use strict";
'use client';
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
exports.DayCalendarSkeleton = DayCalendarSkeleton;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var Skeleton_1 = require("@mui/material/Skeleton");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var dimensions_1 = require("../internals/constants/dimensions");
var dayCalendarSkeletonClasses_1 = require("./dayCalendarSkeletonClasses");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        week: ['week'],
        daySkeleton: ['daySkeleton'],
    };
    return (0, composeClasses_1.default)(slots, dayCalendarSkeletonClasses_1.getDayCalendarSkeletonUtilityClass, classes);
};
var DayCalendarSkeletonRoot = (0, styles_1.styled)('div', {
    name: 'MuiDayCalendarSkeleton',
    slot: 'Root',
})({
    alignSelf: 'start',
});
var DayCalendarSkeletonWeek = (0, styles_1.styled)('div', {
    name: 'MuiDayCalendarSkeleton',
    slot: 'Week',
})({
    margin: "".concat(dimensions_1.DAY_MARGIN, "px 0"),
    display: 'flex',
    justifyContent: 'center',
});
var DayCalendarSkeletonDay = (0, styles_1.styled)(Skeleton_1.default, {
    name: 'MuiDayCalendarSkeleton',
    slot: 'DaySkeleton',
})({
    margin: "0 ".concat(dimensions_1.DAY_MARGIN, "px"),
    '&[data-day-in-month="0"]': {
        visibility: 'hidden',
    },
});
var monthMap = [
    [0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 0],
];
/**
 * Demos:
 *
 * - [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/)
 *
 * API:
 *
 * - [CalendarPickerSkeleton API](https://mui.com/x/api/date-pickers/calendar-picker-skeleton/)
 */
function DayCalendarSkeleton(inProps) {
    var props = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiDayCalendarSkeleton',
    });
    var className = props.className, classesProp = props.classes, other = __rest(props, ["className", "classes"]);
    var classes = useUtilityClasses(classesProp);
    return (<DayCalendarSkeletonRoot className={(0, clsx_1.default)(classes.root, className)} ownerState={props} {...other}>
      {monthMap.map(function (week, index) { return (<DayCalendarSkeletonWeek key={index} className={classes.week}>
          {week.map(function (dayInMonth, index2) { return (<DayCalendarSkeletonDay key={index2} variant="circular" width={dimensions_1.DAY_SIZE} height={dimensions_1.DAY_SIZE} className={classes.daySkeleton} data-day-in-month={dayInMonth}/>); })}
        </DayCalendarSkeletonWeek>); })}
    </DayCalendarSkeletonRoot>);
}
DayCalendarSkeleton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
