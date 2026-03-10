import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/migration/migration-tree-view-v8/migration-tree-view-v8.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
