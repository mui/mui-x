import { MarkdownDocs } from '@mui/internal-core-docs/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/server-side-data/recipes.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
