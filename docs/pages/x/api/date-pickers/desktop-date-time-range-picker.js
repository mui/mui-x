import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDesktopDateTimeRangePicker } from './types.desktop-date-time-range-picker';

const allowedProps = ['ampm', 'autoFocus', 'calendars', 'closeOnSelect', 'currentMonthCalendarPosition', 'dayOfWeekFormatter', 'defaultRangePosition', 'defaultValue', 'disableAutoMonthSwitching', 'disableDragEditing', 'disableFuture', 'disableHighlightToday', 'disableIgnoringDatePartForTimeValidation', 'disableOpenPicker', 'disablePast', 'disabled', 'displayWeekNumber', 'fixedWeekNumber', 'format', 'formatDensity', 'inputRef', 'keepOpenDuringFieldFocus', 'label', 'loading', 'localeText', 'maxDate', 'maxDateTime', 'maxTime', 'minDate', 'minDateTime', 'minTime', 'minutesStep', 'name', 'onAccept', 'onChange', 'onClose', 'onError', 'onMonthChange', 'onOpen', 'onRangePositionChange', 'onSelectedSectionsChange', 'onViewChange', 'open', 'openTo', 'rangePosition', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'selectedSections', 'shouldDisableDate', 'shouldDisableTime', 'showDaysOutsideCurrentMonth', 'skipDisabled', 'slotProps', 'slots', 'sx', 'thresholdToRenderTimeInASingleColumn', 'timeSteps', 'timezone', 'value', 'view', 'viewRenderers', 'views'];

export default function Page() {
  return (
    <TypesPageShell name="DesktopDateTimeRangePicker" allowedProps={allowedProps}>
      <TypesDesktopDateTimeRangePicker />
    </TypesPageShell>
  );
}
