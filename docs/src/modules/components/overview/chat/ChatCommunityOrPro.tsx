import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CommunityOrPro from '../CommunityOrPro';

export default function ChatCommunityOrPro() {
  return (
    <React.Fragment>
      <Divider />
      <Stack direction="column" spacing={{ xs: 1, md: 2 }} py={8} alignItems="center">
        <CommunityOrPro
          caption={'Community'}
          title={'Free and open source'}
          description={
            'MUI X Chat is free forever under an MIT license, giving you everything you need to build rich chat interfaces without any licensing costs.'
          }
          communityDescription={
            'Free forever under an MIT license. Includes streaming responses, multi-conversation management, tool calling, attachments, and full theming support.'
          }
        />
      </Stack>
    </React.Fragment>
  );
}
