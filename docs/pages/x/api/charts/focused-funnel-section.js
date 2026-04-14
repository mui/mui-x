import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesFocusedFunnelSection } from './types.focused-funnel-section';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="FocusedFunnelSection" allowedProps={allowedProps}>
      <TypesFocusedFunnelSection />
    </TypesPageShell>
  );
}
