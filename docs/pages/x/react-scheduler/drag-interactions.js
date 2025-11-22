import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/scheduler/drag-interactions/drag-interactions.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
