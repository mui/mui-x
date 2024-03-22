import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/migration/migration-pickers-v6/migration-pickers-v6.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
