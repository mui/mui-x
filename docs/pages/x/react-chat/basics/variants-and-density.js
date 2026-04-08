import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/basics/variants-and-density/variants-and-density.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
