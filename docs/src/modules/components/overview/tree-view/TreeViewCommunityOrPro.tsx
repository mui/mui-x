import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CommunityOrPro from '../CommunityOrPro';

export default function TreeViewCommunityOrPro() {
  return (
    <React.Fragment>
      <Divider />
      <Stack direction="column" spacing={{ xs: 1, md: 2 }} py={8} alignItems="center">
        <CommunityOrPro
          caption={'Community and Pro'}
          title={'Two packages for every need'}
          description={
            'Start with the free-forever Community version, then upgrade to Pro when you\'re ready for additional features and components.'
          }
          communityDescription={
            'Free forever under MIT license. Includes core features such as expansion, selection, and label editing.'
          }
          proDescription={
            'Requires a commercial license. Better suited for data-rich and enterprise applications, with features such as reordering, lazy loading, and virtualization.'
          }
        />
      </Stack>
    </React.Fragment>
  );
}
