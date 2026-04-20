import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docsx/data/scheduler/event-timeline/events/events.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd wideLayout />;
}
