import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/filtering-recipes/filtering-recipes.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
