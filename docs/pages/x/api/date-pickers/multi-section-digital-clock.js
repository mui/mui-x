import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMultiSectionDigitalClock } from './types.multi-section-digital-clock';

const allowedProps = ['ampm', 'autoFocus', 'classes', 'defaultValue', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'focusedView', 'maxTime', 'minTime', 'minutesStep', 'onChange', 'onFocusedViewChange', 'onViewChange', 'openTo', 'readOnly', 'referenceDate', 'shouldDisableTime', 'skipDisabled', 'slotProps', 'slots', 'sx', 'timeSteps', 'timezone', 'value', 'view', 'views'];

export default function Page() {
  return (
    <TypesPageShell name="MultiSectionDigitalClock" allowedProps={allowedProps}>
      <TypesMultiSectionDigitalClock />
    </TypesPageShell>
  );
}
