import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from './grid-row-spacing-params.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
