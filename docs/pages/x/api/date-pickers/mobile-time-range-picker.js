import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMobileTimeRangePicker } from './types.mobile-time-range-picker';

const allowedProps = ['ampm', 'autoFocus', 'closeOnSelect', 'defaultRangePosition', 'defaultValue', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disableOpenPicker', 'disablePast', 'disabled', 'format', 'formatDensity', 'inputRef', 'keepOpenDuringFieldFocus', 'label', 'localeText', 'maxTime', 'minTime', 'minutesStep', 'name', 'onAccept', 'onChange', 'onClose', 'onError', 'onOpen', 'onRangePositionChange', 'onSelectedSectionsChange', 'onViewChange', 'open', 'openTo', 'rangePosition', 'readOnly', 'reduceAnimations', 'referenceDate', 'selectedSections', 'shouldDisableTime', 'slotProps', 'slots', 'sx', 'thresholdToRenderTimeInASingleColumn', 'timeSteps', 'timezone', 'value', 'view', 'viewRenderers', 'views'];

export default function Page() {
  return (
    <TypesPageShell name="MobileTimeRangePicker" allowedProps={allowedProps}>
      <TypesMobileTimeRangePicker />
    </TypesPageShell>
  );
}
