import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/scheduler/ai-helper/ai-helper.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
