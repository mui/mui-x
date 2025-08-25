"use strict";
'use client';
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
exports.EventPopover = void 0;
exports.EventPopoverProvider = EventPopoverProvider;
exports.EventPopoverTrigger = EventPopoverTrigger;
var React = require("react");
var clsx_1 = require("clsx");
var popover_1 = require("@base-ui-components/react/popover");
var separator_1 = require("@base-ui-components/react/separator");
var field_1 = require("@base-ui-components/react/field");
var form_1 = require("@base-ui-components/react/form");
var checkbox_1 = require("@base-ui-components/react/checkbox");
var lucide_react_1 = require("lucide-react");
var input_1 = require("@base-ui-components/react/input");
var store_1 = require("@base-ui-components/utils/store");
var useEventCallback_1 = require("@base-ui-components/utils/useEventCallback");
var select_1 = require("@base-ui-components/react/select");
var useAdapter_1 = require("../../../../primitives/utils/adapter/useAdapter");
var color_utils_1 = require("../../utils/color-utils");
var TranslationsContext_1 = require("../../utils/TranslationsContext");
var use_event_calendar_1 = require("../../../../primitives/use-event-calendar");
var useEventCalendarContext_1 = require("../../hooks/useEventCalendarContext");
require("./EventPopover.css");
var recurrence_utils_1 = require("../../../../primitives/utils/recurrence-utils");
exports.EventPopover = React.forwardRef(function EventPopover(props, forwardedRef) {
    var _a, _b, _c, _d, _e;
    var className = props.className, style = props.style, container = props.container, anchor = props.anchor, calendarEvent = props.calendarEvent, calendarEventResource = props.calendarEventResource, onClose = props.onClose, other = __rest(props, ["className", "style", "container", "anchor", "calendarEvent", "calendarEventResource", "onClose"]);
    var adapter = (0, useAdapter_1.useAdapter)();
    var translations = (0, TranslationsContext_1.useTranslations)();
    var _f = (0, useEventCalendarContext_1.useEventCalendarContext)(), store = _f.store, instance = _f.instance;
    var isEventReadOnly = (0, store_1.useStore)(store, use_event_calendar_1.selectors.isEventReadOnly, calendarEvent);
    var isRecurring = Boolean(calendarEvent.rrule);
    var _g = React.useState({}), errors = _g[0], setErrors = _g[1];
    var _h = React.useState(Boolean(calendarEvent.allDay)), isAllDay = _h[0], setIsAllDay = _h[1];
    var recurrencePresets = React.useMemo(function () { return (0, recurrence_utils_1.buildRecurrencePresets)(adapter, calendarEvent.start); }, [adapter, calendarEvent.start]);
    var weekday = adapter.format(calendarEvent.start, 'weekday');
    var normalDate = adapter.format(calendarEvent.start, 'normalDate');
    var recurrenceOptions = [
        { label: "".concat(translations.recurrenceNoRepeat), value: null },
        { label: "".concat(translations.recurrenceDailyPresetLabel), value: 'daily' },
        {
            label: "".concat(translations.recurrenceWeeklyPresetLabel(weekday)),
            value: 'weekly',
        },
        {
            label: "".concat(translations.recurrenceMonthlyPresetLabel(adapter.getDate(calendarEvent.start))),
            value: 'monthly',
        },
        {
            label: "".concat(translations.recurrenceYearlyPresetLabel(normalDate)),
            value: 'yearly',
        },
    ];
    var defaultRecurrenceKey = React.useMemo(function () { return (0, recurrence_utils_1.detectRecurrenceKeyFromRule)(adapter, calendarEvent.rrule, calendarEvent.start); }, [adapter, calendarEvent.rrule, calendarEvent.start]);
    var handleSubmit = function (event) {
        var _a;
        event.preventDefault();
        var form = new FormData(event.currentTarget);
        var startDateValue = form.get('startDate');
        var startTimeValue = form.get('startTime');
        var endDateValue = form.get('endDate');
        var endTimeValue = form.get('endTime');
        var recurrenceKey = form.get('recurrence');
        var rrule = recurrenceKey ? recurrencePresets[recurrenceKey] : calendarEvent.rrule;
        var startISO = startTimeValue
            ? "".concat(startDateValue, "T").concat(startTimeValue)
            : "".concat(startDateValue, "T00:00");
        var endISO = endTimeValue ? "".concat(endDateValue, "T").concat(endTimeValue) : "".concat(endDateValue, "T23:59");
        var start = adapter.date(startISO);
        var end = adapter.date(endISO);
        setErrors({});
        if (adapter.isAfter(start, end) || adapter.isEqual(start, end)) {
            var isSameDay = adapter.isEqual(adapter.startOfDay(start), adapter.startOfDay(end));
            setErrors((_a = {},
                _a[isSameDay ? 'startTime' : 'startDate'] = translations.startDateAfterEndDateError,
                _a));
            return;
        }
        instance.updateEvent(__assign(__assign({}, calendarEvent), { title: form.get('title').trim(), description: form.get('description').trim(), start: start, end: end, allDay: isAllDay, rrule: rrule }));
        onClose();
    };
    var handleDelete = (0, useEventCallback_1.useEventCallback)(function () {
        instance.deleteEvent(calendarEvent.id);
        onClose();
    });
    return (<div ref={forwardedRef} className={className} {...other}>
      <popover_1.Popover.Portal container={container}>
        <popover_1.Popover.Positioner sideOffset={8} anchor={anchor} trackAnchor={false} className={(0, clsx_1.default)('PopoverPositioner', (0, color_utils_1.getColorClassName)({ resource: calendarEventResource }))}>
          <popover_1.Popover.Popup finalFocus={{ current: anchor }}>
            <form_1.Form errors={errors} onClearErrors={setErrors} onSubmit={handleSubmit}>
              <header className="EventPopoverHeader">
                <field_1.Field.Root className="EventPopoverFieldRoot" name="title" disabled={isRecurring}>
                  <field_1.Field.Label className="EventPopoverTitle">
                    <input_1.Input className="EventPopoverTitleInput" type="text" defaultValue={calendarEvent.title} aria-label={translations.eventTitleAriaLabel} required readOnly={isEventReadOnly}/>
                  </field_1.Field.Label>
                  <field_1.Field.Error className="EventPopoverRequiredFieldError"/>
                </field_1.Field.Root>
                <popover_1.Popover.Close aria-label={translations.closeButtonAriaLabel} className="EventPopoverCloseButton">
                  <lucide_react_1.X size={18} strokeWidth={2}/>
                </popover_1.Popover.Close>
              </header>
              <separator_1.Separator className="EventPopoverSeparator"/>
              <div className="EventPopoverMainContent">
                <div className="EventPopoverDateTimeFields">
                  <div className="EventPopoverDateTimeFieldsStartRow">
                    <field_1.Field.Root className="EventPopoverFieldRoot" name="startDate" disabled={isRecurring}>
                      <field_1.Field.Label className="EventPopoverFormLabel">
                        {translations.startDateLabel}
                        <input_1.Input className="EventPopoverInput" type="date" defaultValue={(_a = adapter.formatByString(calendarEvent.start, 'yyyy-MM-dd')) !== null && _a !== void 0 ? _a : ''} aria-describedby="startDate-error" required readOnly={isEventReadOnly}/>
                      </field_1.Field.Label>
                    </field_1.Field.Root>
                    {!isAllDay && (<field_1.Field.Root className="EventPopoverFieldRoot" name="startTime" disabled={isRecurring}>
                        <field_1.Field.Label className="EventPopoverFormLabel">
                          {translations.startTimeLabel}
                          <input_1.Input className="EventPopoverInput" type="time" defaultValue={(_b = adapter.formatByString(calendarEvent.start, 'HH:mm')) !== null && _b !== void 0 ? _b : ''} aria-describedby="startTime-error" required readOnly={isEventReadOnly}/>
                        </field_1.Field.Label>
                      </field_1.Field.Root>)}
                  </div>
                  <div className="EventPopoverDateTimeFieldsEndRow">
                    <field_1.Field.Root className="EventPopoverFieldRoot" name="endDate" disabled={isRecurring}>
                      <field_1.Field.Label className="EventPopoverFormLabel">
                        {translations.endDateLabel}
                        <input_1.Input className="EventPopoverInput" type="date" defaultValue={(_c = adapter.formatByString(calendarEvent.end, 'yyyy-MM-dd')) !== null && _c !== void 0 ? _c : ''} required readOnly={isEventReadOnly}/>
                      </field_1.Field.Label>
                    </field_1.Field.Root>
                    {!isAllDay && (<field_1.Field.Root className="EventPopoverFieldRoot" name="endTime" disabled={isRecurring}>
                        <field_1.Field.Label className="EventPopoverFormLabel">
                          {translations.endTimeLabel}
                          <input_1.Input className="EventPopoverInput" type="time" defaultValue={(_d = adapter.formatByString(calendarEvent.end, 'HH:mm')) !== null && _d !== void 0 ? _d : ''} required readOnly={isEventReadOnly}/>
                        </field_1.Field.Label>
                      </field_1.Field.Root>)}
                  </div>
                  <field_1.Field.Root name="startDate" className="EventPopoverDateTimeFieldsError" id="startDate-error" aria-live="polite">
                    <field_1.Field.Error />
                  </field_1.Field.Root>
                  <field_1.Field.Root name="startTime" className="EventPopoverDateTimeFieldsError" id="startTime-error" aria-live="polite">
                    <field_1.Field.Error />
                  </field_1.Field.Root>
                  <field_1.Field.Root className="EventPopoverFieldRoot" name="allDay" disabled={isRecurring}>
                    <field_1.Field.Label className="AllDayCheckboxLabel">
                      <checkbox_1.Checkbox.Root className="AllDayCheckboxRoot" id="enable-all-day-checkbox" checked={isAllDay} onCheckedChange={setIsAllDay} readOnly={isEventReadOnly}>
                        <checkbox_1.Checkbox.Indicator className="AllDayCheckboxIndicator">
                          <lucide_react_1.CheckIcon className="AllDayCheckboxIcon"/>
                        </checkbox_1.Checkbox.Indicator>
                      </checkbox_1.Checkbox.Root>
                      {translations.allDayLabel}
                    </field_1.Field.Label>
                  </field_1.Field.Root>
                </div>
                <field_1.Field.Root className="EventPopoverFieldRoot" name="recurrence" disabled={isRecurring}>
                  {defaultRecurrenceKey === 'custom' ? (
        // TODO: Issue #19137 - Display the actual custom recurrence rule (e.g. "Repeats every 2 weeks on Monday")
        <p className="EventPopoverFormLabel">{"Custom ".concat((_e = calendarEvent.rrule) === null || _e === void 0 ? void 0 : _e.freq.toLowerCase(), " recurrence")}</p>) : (<select_1.Select.Root items={recurrenceOptions} defaultValue={defaultRecurrenceKey} readOnly={isEventReadOnly}>
                      <select_1.Select.Trigger className="EventPopoverSelectTrigger" aria-label={translations.recurrenceLabel}>
                        <select_1.Select.Value />
                        <select_1.Select.Icon className="EventPopoverSelectIcon">
                          <lucide_react_1.ChevronDown size={14}/>
                        </select_1.Select.Icon>
                      </select_1.Select.Trigger>
                      <select_1.Select.Portal>
                        <select_1.Select.Positioner className="EventPopoverSelectPositioner">
                          <select_1.Select.Popup className="EventPopoverSelectPopup">
                            {recurrenceOptions.map(function (_a) {
                var label = _a.label, value = _a.value;
                return (<select_1.Select.Item key={label} value={value} className="EventPopoverSelectItem">
                                <select_1.Select.ItemIndicator className="EventPopoverSelectItemIndicator">
                                  <lucide_react_1.CheckIcon size={14} className="EventPopoverSelectItemIndicatorIcon"/>
                                </select_1.Select.ItemIndicator>
                                <select_1.Select.ItemText className="EventPopoverSelectItemText">
                                  {label}
                                </select_1.Select.ItemText>
                              </select_1.Select.Item>);
            })}
                          </select_1.Select.Popup>
                        </select_1.Select.Positioner>
                      </select_1.Select.Portal>
                    </select_1.Select.Root>)}
                </field_1.Field.Root>
                {isRecurring && (<p className="EventPopoverEditDisabledNotice">
                    {translations.editDisabledNotice}
                  </p>)}
                <separator_1.Separator className="EventPopoverSeparator"/>
                <div>
                  <field_1.Field.Root className="EventPopoverFieldRoot" name="description" disabled={isRecurring}>
                    <field_1.Field.Label className="EventPopoverFormLabel">
                      {translations.descriptionLabel}
                      <input_1.Input render={<textarea className="EventPopoverTextarea" defaultValue={calendarEvent.description} rows={5}/>} readOnly={isEventReadOnly}/>
                    </field_1.Field.Label>
                  </field_1.Field.Root>
                </div>
              </div>
              <separator_1.Separator className="EventPopoverSeparator"/>
              {!isEventReadOnly && (<div className="EventPopoverActions">
                  <button className={(0, clsx_1.default)('SecondaryErrorButton', 'Button')} type="button" onClick={handleDelete}>
                    {translations.deleteEvent}
                  </button>
                  <button className={(0, clsx_1.default)('NeutralButton', 'Button')} type="submit">
                    {translations.saveChanges}
                  </button>
                </div>)}
            </form_1.Form>
          </popover_1.Popover.Popup>
        </popover_1.Popover.Positioner>
      </popover_1.Popover.Portal>
    </div>);
});
var EventPopoverContext = React.createContext({
    startEditing: function () { },
});
function EventPopoverProvider(props) {
    var containerRef = props.containerRef, children = props.children;
    var _a = React.useState(false), isPopoverOpen = _a[0], setIsPopoverOpen = _a[1];
    var _b = React.useState(null), anchor = _b[0], setAnchor = _b[1];
    var _c = React.useState(null), selectedEvent = _c[0], setSelectedEvent = _c[1];
    var store = (0, useEventCalendarContext_1.useEventCalendarContext)().store;
    var resourcesByIdMap = (0, store_1.useStore)(store, use_event_calendar_1.selectors.resourcesByIdMap);
    var startEditing = (0, useEventCallback_1.useEventCallback)(function (event, calendarEvent) {
        setAnchor(event.currentTarget);
        setSelectedEvent(calendarEvent);
        setIsPopoverOpen(true);
    });
    var handleClose = (0, useEventCallback_1.useEventCallback)(function () {
        if (!isPopoverOpen) {
            return;
        }
        setIsPopoverOpen(false);
        setAnchor(null);
        setSelectedEvent(null);
    });
    var contextValue = React.useMemo(function () { return ({ startEditing: startEditing }); }, [startEditing]);
    return (<EventPopoverContext.Provider value={contextValue}>
      <popover_1.Popover.Root open={isPopoverOpen} onOpenChange={handleClose} modal>
        {children}
        {anchor && selectedEvent && (<exports.EventPopover anchor={anchor} calendarEvent={selectedEvent} calendarEventResource={resourcesByIdMap.get(selectedEvent.resource)} container={containerRef.current} onClose={handleClose}/>)}
      </popover_1.Popover.Root>
    </EventPopoverContext.Provider>);
}
function EventPopoverTrigger(props) {
    var calendarEvent = props.event, other = __rest(props, ["event"]);
    var startEditing = React.useContext(EventPopoverContext).startEditing;
    return (<popover_1.Popover.Trigger nativeButton={false} onClick={function (event) { return startEditing(event, calendarEvent); }} {...other}/>);
}
