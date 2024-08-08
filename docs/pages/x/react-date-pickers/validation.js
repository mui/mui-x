import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/date-pickers/validation/validation.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
