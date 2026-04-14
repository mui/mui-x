import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesSingleInputTimeRangeField } from './types.single-input-time-range-field';

const allowedProps = ['ampm', 'areAllSectionsEmpty', 'autoFocus', 'clearButtonPosition', 'clearable', 'color', 'dateSeparator', 'defaultValue', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'endAdornment', 'error', 'fieldRef', 'focused', 'format', 'formatDensity', 'fullWidth', 'helperText', 'hiddenLabel', 'id', 'inputRef', 'label', 'margin', 'maxTime', 'minTime', 'minutesStep', 'name', 'onChange', 'onClear', 'onError', 'onSelectedSectionsChange', 'openPickerButtonPosition', 'readOnly', 'referenceDate', 'required', 'selectedSections', 'shouldDisableTime', 'shouldRespectLeadingZeros', 'size', 'slotProps', 'slots', 'startAdornment', 'sx', 'timezone', 'value', 'variant'];

export default function Page() {
  return (
    <TypesPageShell name="SingleInputTimeRangeField" allowedProps={allowedProps}>
      <TypesSingleInputTimeRangeField />
    </TypesPageShell>
  );
}
