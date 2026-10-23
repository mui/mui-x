import * as React from 'react';
import { RichMarkdownElement } from '@mui/internal-core-docs/MarkdownDocs';
import { useUserLanguage } from '@mui/internal-core-docs/i18n';
import { BrandingProvider } from '@mui/internal-core-docs/branding';
import { ThemeOptionsContext } from '@mui/internal-core-docs/ThemeContext';
import { ExperimentLayout } from 'docs/src/modules/components/ExperimentLayout';
import * as pageProps from 'docs/data/experiments/scheduler/experiments.md?muiMarkdown';

export default function Page() {
  const userLanguage = useUserLanguage();
  const { paletteMode } = React.useContext(ThemeOptionsContext);
  const localizedDoc = pageProps.docs[userLanguage] || pageProps.docs.en;

  return (
    <BrandingProvider mode={paletteMode}>
      {localizedDoc.rendered.map((renderedMarkdownOrDemo, index) => (
        <RichMarkdownElement
          key={index}
          {...pageProps}
          localizedDoc={localizedDoc}
          renderedMarkdownOrDemo={renderedMarkdownOrDemo}
          disableAd
        />
      ))}
    </BrandingProvider>
  );
}

Page.getLayout = (page) => <ExperimentLayout>{page}</ExperimentLayout>;
