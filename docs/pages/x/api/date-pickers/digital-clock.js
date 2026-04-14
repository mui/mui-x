import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDigitalClock } from './types.digital-clock';

const allowedProps = ['ampm', 'autoFocus', 'classes', 'defaultValue', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'focusedView', 'maxTime', 'minTime', 'minutesStep', 'onChange', 'onFocusedViewChange', 'onViewChange', 'openTo', 'readOnly', 'referenceDate', 'shouldDisableTime', 'skipDisabled', 'slotProps', 'slots', 'sx', 'timeStep', 'timezone', 'value', 'view', 'views'];

export default function Page() {
  return (
    <TypesPageShell name="DigitalClock" allowedProps={allowedProps}>
      <TypesDigitalClock />
    </TypesPageShell>
  );
}
