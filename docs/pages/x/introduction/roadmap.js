import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docsx/data/introduction/roadmap/roadmap.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
