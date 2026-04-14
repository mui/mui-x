import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPickersSectionList } from './types.pickers-section-list';

const allowedProps = ['classes', 'contentEditable', 'elements', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="PickersSectionList" allowedProps={allowedProps}>
      <TypesPickersSectionList />
    </TypesPageShell>
  );
}
