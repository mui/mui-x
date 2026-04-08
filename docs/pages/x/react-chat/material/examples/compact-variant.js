import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/compact-variant/compact-variant.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
