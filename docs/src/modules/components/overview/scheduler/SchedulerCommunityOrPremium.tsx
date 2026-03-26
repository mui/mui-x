import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CommunityOrPro from '../CommunityOrPro';

export default function SchedulerCommunityOrPremium() {
  return (
    <React.Fragment>
      <Divider />
      <Stack
        direction="column"
        spacing={{ xs: 1, md: 2 }}
        sx={{
          py: 8,
          alignItems: "center"
        }}>
        <CommunityOrPro
          caption={'Community and Premium'}
          title={'Two packages for every need'}
          description={
            'Start with the free-forever Community version, then upgrade to Premium when you are ready for additional features and components.'
          }
          communityDescription={
            'Free forever under MIT license. Includes core features such as resource management, multiple views, or drag and drop.'
          }
          premiumDescription={
            'Requires a commercial license. Includes additional features such as recurring events, lazy loading, and virtualization, as well as premium components such as the Event Timeline.'
          }
        />
      </Stack>
    </React.Fragment>
  );
}
