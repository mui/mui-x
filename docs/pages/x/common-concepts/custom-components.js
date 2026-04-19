import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docsx/data/common-concepts/custom-components/custom-components.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd />;
}
