import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/agentic-code/agentic-code.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
