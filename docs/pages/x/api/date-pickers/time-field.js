import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTimeField } from './types.time-field';

const allowedProps = ['ampm', 'areAllSectionsEmpty', 'autoFocus', 'clearButtonPosition', 'clearable', 'color', 'defaultValue', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'endAdornment', 'error', 'fieldRef', 'focused', 'format', 'formatDensity', 'fullWidth', 'helperText', 'hiddenLabel', 'id', 'inputRef', 'label', 'margin', 'maxTime', 'minTime', 'minutesStep', 'name', 'onChange', 'onClear', 'onError', 'onSelectedSectionsChange', 'openPickerButtonPosition', 'readOnly', 'referenceDate', 'required', 'selectedSections', 'shouldDisableTime', 'shouldRespectLeadingZeros', 'size', 'slotProps', 'slots', 'startAdornment', 'sx', 'timezone', 'value', 'variant'];

export default function Page() {
  return (
    <TypesPageShell name="TimeField" allowedProps={allowedProps}>
      <TypesTimeField />
    </TypesPageShell>
  );
}
