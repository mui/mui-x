import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/column-groups/column-groups.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
