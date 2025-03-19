import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/tree-view/rich-tree-view/lazy-loading/lazy-loading.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
