import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/unstyled/examples/virtualized-thread/virtualized-thread.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
