import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/demos/inventory.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableToc disableAd wideLayout />;
}
