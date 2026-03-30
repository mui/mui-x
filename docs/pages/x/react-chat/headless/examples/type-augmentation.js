import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/headless/examples/type-augmentation/type-augmentation.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
