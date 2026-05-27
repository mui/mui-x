import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docs/data/chat/core/types/types.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
