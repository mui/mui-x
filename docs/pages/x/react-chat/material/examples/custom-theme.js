import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/custom-theme/custom-theme.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
