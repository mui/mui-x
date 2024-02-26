import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/migration/migration-tree-view-lab/migration-tree-view-lab.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
