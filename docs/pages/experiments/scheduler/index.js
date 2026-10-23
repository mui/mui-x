import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docs/data/experiments/scheduler/experiments.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
