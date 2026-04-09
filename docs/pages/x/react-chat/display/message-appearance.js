import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/display/message-appearance/message-appearance.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
