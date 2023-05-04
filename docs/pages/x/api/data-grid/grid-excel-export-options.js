import * as React from 'react';
import MarkdownDocs from '@mui/monorepo/docs/src/modules/components/MarkdownDocs';
import * as pageProps from './grid-excel-export-options.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
