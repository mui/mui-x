import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsLocalizationProvider } from './types.charts-localization-provider';

const allowedProps = ['localeText'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsLocalizationProvider" allowedProps={allowedProps}>
      <TypesChartsLocalizationProvider />
    </TypesPageShell>
  );
}
