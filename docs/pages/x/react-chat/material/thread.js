import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docs/data/chat/material/thread/thread.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
