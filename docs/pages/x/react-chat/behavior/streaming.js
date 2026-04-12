import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/behavior/streaming/streaming.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
