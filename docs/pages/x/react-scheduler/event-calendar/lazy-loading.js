import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docs/data/scheduler/event-calendar/lazy-loading/lazy-loading.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd wideLayout />;
}
