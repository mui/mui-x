import * as React from 'react';
import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docs/data/data-grid/tutorials/server-side-data/index.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
