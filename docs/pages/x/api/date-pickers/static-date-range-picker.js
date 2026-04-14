import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesStaticDateRangePicker } from './types.static-date-range-picker';

const allowedProps = ['autoFocus', 'calendars', 'currentMonthCalendarPosition', 'dayOfWeekFormatter', 'defaultRangePosition', 'defaultValue', 'disableAutoMonthSwitching', 'disableDragEditing', 'disableFuture', 'disableHighlightToday', 'disablePast', 'disabled', 'displayStaticWrapperAs', 'displayWeekNumber', 'fixedWeekNumber', 'loading', 'localeText', 'maxDate', 'minDate', 'onAccept', 'onChange', 'onClose', 'onError', 'onMonthChange', 'onRangePositionChange', 'rangePosition', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'shouldDisableDate', 'showDaysOutsideCurrentMonth', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'viewRenderers'];

export default function Page() {
  return (
    <TypesPageShell name="StaticDateRangePicker" allowedProps={allowedProps}>
      <TypesStaticDateRangePicker />
    </TypesPageShell>
  );
}
