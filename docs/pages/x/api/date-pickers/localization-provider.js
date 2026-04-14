import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesLocalizationProvider } from './types.localization-provider';

const allowedProps = ['adapterLocale', 'dateAdapter', 'dateFormats', 'dateLibInstance', 'localeText'];

export default function Page() {
  return (
    <TypesPageShell name="LocalizationProvider" allowedProps={allowedProps}>
      <TypesLocalizationProvider />
    </TypesPageShell>
  );
}
