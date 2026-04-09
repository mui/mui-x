import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/multi-conversation/conversation-list/conversation-list.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
