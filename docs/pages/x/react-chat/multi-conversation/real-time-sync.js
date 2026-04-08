import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/multi-conversation/real-time-sync/real-time-sync.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
