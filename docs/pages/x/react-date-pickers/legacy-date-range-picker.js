import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/date-pickers/legacy-date-range-picker/legacy-date-range-picker.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
