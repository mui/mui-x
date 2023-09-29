import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/whats-new/whats-new.md?@mui/markdown';

export default function WhatsNew() {
  return <MarkdownDocs {...pageProps} disableToc disableAd />;
}
