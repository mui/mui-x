import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateRangePickerDay } from './types.date-range-picker-day';

const allowedProps = ['TouchRippleProps', 'action', 'centerRipple', 'classes', 'day', 'disableHighlightToday', 'disableRipple', 'disableTouchRipple', 'disabled', 'draggable', 'focusRipple', 'focusVisibleClassName', 'isAnimating', 'isDayFillerCell', 'isEndOfHighlighting', 'isEndOfPreviewing', 'isFirstVisibleCell', 'isHighlighting', 'isLastVisibleCell', 'isPreviewing', 'isStartOfHighlighting', 'isStartOfPreviewing', 'isVisuallySelected', 'nativeButton', 'onBlur', 'onClick', 'onDaySelect', 'onFocus', 'onFocusVisible', 'onKeyDown', 'onMouseDown', 'onMouseEnter', 'outsideCurrentMonth', 'selected', 'showDaysOutsideCurrentMonth', 'sx', 'today', 'touchRippleRef'];

export default function Page() {
  return (
    <TypesPageShell name="DateRangePickerDay" allowedProps={allowedProps}>
      <TypesDateRangePickerDay />
    </TypesPageShell>
  );
}
