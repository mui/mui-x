import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/long-messages/long-messages.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
