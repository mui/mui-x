import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/thread-only-copilot/thread-only-copilot.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
