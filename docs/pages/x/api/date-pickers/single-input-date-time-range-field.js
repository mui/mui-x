import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesSingleInputDateTimeRangeField } from './types.single-input-date-time-range-field';

const allowedProps = ['ampm', 'areAllSectionsEmpty', 'autoFocus', 'clearButtonPosition', 'clearable', 'color', 'dateSeparator', 'defaultValue', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'endAdornment', 'error', 'fieldRef', 'focused', 'format', 'formatDensity', 'fullWidth', 'helperText', 'hiddenLabel', 'id', 'inputRef', 'label', 'margin', 'maxDate', 'maxDateTime', 'maxTime', 'minDate', 'minDateTime', 'minTime', 'minutesStep', 'name', 'onChange', 'onClear', 'onError', 'onSelectedSectionsChange', 'openPickerButtonPosition', 'readOnly', 'referenceDate', 'required', 'selectedSections', 'shouldDisableDate', 'shouldDisableTime', 'shouldRespectLeadingZeros', 'size', 'slotProps', 'slots', 'startAdornment', 'sx', 'timezone', 'value', 'variant'];

export default function Page() {
  return (
    <TypesPageShell name="SingleInputDateTimeRangeField" allowedProps={allowedProps}>
      <TypesSingleInputDateTimeRangeField />
    </TypesPageShell>
  );
}
