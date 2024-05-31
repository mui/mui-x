import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/date-pickers/custom-views/custom-views.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
