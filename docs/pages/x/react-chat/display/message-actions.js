import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/display/message-actions/message-actions.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
