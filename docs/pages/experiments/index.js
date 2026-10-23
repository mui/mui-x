import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import NextLink from 'next/link';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { ExperimentLayout } from 'docs/src/modules/components/ExperimentLayout';

export default function Experiments({ experiments }) {
  return (
    <ExperimentLayout>
      <Container sx={{ py: 4 }}>
        <Typography component="h1" variant="h3" gutterBottom>
          MUI X experiments
        </Typography>
        <Typography>
          Experiments are committed to Git in <code>docs/pages/experiments</code> and are available
          during development and in preview deployments.
        </Typography>
        <List>
          {experiments.map((experiment) => (
            <ListItem key={experiment}>
              <Link component={NextLink} href={`/experiments/${experiment}`}>
                {experiment}
              </Link>
            </ListItem>
          ))}
        </List>
      </Container>
    </ExperimentLayout>
  );
}

export async function getStaticProps() {
  // Next.js copies prerendered pages even when exportPathMap excludes them.
  if (process.env.DEPLOY_ENV === 'production') {
    return { notFound: true };
  }

  const experiments = fs
    .readdirSync(path.join(process.cwd(), 'pages/experiments'), { recursive: true })
    .map((file) => file.replaceAll(path.sep, '/'))
    .filter((file) => /\.(js|tsx)$/.test(file) && file !== 'index.js')
    .map((file) => file.replace(/\.(js|tsx)$/, '').replace(/\/index$/, ''))
    .sort();

  return { props: { experiments } };
}
