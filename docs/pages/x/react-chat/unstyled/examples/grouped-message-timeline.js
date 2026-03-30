import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/unstyled/examples/grouped-message-timeline/grouped-message-timeline.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
