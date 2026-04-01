import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/migration/migration-data-grid-v8/migration-data-grid-v8.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
