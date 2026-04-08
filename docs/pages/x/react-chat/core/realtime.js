import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/core/realtime/realtime.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
