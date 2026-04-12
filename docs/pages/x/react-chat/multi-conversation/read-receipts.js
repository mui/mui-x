import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/multi-conversation/read-receipts/read-receipts.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
