"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MonthViewWeekRow;
var React = require("react");
var clsx_1 = require("clsx");
var store_1 = require("@base-ui-components/utils/store");
var getAdapter_1 = require("../../../primitives/utils/adapter/getAdapter");
var day_grid_1 = require("../../../primitives/day-grid");
var useDayList_1 = require("../../../primitives/use-day-list/useDayList");
var useEventCalendarContext_1 = require("../../internals/hooks/useEventCalendarContext");
var DayGridEvent_1 = require("../../internals/components/event/day-grid-event/DayGridEvent");
var date_utils_1 = require("../../../primitives/utils/date-utils");
var event_utils_1 = require("../../../primitives/utils/event-utils");
var event_popover_1 = require("../../internals/components/event-popover");
var TranslationsContext_1 = require("../../internals/utils/TranslationsContext");
var use_event_calendar_1 = require("../../../primitives/use-event-calendar");
require("./MonthViewWeekRow.css");
var adapter = (0, getAdapter_1.getAdapter)();
function MonthViewWeekRow(props) {
    var maxEvents = props.maxEvents, week = props.week, firstDayRef = props.firstDayRef;
    var _a = (0, useEventCalendarContext_1.useEventCalendarContext)(), store = _a.store, instance = _a.instance;
    var resourcesByIdMap = (0, store_1.useStore)(store, use_event_calendar_1.selectors.resourcesByIdMap);
    var hasDayView = (0, store_1.useStore)(store, use_event_calendar_1.selectors.hasDayView);
    var visibleDate = (0, store_1.useStore)(store, use_event_calendar_1.selectors.visibleDate);
    var settings = (0, store_1.useStore)(store, use_event_calendar_1.selectors.settings);
    var today = adapter.date();
    var translations = (0, TranslationsContext_1.useTranslations)();
    var getDayList = (0, useDayList_1.useDayList)();
    var days = React.useMemo(function () { return getDayList({ date: week, amount: 'week', excludeWeekends: settings.hideWeekends }); }, [getDayList, week, settings.hideWeekends]);
    var daysWithEvents = (0, store_1.useStore)(store, use_event_calendar_1.selectors.eventsToRenderGroupedByDay, {
        days: days,
        shouldOnlyRenderEventInOneCell: false,
    });
    var weekNumber = adapter.getWeekNumber(week);
    var renderCellNumberContent = function (day) {
        var isFirstDayOfMonth = adapter.isSameDay(day, adapter.startOfMonth(day));
        return (<span className="MonthViewCellNumber">
        {isFirstDayOfMonth
                ? adapter.formatByString(day, adapter.formats.shortDate)
                : adapter.formatByString(day, adapter.formats.dayOfMonth)}
      </span>);
    };
    return (<day_grid_1.DayGrid.Row key={weekNumber} className="MonthViewRow">
      <div className="MonthViewWeekNumberCell" role="rowheader" aria-label={translations.weekNumberAriaLabel(weekNumber)}>
        {weekNumber}
      </div>
      {daysWithEvents.map(function (_a, dayIdx) {
            var day = _a.day, events = _a.events, allDayEvents = _a.allDayEvents;
            var isCurrentMonth = adapter.isSameMonth(day, visibleDate);
            var isToday = adapter.isSameDay(day, today);
            var visibleAllDayEvents = allDayEvents.slice(0, maxEvents);
            var visibleEvents = events.slice(0, maxEvents - visibleAllDayEvents.length);
            var hiddenCount = events.length + allDayEvents.length - maxEvents;
            var rowCount = 1 +
                (0, event_utils_1.getEventWithLargestRowIndex)(allDayEvents) +
                visibleEvents.length +
                (hiddenCount > 0 ? 1 : 0);
            return (<day_grid_1.DayGrid.Cell ref={dayIdx === 0 ? firstDayRef : undefined} key={day.toString()} className={(0, clsx_1.default)('MonthViewCell', !isCurrentMonth && 'OtherMonth', isToday && 'Today', (0, date_utils_1.isWeekend)(adapter, day) && 'Weekend')} style={{
                    '--row-count': rowCount,
                }}>
            {hasDayView ? (<button type="button" className="MonthViewCellNumberButton" onClick={function (event) { return instance.switchToDay(day, event); }} tabIndex={0}>
                {renderCellNumberContent(day)}
              </button>) : (renderCellNumberContent(day))}

            {visibleAllDayEvents.map(function (event) {
                    var durationInDays = (0, date_utils_1.diffIn)(adapter, event.end, day, 'days') + 1;
                    var gridColumnSpan = Math.min(durationInDays, days.length - dayIdx); // Don't exceed available columns
                    var shouldEventBeVisible = adapter.isSameDay(event.start, day) || dayIdx === 0;
                    return shouldEventBeVisible ? (<event_popover_1.EventPopoverTrigger key={"".concat(event.id, "-").concat(day.toString())} event={event} render={<DayGridEvent_1.DayGridEvent event={event} eventResource={resourcesByIdMap.get(event.resource)} variant="allDay" ariaLabelledBy={"MonthViewHeaderCell-".concat(day.toString())} gridRow={(event.eventRowIndex || 0) + 1} columnSpan={gridColumnSpan}/>}/>) : (<DayGridEvent_1.DayGridEvent key={"invisible-".concat(event.id, "-").concat(day.toString())} event={event} eventResource={resourcesByIdMap.get(event.resource)} variant="invisible" ariaLabelledBy={"MonthViewHeaderCell-".concat(day.toString())} gridRow={(event.eventRowIndex || 0) + 1}/>);
                })}
            {visibleEvents.map(function (event) { return (<event_popover_1.EventPopoverTrigger key={event.key} event={event} render={<DayGridEvent_1.DayGridEvent event={event} eventResource={resourcesByIdMap.get(event.resource)} variant="compact" ariaLabelledBy={"MonthViewHeaderCell-".concat(day.toString())}/>}/>); })}
            {hiddenCount > 0 && events.length > 0 && (<p className="MonthViewMoreEvents">{translations.hiddenEvents(hiddenCount)}</p>)}
          </day_grid_1.DayGrid.Cell>);
        })}
    </day_grid_1.DayGrid.Row>);
}
