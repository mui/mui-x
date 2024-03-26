import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/recipes-editing/recipes-editing.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
