import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docs/data/data-grid/demos/time-off-calendar.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableToc disableAd wideLayout />;
}
