import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/resources/selectors/selectors.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
