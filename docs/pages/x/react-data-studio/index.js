import * as React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const DEMOS = [
  {
    title: 'Coffee Beans',
    description:
      'Customers, products, and orders for a coffee-bean wholesaler. Three related datasets with editable rows.',
    href: '/x/react-data-studio/coffee-beans',
  },
  {
    title: 'Adventure Works',
    description:
      'Classic Adventure Works sample data. Customers, products, and sales orders for a bicycle retailer.',
    href: '/x/react-data-studio/adventure-works',
  },
];

export default function Page() {
  return (
    <React.Fragment>
      <Head>
        <title>Data Studio demos - MUI X</title>
        <meta
          name="description"
          content="Pick a Data Studio demo: Coffee Beans Sales or Adventure Works."
        />
      </Head>
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h1" sx={{ mb: 1 }}>
          Data Studio demos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Two end-to-end Data Studio demos showcasing different shapes of relational data.
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          }}
        >
          {DEMOS.map((demo) => (
            <Card key={demo.href} variant="outlined">
              <CardActionArea component={NextLink} href={demo.href} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
                    {demo.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {demo.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </React.Fragment>
  );
}
