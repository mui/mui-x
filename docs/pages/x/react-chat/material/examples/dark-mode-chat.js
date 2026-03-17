import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/dark-mode-chat/dark-mode-chat.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
