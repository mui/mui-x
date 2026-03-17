import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/unstyled/examples/minimal-shell/minimal-shell.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
