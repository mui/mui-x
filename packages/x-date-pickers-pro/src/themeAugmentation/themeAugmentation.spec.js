"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
var styles_1 = require("@mui/material/styles");
var DateRangeCalendar_1 = require("../DateRangeCalendar");
var DateRangePicker_1 = require("../DateRangePicker");
var DateRangePickerDay_1 = require("../DateRangePickerDay");
var MultiInputDateRangeField_1 = require("../MultiInputDateRangeField");
var MultiInputDateTimeRangeField_1 = require("../MultiInputDateTimeRangeField");
var MultiInputTimeRangeField_1 = require("../MultiInputTimeRangeField");
var DateTimeRangePicker_1 = require("../DateTimeRangePicker");
var DateRangePickerDay2_1 = require("../DateRangePickerDay2");
(0, styles_1.createTheme)({
    components: {
        MuiDateRangeCalendar: {
            defaultProps: {
                calendars: 3,
                // @ts-expect-error invalid MuiDateRangeCalendar prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_a = {
                        backgroundColor: 'red'
                    },
                    _a[".".concat(DateRangeCalendar_1.dateRangeCalendarClasses.monthContainer)] = {
                        backgroundColor: 'green',
                    },
                    _a),
                // @ts-expect-error invalid MuiDateRangeCalendar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDateRangePickerDay: {
            defaultProps: {
                color: 'red',
                // @ts-expect-error invalid MuiDateRangePickerDay prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_b = {
                        backgroundColor: 'red'
                    },
                    _b[".".concat(DateRangePickerDay_1.dateRangePickerDayClasses.day)] = {
                        backgroundColor: 'green',
                    },
                    _b),
                // @ts-expect-error invalid MuiDateTimePickerToolbar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDateRangePickerDay2: {
            defaultProps: {
                color: 'red',
                // @ts-expect-error invalid MuiDateRangePickerDay2 prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_c = {
                        backgroundColor: 'red'
                    },
                    _c[".".concat(DateRangePickerDay2_1.dateRangePickerDay2Classes.root)] = {
                        backgroundColor: 'green',
                    },
                    _c),
                // @ts-expect-error invalid MuiDateRangePickerDay2 class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDateTimeRangePickerTabs: {
            defaultProps: {
                className: 'empty',
                // @ts-expect-error invalid MuiDateTimeRangePickerTabs prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_d = {
                        backgroundColor: 'red'
                    },
                    _d[".".concat(DateTimeRangePicker_1.dateTimeRangePickerTabsClasses.filler)] = {
                        backgroundColor: 'green',
                    },
                    _d),
                // @ts-expect-error invalid MuiDateTimeRangePickerTabs class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDateRangePickerToolbar: {
            defaultProps: {
                toolbarPlaceholder: 'empty',
                // @ts-expect-error invalid MuiDateRangePickerToolbar prop
                view: 'day',
            },
            styleOverrides: {
                root: (_e = {
                        backgroundColor: 'red'
                    },
                    _e[".".concat(DateRangePicker_1.dateRangePickerToolbarClasses.container)] = {
                        backgroundColor: 'green',
                    },
                    _e),
                // @ts-expect-error invalid MuiDateRangePickerToolbar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDateTimeRangePickerToolbar: {
            defaultProps: {
                toolbarPlaceholder: 'empty',
                // @ts-expect-error invalid MuiDateTimeRangePickerToolbar prop
                view: 'day',
            },
            styleOverrides: {
                root: (_f = {
                        backgroundColor: 'red'
                    },
                    _f[".".concat(DateTimeRangePicker_1.dateTimeRangePickerToolbarClasses.startToolbar)] = {
                        backgroundColor: 'green',
                    },
                    _f),
                // @ts-expect-error invalid MuiDateTimeRangePickerToolbar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        // Multi input range fields
        MuiMultiInputDateRangeField: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiMultiInputDateRangeField prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_g = {
                        backgroundColor: 'red'
                    },
                    _g[".".concat(MultiInputDateRangeField_1.multiInputDateRangeFieldClasses.separator)] = {
                        backgroundColor: 'green',
                    },
                    _g),
                // @ts-expect-error invalid MuiMultiInputDateRangeField class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiMultiInputDateTimeRangeField: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiMultiInputDateTimeRangeField prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_h = {
                        backgroundColor: 'red'
                    },
                    _h[".".concat(MultiInputDateTimeRangeField_1.multiInputDateTimeRangeFieldClasses.separator)] = {
                        backgroundColor: 'green',
                    },
                    _h),
                // @ts-expect-error invalid MuiMultiInputDateTimeRangeField class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiMultiInputTimeRangeField: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiMultiInputTimeRangeField prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_j = {
                        backgroundColor: 'red'
                    },
                    _j[".".concat(MultiInputTimeRangeField_1.multiInputTimeRangeFieldClasses.separator)] = {
                        backgroundColor: 'green',
                    },
                    _j),
                // @ts-expect-error invalid MuiMultiInputTimeRangeField class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        // Single input range fields
        MuiSingleInputDateRangeField: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiSingleInputDateRangeField prop
                someRandomProp: true,
            },
        },
        MuiSingleInputDateTimeRangeField: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiSingleInputDateTimeRangeField prop
                someRandomProp: true,
            },
        },
        MuiSingleInputTimeRangeField: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiSingleInputTimeRangeField prop
                someRandomProp: true,
            },
        },
        // Date Range Pickers
        MuiDateRangePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiDateRangePicker prop
                someRandomProp: true,
            },
        },
        MuiDesktopDateRangePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiDesktopDateRangePicker prop
                someRandomProp: true,
            },
        },
        MuiMobileDateRangePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiMobileDateRangePicker prop
                someRandomProp: true,
            },
        },
        MuiStaticDateRangePicker: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiStaticDateRangePicker prop
                someRandomProp: true,
            },
        },
        // Date Time Range Pickers
        MuiDateTimeRangePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiDateTimeRangePicker prop
                someRandomProp: true,
            },
        },
        MuiDesktopDateTimeRangePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiDesktopDateTimeRangePicker prop
                someRandomProp: true,
            },
        },
        MuiMobileDateTimeRangePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiMobileDateTimeRangePicker prop
                someRandomProp: true,
            },
        },
    },
});
