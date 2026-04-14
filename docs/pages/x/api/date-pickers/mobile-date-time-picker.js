import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMobileDateTimePicker } from './types.mobile-date-time-picker';

const allowedProps = ['ampm', 'ampmInClock', 'autoFocus', 'closeOnSelect', 'dayOfWeekFormatter', 'defaultValue', 'disableFuture', 'disableHighlightToday', 'disableIgnoringDatePartForTimeValidation', 'disableOpenPicker', 'disablePast', 'disabled', 'displayWeekNumber', 'fixedWeekNumber', 'format', 'formatDensity', 'inputRef', 'keepOpenDuringFieldFocus', 'label', 'loading', 'localeText', 'maxDate', 'maxDateTime', 'maxTime', 'minDate', 'minDateTime', 'minTime', 'minutesStep', 'monthsPerRow', 'name', 'onAccept', 'onChange', 'onClose', 'onError', 'onMonthChange', 'onOpen', 'onSelectedSectionsChange', 'onViewChange', 'onYearChange', 'open', 'openTo', 'orientation', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'selectedSections', 'shouldDisableDate', 'shouldDisableMonth', 'shouldDisableTime', 'shouldDisableYear', 'showDaysOutsideCurrentMonth', 'skipDisabled', 'slotProps', 'slots', 'sx', 'thresholdToRenderTimeInASingleColumn', 'timeSteps', 'timezone', 'value', 'view', 'viewRenderers', 'views', 'yearsOrder', 'yearsPerRow'];

export default function Page() {
  return (
    <TypesPageShell name="MobileDateTimePicker" allowedProps={allowedProps}>
      <TypesMobileDateTimePicker />
    </TypesPageShell>
  );
}
