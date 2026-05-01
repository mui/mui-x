import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docs/data/scheduler/event-timeline/events/events.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd wideLayout />;
}
