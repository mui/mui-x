import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/chat-box/chat-box.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
