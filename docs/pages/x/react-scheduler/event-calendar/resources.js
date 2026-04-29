import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docs/data/scheduler/event-calendar/resources/resources.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} wideLayout />;
}
