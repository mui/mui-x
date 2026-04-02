import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/ai-and-agents/tool-calling/tool-calling.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
