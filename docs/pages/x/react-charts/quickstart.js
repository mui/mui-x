import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docsx/data/charts/quickstart/quickstart.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd />;
}
