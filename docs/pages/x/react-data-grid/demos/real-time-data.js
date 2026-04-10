import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/demos/real-time-data.md?muiMarkdown';

export default function Page() {
  return (
    <MarkdownDocs
      {...pageProps}
      sx={{
        '& .MuiDocs-footer-block': {
          display: 'none',
        },
      }}
      disableToc
      disableAd
      wideLayout
    />
  );
}
