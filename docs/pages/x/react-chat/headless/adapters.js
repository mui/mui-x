import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/headless/adapters/adapters.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
