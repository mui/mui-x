import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/scheduler/event-calendar/month-view/month-view.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
