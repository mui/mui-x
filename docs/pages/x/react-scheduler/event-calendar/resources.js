import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/scheduler/event-calendar/resources/resources.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
