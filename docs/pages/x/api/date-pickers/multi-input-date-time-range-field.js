import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMultiInputDateTimeRangeField } from './types.multi-input-date-time-range-field';

const allowedProps = ['ampm', 'autoFocus', 'classes', 'dateSeparator', 'defaultValue', 'direction', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'divider', 'endFieldRef', 'format', 'formatDensity', 'maxDate', 'maxDateTime', 'maxTime', 'minDate', 'minDateTime', 'minTime', 'minutesStep', 'onChange', 'onError', 'onSelectedSectionsChange', 'readOnly', 'referenceDate', 'selectedSections', 'shouldDisableDate', 'shouldDisableTime', 'shouldRespectLeadingZeros', 'slotProps', 'slots', 'spacing', 'startFieldRef', 'sx', 'timezone', 'useFlexGap', 'value'];

export default function Page() {
  return (
    <TypesPageShell name="MultiInputDateTimeRangeField" allowedProps={allowedProps}>
      <TypesMultiInputDateTimeRangeField />
    </TypesPageShell>
  );
}
