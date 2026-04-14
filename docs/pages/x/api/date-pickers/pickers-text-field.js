import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPickersTextField } from './types.pickers-text-field';

const allowedProps = ['areAllSectionsEmpty', 'color', 'contentEditable', 'elements', 'endAdornment', 'error', 'focused', 'fullWidth', 'helperText', 'hiddenLabel', 'id', 'inputRef', 'label', 'margin', 'name', 'required', 'size', 'slotProps', 'slots', 'startAdornment', 'sx', 'variant'];

export default function Page() {
  return (
    <TypesPageShell name="PickersTextField" allowedProps={allowedProps}>
      <TypesPickersTextField />
    </TypesPageShell>
  );
}
