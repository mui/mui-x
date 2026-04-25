import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/customization/look-and-feel/look-and-feel.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
