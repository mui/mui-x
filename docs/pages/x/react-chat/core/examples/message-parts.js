import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/core/examples/message-parts/message-parts.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
