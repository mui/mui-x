import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/sorting/sorting.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
