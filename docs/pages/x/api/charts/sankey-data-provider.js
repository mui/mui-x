import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesSankeyDataProvider } from './types.sankey-data-provider';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="SankeyDataProvider" allowedProps={allowedProps}>
      <TypesSankeyDataProvider />
    </TypesPageShell>
  );
}
