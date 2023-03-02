import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/charts/lines/lines.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
