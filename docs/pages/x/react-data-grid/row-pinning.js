import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import {
  demos,
  docs,
  demoComponents,
} from 'docsx/data/data-grid/row-pinning/row-pinning.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd />;
}
