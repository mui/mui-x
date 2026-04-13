import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/charts/radial-lines/radial-lines.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
