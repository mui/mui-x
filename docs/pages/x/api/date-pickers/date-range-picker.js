import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateRangePicker } from './types.date-range-picker';

const allowedProps = ['autoFocus', 'calendars', 'closeOnSelect', 'currentMonthCalendarPosition', 'dayOfWeekFormatter', 'defaultRangePosition', 'defaultValue', 'desktopModeMediaQuery', 'disableAutoMonthSwitching', 'disableDragEditing', 'disableFuture', 'disableHighlightToday', 'disableOpenPicker', 'disablePast', 'disabled', 'displayWeekNumber', 'fixedWeekNumber', 'format', 'formatDensity', 'inputRef', 'keepOpenDuringFieldFocus', 'label', 'loading', 'localeText', 'maxDate', 'minDate', 'name', 'onAccept', 'onChange', 'onClose', 'onError', 'onMonthChange', 'onOpen', 'onRangePositionChange', 'onSelectedSectionsChange', 'open', 'rangePosition', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'selectedSections', 'shouldDisableDate', 'showDaysOutsideCurrentMonth', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'viewRenderers'];

export default function Page() {
  return (
    <TypesPageShell name="DateRangePicker" allowedProps={allowedProps}>
      <TypesDateRangePicker />
    </TypesPageShell>
  );
}
