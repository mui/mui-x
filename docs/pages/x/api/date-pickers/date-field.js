import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateField } from './types.date-field';

const allowedProps = ['areAllSectionsEmpty', 'autoFocus', 'clearButtonPosition', 'clearable', 'color', 'defaultValue', 'disableFuture', 'disablePast', 'disabled', 'endAdornment', 'error', 'fieldRef', 'focused', 'format', 'formatDensity', 'fullWidth', 'helperText', 'hiddenLabel', 'id', 'inputRef', 'label', 'margin', 'maxDate', 'minDate', 'name', 'onChange', 'onClear', 'onError', 'onSelectedSectionsChange', 'openPickerButtonPosition', 'readOnly', 'referenceDate', 'required', 'selectedSections', 'shouldDisableDate', 'shouldDisableMonth', 'shouldDisableYear', 'shouldRespectLeadingZeros', 'size', 'slotProps', 'slots', 'startAdornment', 'sx', 'timezone', 'value', 'variant'];

export default function Page() {
  return (
    <TypesPageShell name="DateField" allowedProps={allowedProps}>
      <TypesDateField />
    </TypesPageShell>
  );
}
