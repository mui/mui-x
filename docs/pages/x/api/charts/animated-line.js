import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesAnimatedLine } from './types.animated-line';

const allowedProps = ['skipAnimation'];

export default function Page() {
  return (
    <TypesPageShell name="AnimatedLine" allowedProps={allowedProps}>
      <TypesAnimatedLine />
    </TypesPageShell>
  );
}
