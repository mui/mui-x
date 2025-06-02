import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/demos/demos.md?muiMarkdown';

export default function Page() {
  return (
    <MarkdownDocs
      {...pageProps}
      sx={{
        '& .MuiDocs-footer-block': {
          display: 'none',
        },
        '& .MuiDocs-content-block': {
          mx: 'auto',
          maxWidth: 'xl',
        },
      }}
      disableToc
      disableAd
    />
  );
}
