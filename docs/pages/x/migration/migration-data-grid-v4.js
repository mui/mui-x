import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/migration/migration-data-grid-v4/migration-data-grid-v4.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
