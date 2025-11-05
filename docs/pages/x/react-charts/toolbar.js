import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/charts/toolbar/toolbar.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
