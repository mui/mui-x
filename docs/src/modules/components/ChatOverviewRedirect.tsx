import * as React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const destination = '/x/react-chat/';

export default function ChatOverviewRedirect() {
  React.useEffect(() => {
    window.location.replace(destination);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      </Head>
      <Box sx={{ px: 3, py: 6 }}>
        <Typography variant="h5" gutterBottom>
          Redirecting to the Chat overview
        </Typography>
        <Typography variant="body2">
          If the page does not change automatically, continue to{' '}
          <Link href={destination}>/x/react-chat/</Link>.
        </Typography>
      </Box>
    </React.Fragment>
  );
}
