import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/unstyled/thread/thread.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
