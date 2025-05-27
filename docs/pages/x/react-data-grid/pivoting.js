import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/pivoting/pivoting.md?muiMarkdown';

export default function Page() {
  return (
    <MarkdownDocs
      {...pageProps}
      disableAd
      sx={{
        '& .MuiDocs-footer-block': {
          // marginLeft: 'auto',
          // marginRight: 'auto',
          // maxWidth: 'var(--MuiDocs-text-width)',
        },
        // '& .MuiDocs-content-block.MuiDocs-api-content-block': {
        //   marginLeft: 0,
        //   marginRight: 'auto',
        //   maxWidth: 'calc(2 * var(--MuiDocs-text-width))',
        // },
        '& .MuiDocs-content-block': {
          marginLeft: 0,
          marginRight: 'auto',
          maxWidth: 'var(--MuiDocs-text-width)',
        },
        '& .MuiDocs-content-block.MuiDocs-demo-block': {
          maxWidth: 'unset',
        },
        //
      }}
    />
  );
}
