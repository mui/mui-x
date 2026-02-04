import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/charts/hooks/use-series.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
