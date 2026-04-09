import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/headless/examples/examples.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
