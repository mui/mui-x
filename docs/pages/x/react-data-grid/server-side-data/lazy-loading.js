import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/server-side-data/lazy-loading.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs disableAd {...pageProps} />;
}
