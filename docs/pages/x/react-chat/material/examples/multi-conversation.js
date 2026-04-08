import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/multi-conversation/multi-conversation.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
