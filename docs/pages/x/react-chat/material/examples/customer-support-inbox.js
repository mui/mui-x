import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/customer-support-inbox/customer-support-inbox.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
