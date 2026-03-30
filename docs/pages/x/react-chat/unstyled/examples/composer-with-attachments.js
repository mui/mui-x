import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/unstyled/examples/composer-with-attachments/composer-with-attachments.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
