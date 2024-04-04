import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/migration/migration-pickers-v5/migration-pickers-v5.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
