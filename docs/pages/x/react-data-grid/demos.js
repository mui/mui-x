import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/demos/demos.md?muiMarkdown';

export default function Page() {
  return (
    <MarkdownDocs
      {...pageProps}
      sx={{
        '@media (min-width: 900px)': {
          width: 'calc(100% + 121px)', // TODO: Fix at the cause of the issue
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
