import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docs/data/chat/backend/adapters/adapters.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
