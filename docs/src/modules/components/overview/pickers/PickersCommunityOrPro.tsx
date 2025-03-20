import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CommunityOrPro from '../CommunityOrPro';

export default function PickersCommunityOrPro() {
  return (
    <React.Fragment>
      <Divider />
      <Stack direction="column" spacing={{ xs: 1, md: 2 }} py={8} alignItems="center">
        <CommunityOrPro
          caption={'Community and Pro'}
          title={'Two packages for every need'}
          description={
            'Start with the free-forever Community version, then upgrade to Pro when you are ready for additional features and components.'
          }
          communityDescription={
            'Free forever under an MIT license. Includes Date Pickers, Time Pickers, and Date Time Pickers.'
          }
          proDescription={
            'Requires a commercial license. Includes all Community components plus the Date and Time Range Pickers.'
          }
        />
      </Stack>
    </React.Fragment>
  );
}
