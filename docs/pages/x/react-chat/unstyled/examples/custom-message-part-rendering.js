import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/unstyled/examples/custom-message-part-rendering/custom-message-part-rendering.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
