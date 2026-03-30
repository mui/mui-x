import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/unstyled/examples/two-pane-inbox/two-pane-inbox.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
