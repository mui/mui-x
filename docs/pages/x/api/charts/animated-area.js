import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesAnimatedArea } from './types.animated-area';

const allowedProps = ['skipAnimation'];

export default function Page() {
  return (
    <TypesPageShell name="AnimatedArea" allowedProps={allowedProps}>
      <TypesAnimatedArea />
    </TypesPageShell>
  );
}
