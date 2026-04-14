import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTimeClock } from './types.time-clock';

const allowedProps = ['ampm', 'ampmInClock', 'autoFocus', 'classes', 'defaultValue', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'focusedView', 'maxTime', 'minTime', 'minutesStep', 'onChange', 'onFocusedViewChange', 'onViewChange', 'openTo', 'readOnly', 'referenceDate', 'shouldDisableTime', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'view', 'views'];

export default function Page() {
  return (
    <TypesPageShell name="TimeClock" allowedProps={allowedProps}>
      <TypesTimeClock />
    </TypesPageShell>
  );
}
