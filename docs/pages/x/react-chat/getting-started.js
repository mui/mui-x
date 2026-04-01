import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/getting-started/getting-started.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
