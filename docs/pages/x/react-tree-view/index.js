import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docsx/data/tree-view/overview/overview.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd disableToc />;
}
