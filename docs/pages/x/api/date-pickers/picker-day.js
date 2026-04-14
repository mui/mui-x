import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPickerDay } from './types.picker-day';

const allowedProps = ['TouchRippleProps', 'action', 'centerRipple', 'classes', 'day', 'disableHighlightToday', 'disableRipple', 'disableTouchRipple', 'disabled', 'focusRipple', 'focusVisibleClassName', 'isAnimating', 'isDayFillerCell', 'isFirstVisibleCell', 'isLastVisibleCell', 'isVisuallySelected', 'nativeButton', 'onBlur', 'onClick', 'onDaySelect', 'onFocus', 'onFocusVisible', 'onKeyDown', 'onMouseDown', 'onMouseEnter', 'outsideCurrentMonth', 'selected', 'showDaysOutsideCurrentMonth', 'sx', 'today', 'touchRippleRef'];

export default function Page() {
  return (
    <TypesPageShell name="PickerDay" allowedProps={allowedProps}>
      <TypesPickerDay />
    </TypesPageShell>
  );
}
