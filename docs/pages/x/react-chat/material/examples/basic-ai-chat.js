import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/basic-ai-chat/basic-ai-chat.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
