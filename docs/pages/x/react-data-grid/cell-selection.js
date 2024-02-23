import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/cell-selection/cell-selection.md?@mui/internal-markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd />;
}
