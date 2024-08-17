import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/tree-view/rich-tree-view/editing/editing.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
