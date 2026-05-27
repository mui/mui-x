import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docs/data/chat/core/state/state.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
