import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/rtl-chat/rtl-chat.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
