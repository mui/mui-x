import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMultiInputTimeRangeField } from './types.multi-input-time-range-field';

const allowedProps = ['ampm', 'autoFocus', 'classes', 'dateSeparator', 'defaultValue', 'direction', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'divider', 'endFieldRef', 'format', 'formatDensity', 'maxTime', 'minTime', 'minutesStep', 'onChange', 'onError', 'onSelectedSectionsChange', 'readOnly', 'referenceDate', 'selectedSections', 'shouldDisableTime', 'shouldRespectLeadingZeros', 'slotProps', 'slots', 'spacing', 'startFieldRef', 'sx', 'timezone', 'useFlexGap', 'value'];

export default function Page() {
  return (
    <TypesPageShell name="MultiInputTimeRangeField" allowedProps={allowedProps}>
      <TypesMultiInputTimeRangeField />
    </TypesPageShell>
  );
}
