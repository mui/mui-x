import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/demos/inventory.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableToc disableAd wideLayout />;
}
