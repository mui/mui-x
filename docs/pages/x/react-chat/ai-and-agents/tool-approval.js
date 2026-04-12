import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/ai-and-agents/tool-approval/tool-approval.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
