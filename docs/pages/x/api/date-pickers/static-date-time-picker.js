import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesStaticDateTimePicker } from './types.static-date-time-picker';

const allowedProps = ['ampm', 'ampmInClock', 'autoFocus', 'dayOfWeekFormatter', 'defaultValue', 'disableFuture', 'disableHighlightToday', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'displayStaticWrapperAs', 'displayWeekNumber', 'fixedWeekNumber', 'loading', 'localeText', 'maxDate', 'maxDateTime', 'maxTime', 'minDate', 'minDateTime', 'minTime', 'minutesStep', 'monthsPerRow', 'onAccept', 'onChange', 'onClose', 'onError', 'onMonthChange', 'onViewChange', 'onYearChange', 'openTo', 'orientation', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'shouldDisableDate', 'shouldDisableMonth', 'shouldDisableTime', 'shouldDisableYear', 'showDaysOutsideCurrentMonth', 'skipDisabled', 'slotProps', 'slots', 'sx', 'thresholdToRenderTimeInASingleColumn', 'timeSteps', 'timezone', 'value', 'view', 'viewRenderers', 'views', 'yearsOrder', 'yearsPerRow'];

export default function Page() {
  return (
    <TypesPageShell name="StaticDateTimePicker" allowedProps={allowedProps}>
      <TypesStaticDateTimePicker />
    </TypesPageShell>
  );
}
