import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/indicators/indicators.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
