import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/filtering/overview.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
