import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesSingleInputDateRangeField } from './types.single-input-date-range-field';

const allowedProps = ['areAllSectionsEmpty', 'autoFocus', 'clearButtonPosition', 'clearable', 'color', 'dateSeparator', 'defaultValue', 'disableFuture', 'disablePast', 'disabled', 'endAdornment', 'error', 'fieldRef', 'focused', 'format', 'formatDensity', 'fullWidth', 'helperText', 'hiddenLabel', 'id', 'inputRef', 'label', 'margin', 'maxDate', 'minDate', 'name', 'onChange', 'onClear', 'onError', 'onSelectedSectionsChange', 'openPickerButtonPosition', 'readOnly', 'referenceDate', 'required', 'selectedSections', 'shouldDisableDate', 'shouldRespectLeadingZeros', 'size', 'slotProps', 'slots', 'startAdornment', 'sx', 'timezone', 'value', 'variant'];

export default function Page() {
  return (
    <TypesPageShell name="SingleInputDateRangeField" allowedProps={allowedProps}>
      <TypesSingleInputDateRangeField />
    </TypesPageShell>
  );
}
