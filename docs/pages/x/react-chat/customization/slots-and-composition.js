import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/chat/customization/slots-and-composition/slots-and-composition.md?muiMarkdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} />;
}
