import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/multi-conversation/history-and-pagination/history-and-pagination.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
