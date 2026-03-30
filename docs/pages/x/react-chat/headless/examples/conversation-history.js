import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/headless/examples/conversation-history/conversation-history.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
