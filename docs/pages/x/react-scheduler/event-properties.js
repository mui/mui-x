import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/scheduler/event-properties/event-properties.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
