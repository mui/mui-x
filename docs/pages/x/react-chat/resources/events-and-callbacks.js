import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/resources/events-and-callbacks/events-and-callbacks.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
