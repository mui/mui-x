import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/basics/composer/composer.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
