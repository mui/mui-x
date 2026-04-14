import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesStaticTimePicker } from './types.static-time-picker';

const allowedProps = ['ampm', 'ampmInClock', 'autoFocus', 'defaultValue', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'displayStaticWrapperAs', 'localeText', 'maxTime', 'minTime', 'minutesStep', 'onAccept', 'onChange', 'onClose', 'onError', 'onViewChange', 'openTo', 'orientation', 'readOnly', 'reduceAnimations', 'referenceDate', 'shouldDisableTime', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'view', 'viewRenderers', 'views'];

export default function Page() {
  return (
    <TypesPageShell name="StaticTimePicker" allowedProps={allowedProps}>
      <TypesStaticTimePicker />
    </TypesPageShell>
  );
}
