import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docsx/data/date-pickers/playground/playground.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd disableToc />;
}
