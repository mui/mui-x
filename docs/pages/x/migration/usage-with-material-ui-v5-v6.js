import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/migration/usage-with-material-ui-v5-v6/usage-with-material-ui-v5-v6.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
