import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/scheduler/recurring-events/recurring-events.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
