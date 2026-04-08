import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/display/loading-and-empty-states/loading-and-empty-states.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
