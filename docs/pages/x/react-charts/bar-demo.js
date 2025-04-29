import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/charts/bar-demo/bar-demo.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
