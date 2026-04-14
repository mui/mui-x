import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMobileDatePicker } from './types.mobile-date-picker';

const allowedProps = ['autoFocus', 'closeOnSelect', 'dayOfWeekFormatter', 'defaultValue', 'disableFuture', 'disableHighlightToday', 'disableOpenPicker', 'disablePast', 'disabled', 'displayWeekNumber', 'fixedWeekNumber', 'format', 'formatDensity', 'inputRef', 'keepOpenDuringFieldFocus', 'label', 'loading', 'localeText', 'maxDate', 'minDate', 'monthsPerRow', 'name', 'onAccept', 'onChange', 'onClose', 'onError', 'onMonthChange', 'onOpen', 'onSelectedSectionsChange', 'onViewChange', 'onYearChange', 'open', 'openTo', 'orientation', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'selectedSections', 'shouldDisableDate', 'shouldDisableMonth', 'shouldDisableYear', 'showDaysOutsideCurrentMonth', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'view', 'viewRenderers', 'views', 'yearsOrder', 'yearsPerRow'];

export default function Page() {
  return (
    <TypesPageShell name="MobileDatePicker" allowedProps={allowedProps}>
      <TypesMobileDatePicker />
    </TypesPageShell>
  );
}
