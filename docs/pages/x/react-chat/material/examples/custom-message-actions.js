import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/material/examples/custom-message-actions/custom-message-actions.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
