import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/backend/real-time-adapters/real-time-adapters.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
