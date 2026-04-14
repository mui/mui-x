import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesStaticDatePicker } from './types.static-date-picker';

const allowedProps = ['autoFocus', 'dayOfWeekFormatter', 'defaultValue', 'disableFuture', 'disableHighlightToday', 'disablePast', 'disabled', 'displayStaticWrapperAs', 'displayWeekNumber', 'fixedWeekNumber', 'loading', 'localeText', 'maxDate', 'minDate', 'monthsPerRow', 'onAccept', 'onChange', 'onClose', 'onError', 'onMonthChange', 'onViewChange', 'onYearChange', 'openTo', 'orientation', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'shouldDisableDate', 'shouldDisableMonth', 'shouldDisableYear', 'showDaysOutsideCurrentMonth', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'view', 'viewRenderers', 'views', 'yearsOrder', 'yearsPerRow'];

export default function Page() {
  return (
    <TypesPageShell name="StaticDatePicker" allowedProps={allowedProps}>
      <TypesStaticDatePicker />
    </TypesPageShell>
  );
}
