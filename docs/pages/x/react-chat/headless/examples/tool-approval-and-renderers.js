import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/headless/examples/tool-approval-and-renderers/tool-approval-and-renderers.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
