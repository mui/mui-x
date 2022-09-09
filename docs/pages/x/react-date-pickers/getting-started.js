import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import {
  demos,
  docs,
  demoComponents,
} from 'docsx/data/date-pickers/getting-started/getting-started.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
