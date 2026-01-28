import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/scheduler/timezone-support/timezone-support.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
