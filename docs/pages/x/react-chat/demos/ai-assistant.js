import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/demos/ai-assistant/ai-assistant.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
