import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/row-height/row-height.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
