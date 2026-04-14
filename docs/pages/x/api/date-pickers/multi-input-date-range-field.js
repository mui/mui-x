import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMultiInputDateRangeField } from './types.multi-input-date-range-field';

const allowedProps = ['autoFocus', 'classes', 'dateSeparator', 'defaultValue', 'direction', 'disableFuture', 'disablePast', 'disabled', 'divider', 'endFieldRef', 'format', 'formatDensity', 'maxDate', 'minDate', 'onChange', 'onError', 'onSelectedSectionsChange', 'readOnly', 'referenceDate', 'selectedSections', 'shouldDisableDate', 'shouldRespectLeadingZeros', 'slotProps', 'slots', 'spacing', 'startFieldRef', 'sx', 'timezone', 'useFlexGap', 'value'];

export default function Page() {
  return (
    <TypesPageShell name="MultiInputDateRangeField" allowedProps={allowedProps}>
      <TypesMultiInputDateRangeField />
    </TypesPageShell>
  );
}
