import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CommunityOrPro from '../CommunityOrPro';

export default function ChartsCommunityOrPro() {
  return (
    <React.Fragment>
      <Divider />
      <Stack
        direction="column"
        spacing={{ xs: 1, md: 2 }}
        py={8}
        alignItems="center"
        maxWidth={1200}
        mx="auto"
      >
        <CommunityOrPro
          caption={'Community and Pro'}
          title={'Two packages for every need'}
          description={
            'Start with the free-forever Community version, then upgrade to Pro when you are ready for additional features and components.'
          }
          communityDescription={
            'Free forever under MIT license. Includes essential charts and core features like axes, legends, styling customizations, tooltips, highlights, and more.'
          }
          proDescription={
            'Requires a commercial license. Includes advanced charts and features like zoom and pan, chart export. Better suited for data rich and enterprise applications.'
          }
          // premiumDescription={
          //   'Requires a commercial license. better suited for data rich and enterprise applications, including features such as reordering, lazy loading or virtualization.'
          // }
        />
      </Stack>
    </React.Fragment>
  );
}
