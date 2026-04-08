import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/display/message-parts/files-and-images/files-and-images.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
