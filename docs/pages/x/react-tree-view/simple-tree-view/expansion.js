import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/tree-view/simple-tree-view/expansion/expansion.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
