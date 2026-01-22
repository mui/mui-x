import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/scheduler/timeline-premium/timeline-premium.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
