import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/headless/examples/tool-call-events/tool-call-events.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
