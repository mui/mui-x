import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMarkElement } from './types.mark-element';

const allowedProps = ['dataIndex', 'hidden', 'isFaded', 'isHighlighted', 'shape', 'skipAnimation'];

export default function Page() {
  return (
    <TypesPageShell name="MarkElement" allowedProps={allowedProps}>
      <TypesMarkElement />
    </TypesPageShell>
  );
}
