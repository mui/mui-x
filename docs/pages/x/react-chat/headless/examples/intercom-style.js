import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/headless/examples/intercom-style/intercom-style.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
