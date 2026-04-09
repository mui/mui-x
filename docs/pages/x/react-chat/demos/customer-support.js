import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/demos/customer-support/customer-support.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
