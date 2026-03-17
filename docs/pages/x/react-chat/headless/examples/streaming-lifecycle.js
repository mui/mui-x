import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/headless/examples/streaming-lifecycle/streaming-lifecycle.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
