import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTimePicker } from './types.time-picker';

const allowedProps = ['ampm', 'ampmInClock', 'autoFocus', 'closeOnSelect', 'defaultValue', 'desktopModeMediaQuery', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disableOpenPicker', 'disablePast', 'disabled', 'format', 'formatDensity', 'inputRef', 'keepOpenDuringFieldFocus', 'label', 'localeText', 'maxTime', 'minTime', 'minutesStep', 'name', 'onAccept', 'onChange', 'onClose', 'onError', 'onOpen', 'onSelectedSectionsChange', 'onViewChange', 'open', 'openTo', 'orientation', 'readOnly', 'reduceAnimations', 'referenceDate', 'selectedSections', 'shouldDisableTime', 'skipDisabled', 'slotProps', 'slots', 'sx', 'thresholdToRenderTimeInASingleColumn', 'timeSteps', 'timezone', 'value', 'view', 'viewRenderers', 'views'];

export default function Page() {
  return (
    <TypesPageShell name="TimePicker" allowedProps={allowedProps}>
      <TypesTimePicker />
    </TypesPageShell>
  );
}
