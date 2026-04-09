import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/slow-streaming/slow-streaming.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
