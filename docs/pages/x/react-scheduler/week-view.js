import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/scheduler/week-view/week-view.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
