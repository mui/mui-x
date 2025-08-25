"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
Object.defineProperty(exports, "__esModule", { value: true });
var styles_1 = require("@mui/material/styles");
var DateCalendar_1 = require("../DateCalendar");
var PickersCalendarHeader_1 = require("../PickersCalendarHeader");
var DayCalendarSkeleton_1 = require("../DayCalendarSkeleton");
var TimeClock_1 = require("../TimeClock");
var DatePicker_1 = require("../DatePicker");
var DateTimePicker_1 = require("../DateTimePicker");
var PickersArrowSwitcher_1 = require("../internals/components/PickersArrowSwitcher");
var PickerPopper_1 = require("../internals/components/PickerPopper");
var PickersDay_1 = require("../PickersDay");
var TimePicker_1 = require("../TimePicker");
var DigitalClock_1 = require("../DigitalClock");
var MultiSectionDigitalClock_1 = require("../MultiSectionDigitalClock");
var PickersTextField_1 = require("../PickersTextField");
var PickerDay2_1 = require("../PickerDay2");
(0, styles_1.createTheme)({
    components: {
        MuiDateCalendar: {
            defaultProps: {
                view: 'day',
                // @ts-expect-error invalid MuiDateCalendar prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_a = {
                        backgroundColor: 'red'
                    },
                    _a[".".concat(DateCalendar_1.dateCalendarClasses.viewTransitionContainer)] = {
                        backgroundColor: 'green',
                    },
                    _a),
                // @ts-expect-error invalid MuiDateCalendar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDateField: {
            defaultProps: {
                className: 'class',
                // @ts-expect-error invalid MuiDateField prop
                someRandomProp: true,
            },
        },
        MuiDayCalendarSkeleton: {
            defaultProps: {
                className: 'class',
                // @ts-expect-error invalid MuiDayCalendarSkeleton prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_b = {
                        backgroundColor: 'red'
                    },
                    _b[".".concat(DayCalendarSkeleton_1.dayCalendarSkeletonClasses.week)] = {
                        backgroundColor: 'green',
                    },
                    _b),
                // @ts-expect-error invalid MuiDayCalendarSkeleton class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDigitalClock: {
            defaultProps: {
                timeStep: 42,
                // @ts-expect-error invalid MuiDigitalClock prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_c = {
                        backgroundColor: 'red'
                    },
                    _c[".".concat(DigitalClock_1.digitalClockClasses.item)] = {
                        backgroundColor: 'green',
                    },
                    _c),
                // @ts-expect-error invalid MuiDigitalClock class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiMultiSectionDigitalClock: {
            defaultProps: {
                timeSteps: { minutes: 42 },
                // @ts-expect-error invalid MuiMultiSectionDigitalClock prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_d = {
                        backgroundColor: 'red'
                    },
                    _d["&.".concat(MultiSectionDigitalClock_1.multiSectionDigitalClockClasses.root)] = {
                        backgroundColor: 'green',
                    },
                    _d),
                // @ts-expect-error invalid MuiMultiSectionDigitalClock class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiMultiSectionDigitalClockSection: {
            defaultProps: {
                className: 'class',
                // @ts-expect-error invalid MuiMultiSectionDigitalClockSection prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_e = {
                        backgroundColor: 'red'
                    },
                    _e[".".concat(MultiSectionDigitalClock_1.multiSectionDigitalClockSectionClasses.item)] = {
                        backgroundColor: 'green',
                    },
                    _e),
                // @ts-expect-error invalid MuiMultiSectionDigitalClockSection class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiClock: {
            defaultProps: {
                ampmInClock: true,
                // @ts-expect-error invalid MuiClock prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_f = {
                        backgroundColor: 'red'
                    },
                    _f[".".concat(TimeClock_1.clockClasses.clock)] = {
                        backgroundColor: 'green',
                    },
                    _f),
                // @ts-expect-error invalid MuiClock class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiClockNumber: {
            defaultProps: {
                selected: true,
                // @ts-expect-error invalid MuiClockNumber prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_g = {
                        backgroundColor: 'red'
                    },
                    _g["&.".concat(TimeClock_1.clockNumberClasses.selected)] = {
                        backgroundColor: 'green',
                    },
                    _g),
                // @ts-expect-error invalid MuiClockNumber class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiClockPointer: {
            defaultProps: {
                type: 'hours',
                // @ts-expect-error invalid MuiClockPointer prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_h = {
                        backgroundColor: 'red'
                    },
                    _h[".".concat(TimeClock_1.clockPointerClasses.thumb)] = {
                        backgroundColor: 'green',
                    },
                    _h),
                // @ts-expect-error invalid MuiClockPointer class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDateTimeField: {
            defaultProps: {
                className: 'class',
                // @ts-expect-error invalid MuiDateTimeField prop
                someRandomProp: true,
            },
        },
        MuiDatePickerToolbar: {
            defaultProps: {
                hidden: false,
                // @ts-expect-error invalid MuiDatePickerToolbar prop
                view: 'day',
            },
            styleOverrides: {
                root: (_j = {
                        backgroundColor: 'red'
                    },
                    _j[".".concat(DatePicker_1.datePickerToolbarClasses.title)] = {
                        backgroundColor: 'green',
                    },
                    _j),
                // @ts-expect-error invalid MuiDatePickerToolbar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDateTimePickerTabs: {
            defaultProps: {
                hidden: true,
                // @ts-expect-error invalid MuiDateTimePicker prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiDateTimePickerTabs class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDateTimePickerToolbar: {
            defaultProps: {
                hidden: false,
                // @ts-expect-error invalid MuiDateTimePickerToolbar prop
                view: 'day',
            },
            styleOverrides: {
                root: (_k = {
                        backgroundColor: 'red'
                    },
                    _k[".".concat(DateTimePicker_1.dateTimePickerToolbarClasses.dateContainer)] = {
                        backgroundColor: 'green',
                    },
                    _k),
                // @ts-expect-error invalid MuiDateTimePickerToolbar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiDayCalendar: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiDayCalendar prop
                someRandomProp: true,
            },
            styleOverrides: {
                header: (_l = {
                        backgroundColor: 'red'
                    },
                    _l[".".concat(DateCalendar_1.dayCalendarClasses.weekContainer)] = {
                        backgroundColor: 'green',
                    },
                    _l),
                // @ts-expect-error invalid MuiDayCalendar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiMonthCalendar: {
            defaultProps: {
                disableFuture: true,
                // @ts-expect-error invalid MuiMonthCalendar prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiMonthCalendar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersArrowSwitcher: {
            defaultProps: {
                classes: { root: 'test' },
                // @ts-expect-error invalid MuiPickersArrowSwitcher prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_m = {
                        backgroundColor: 'red'
                    },
                    _m[".".concat(PickersArrowSwitcher_1.pickersArrowSwitcherClasses.button)] = {
                        backgroundColor: 'green',
                    },
                    _m),
                // @ts-expect-error invalid MuiPickersArrowSwitcher class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersCalendarHeader: {
            defaultProps: {
                classes: { root: 'test' },
                // @ts-expect-error invalid MuiPickersCalendarHeader prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_o = {
                        backgroundColor: 'red'
                    },
                    _o[".".concat(PickersCalendarHeader_1.pickersCalendarHeaderClasses.labelContainer)] = {
                        backgroundColor: 'green',
                    },
                    _o),
                // @ts-expect-error invalid MuiPickersCalendarHeader class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersFadeTransitionGroup: {
            defaultProps: {
                reduceAnimations: true,
                // @ts-expect-error invalid MuiPickersFadeTransitionGroup prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiPickersFadeTransitionGroup class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersDay: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiPickersDay prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_p = {
                        backgroundColor: 'red'
                    },
                    _p[".".concat(PickersDay_1.pickersDayClasses.today)] = {
                        backgroundColor: 'green',
                    },
                    _p),
                // @ts-expect-error invalid MuiPickersDay class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickerDay2: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiPickerDay2 prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_q = {
                        backgroundColor: 'red'
                    },
                    _q[".".concat(PickerDay2_1.pickerDay2Classes.today)] = {
                        backgroundColor: 'green',
                    },
                    _q),
                // @ts-expect-error invalid MuiPickerDay2 class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickerPopper: {
            defaultProps: {
                placement: 'bottom',
                // @ts-expect-error invalid MuiPickerPopper prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_r = {
                        backgroundColor: 'red'
                    },
                    _r[".".concat(PickerPopper_1.pickerPopperClasses.paper)] = {
                        backgroundColor: 'green',
                    },
                    _r),
                // @ts-expect-error invalid MuiPickerPopper class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersSlideTransition: {
            defaultProps: {
                classes: { slideExit: 'exit' },
                // @ts-expect-error invalid MuiPickersSlideTransition prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_s = {
                        backgroundColor: 'red'
                    },
                    _s[".".concat(DateCalendar_1.pickersSlideTransitionClasses.slideExit)] = {
                        backgroundColor: 'green',
                    },
                    _s),
                // @ts-expect-error invalid MuiPickersSlideTransition class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersToolbar: {
            defaultProps: {
                toolbarTitle: 'some title',
                // @ts-expect-error invalid MuiPickersToolbar prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiPickersToolbar class key
                contentWrapper: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersToolbarButton: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiPickersToolbarButton prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiPickersToolbarButton class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersToolbarText: {
            defaultProps: {
                className: 'klass',
                // @ts-expect-error invalid MuiPickersToolbarText prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiPickersToolbarText class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersLayout: {
            defaultProps: {
                className: 'some classname',
                // @ts-expect-error invalid MuiPickersLayout prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                contentWrapper: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiPickersLayout class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiTimeClock: {
            defaultProps: {
                view: 'hours',
                // @ts-expect-error invalid MuiTimeCLock prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_t = {
                        backgroundColor: 'red'
                    },
                    _t[".".concat(TimeClock_1.timeClockClasses.arrowSwitcher)] = {
                        backgroundColor: 'green',
                    },
                    _t),
                // @ts-expect-error invalid MuiTimeClock class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiTimeField: {
            defaultProps: {
                className: 'class',
                // @ts-expect-error invalid MuiTimeField prop
                someRandomProp: true,
            },
        },
        MuiTimePickerToolbar: {
            defaultProps: {
                hidden: false,
                // @ts-expect-error invalid MuiTimePickerToolbar prop
                view: 'hours',
            },
            styleOverrides: {
                root: (_u = {
                        backgroundColor: 'red'
                    },
                    _u[".".concat(TimePicker_1.timePickerToolbarClasses.separator)] = {
                        backgroundColor: 'green',
                    },
                    _u),
                // @ts-expect-error invalid MuiTimePickerToolbar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiYearCalendar: {
            defaultProps: {
                disableFuture: true,
                // @ts-expect-error invalid MuiYearCalendar prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiYearCalendar class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        // Date Pickers
        MuiDatePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiDatePicker prop
                someRandomProp: true,
            },
        },
        MuiDesktopDatePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiDesktopDatePicker prop
                someRandomProp: true,
            },
        },
        MuiMobileDatePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiMobileDatePicker prop
                someRandomProp: true,
            },
        },
        MuiStaticDatePicker: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiStaticDatePicker prop
                someRandomProp: true,
            },
        },
        // Time Pickers
        MuiTimePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiTimePicker prop
                someRandomProp: true,
            },
        },
        MuiDesktopTimePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiDesktopTimePicker prop
                someRandomProp: true,
            },
        },
        MuiMobileTimePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiMobileTimePicker prop
                someRandomProp: true,
            },
        },
        MuiStaticTimePicker: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiStaticTimePicker prop
                someRandomProp: true,
            },
        },
        // Date Time Pickers
        MuiDesktopDateTimePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiDesktopDateTimePicker prop
                someRandomProp: true,
            },
        },
        MuiMobileDateTimePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiMobileDateTimePicker prop
                someRandomProp: true,
            },
        },
        MuiDateTimePicker: {
            defaultProps: {
                open: true,
                // @ts-expect-error invalid MuiDateTimePicker prop
                someRandomProp: true,
            },
        },
        MuiStaticDateTimePicker: {
            defaultProps: {
                disabled: true,
                // @ts-expect-error invalid MuiStaticDateTimePicker prop
                someRandomProp: true,
            },
        },
        // V7 Pickers's TextField
        MuiPickersTextField: {
            defaultProps: {
                classes: { root: 'test' },
                // @ts-expect-error invalid MuiPickersTextField prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiPickersTextField class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersInputBase: {
            defaultProps: {
                classes: { root: 'test' },
                // @ts-expect-error invalid MuiPickersInputBase prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: function (_a) {
                    var _b;
                    var ownerState = _a.ownerState;
                    return (_b = {
                            backgroundColor: 'red'
                        },
                        _b[".".concat(PickersTextField_1.pickersInputBaseClasses.activeBar)] = {
                            backgroundColor: ownerState.isPickerReadOnly ? 'green' : 'blue',
                        },
                        _b);
                },
                // @ts-expect-error invalid MuiPickersInputBase class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersInput: {
            defaultProps: {
                classes: { root: 'test' },
                // @ts-expect-error invalid MuiPickersInput prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiPickersInput class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersFilledInput: {
            defaultProps: {
                classes: { root: 'test' },
                // @ts-expect-error invalid MuiPickersFilledInput prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiPickersFilledInput class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersOutlinedInput: {
            defaultProps: {
                classes: { root: 'test' },
                // @ts-expect-error invalid MuiPickersOutlinedInput prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiPickersOutlinedInput class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiPickersSectionList: {
            defaultProps: {
                classes: { root: 'test' },
                // @ts-expect-error invalid MuiPickersSectionList prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid MuiPickersSectionList class key
                content: {
                    backgroundColor: 'blue',
                },
            },
        },
    },
});
