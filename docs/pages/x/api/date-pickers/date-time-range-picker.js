import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateTimeRangePicker } from './types.date-time-range-picker';

const allowedProps = ['ampm', 'autoFocus', 'calendars', 'closeOnSelect', 'currentMonthCalendarPosition', 'dayOfWeekFormatter', 'defaultRangePosition', 'defaultValue', 'desktopModeMediaQuery', 'disableAutoMonthSwitching', 'disableDragEditing', 'disableFuture', 'disableHighlightToday', 'disableIgnoringDatePartForTimeValidation', 'disableOpenPicker', 'disablePast', 'disabled', 'displayWeekNumber', 'fixedWeekNumber', 'format', 'formatDensity', 'inputRef', 'keepOpenDuringFieldFocus', 'label', 'loading', 'localeText', 'maxDate', 'maxDateTime', 'maxTime', 'minDate', 'minDateTime', 'minTime', 'minutesStep', 'name', 'onAccept', 'onChange', 'onClose', 'onError', 'onMonthChange', 'onOpen', 'onRangePositionChange', 'onSelectedSectionsChange', 'onViewChange', 'open', 'openTo', 'rangePosition', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'selectedSections', 'shouldDisableDate', 'shouldDisableTime', 'showDaysOutsideCurrentMonth', 'skipDisabled', 'slotProps', 'slots', 'sx', 'thresholdToRenderTimeInASingleColumn', 'timeSteps', 'timezone', 'value', 'view', 'viewRenderers', 'views'];

export default function Page() {
  return (
    <TypesPageShell name="DateTimeRangePicker" allowedProps={allowedProps}>
      <TypesDateTimeRangePicker />
    </TypesPageShell>
  );
}
