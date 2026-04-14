import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMobileTimePicker } from './types.mobile-time-picker';

const allowedProps = ['ampm', 'ampmInClock', 'autoFocus', 'closeOnSelect', 'defaultValue', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disableOpenPicker', 'disablePast', 'disabled', 'format', 'formatDensity', 'inputRef', 'keepOpenDuringFieldFocus', 'label', 'localeText', 'maxTime', 'minTime', 'minutesStep', 'name', 'onAccept', 'onChange', 'onClose', 'onError', 'onOpen', 'onSelectedSectionsChange', 'onViewChange', 'open', 'openTo', 'orientation', 'readOnly', 'reduceAnimations', 'referenceDate', 'selectedSections', 'shouldDisableTime', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'view', 'viewRenderers', 'views'];

export default function Page() {
  return (
    <TypesPageShell name="MobileTimePicker" allowedProps={allowedProps}>
      <TypesMobileTimePicker />
    </TypesPageShell>
  );
}
