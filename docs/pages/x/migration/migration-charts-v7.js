import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/migration/migration-charts-v7/migration-charts-v7.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
