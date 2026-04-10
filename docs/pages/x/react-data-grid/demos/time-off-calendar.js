import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/demos/time-off-calendar.md?muiMarkdown';

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
    />
  );
}
