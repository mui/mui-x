import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/multi-conversation/conversation-header/conversation-header.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
