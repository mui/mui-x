import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/charts/plugins/plugins.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
