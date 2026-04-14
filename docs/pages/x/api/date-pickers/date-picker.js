import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDatePicker } from './types.date-picker';

const allowedProps = ['autoFocus', 'closeOnSelect', 'dayOfWeekFormatter', 'defaultValue', 'desktopModeMediaQuery', 'disableFuture', 'disableHighlightToday', 'disableOpenPicker', 'disablePast', 'disabled', 'displayWeekNumber', 'fixedWeekNumber', 'format', 'formatDensity', 'inputRef', 'keepOpenDuringFieldFocus', 'label', 'loading', 'localeText', 'maxDate', 'minDate', 'monthsPerRow', 'name', 'onAccept', 'onChange', 'onClose', 'onError', 'onMonthChange', 'onOpen', 'onSelectedSectionsChange', 'onViewChange', 'onYearChange', 'open', 'openTo', 'orientation', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'selectedSections', 'shouldDisableDate', 'shouldDisableMonth', 'shouldDisableYear', 'showDaysOutsideCurrentMonth', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'view', 'viewRenderers', 'views', 'yearsOrder', 'yearsPerRow'];

export default function Page() {
  return (
    <TypesPageShell name="DatePicker" allowedProps={allowedProps}>
      <TypesDatePicker />
    </TypesPageShell>
  );
}
