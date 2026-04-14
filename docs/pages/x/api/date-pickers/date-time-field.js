import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateTimeField } from './types.date-time-field';

const allowedProps = ['ampm', 'areAllSectionsEmpty', 'autoFocus', 'clearButtonPosition', 'clearable', 'color', 'defaultValue', 'disableFuture', 'disableIgnoringDatePartForTimeValidation', 'disablePast', 'disabled', 'endAdornment', 'error', 'fieldRef', 'focused', 'format', 'formatDensity', 'fullWidth', 'helperText', 'hiddenLabel', 'id', 'inputRef', 'label', 'margin', 'maxDate', 'maxDateTime', 'maxTime', 'minDate', 'minDateTime', 'minTime', 'minutesStep', 'name', 'onChange', 'onClear', 'onError', 'onSelectedSectionsChange', 'openPickerButtonPosition', 'readOnly', 'referenceDate', 'required', 'selectedSections', 'shouldDisableDate', 'shouldDisableMonth', 'shouldDisableTime', 'shouldDisableYear', 'shouldRespectLeadingZeros', 'size', 'slotProps', 'slots', 'startAdornment', 'sx', 'timezone', 'value', 'variant'];

export default function Page() {
  return (
    <TypesPageShell name="DateTimeField" allowedProps={allowedProps}>
      <TypesDateTimeField />
    </TypesPageShell>
  );
}
