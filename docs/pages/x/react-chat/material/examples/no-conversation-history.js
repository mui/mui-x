import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/no-conversation-history/no-conversation-history.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
