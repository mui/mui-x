import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/tree-view/jsx-children/jsx-children.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
