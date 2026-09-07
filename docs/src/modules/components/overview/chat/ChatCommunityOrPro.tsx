import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CommunityOrPro from '../CommunityOrPro';

export default function ChatCommunityOrPro() {
  return (
    <React.Fragment>
      <Divider />
      <Stack
        direction="column"
        spacing={{ xs: 1, md: 2 }}
        sx={{
          py: 8,
          alignItems: 'center',
          // Chat is single-tier (no Pro/Premium card), so the shared CommunityOrPro
          // renders only the Community card. Override its 50% flex-basis so the lone
          // card spans the full row instead of leaving the right half empty.
          '& > .MuiStack-root:last-of-type > .MuiBox-root': { flexBasis: '100%' },
        }}
      >
        <CommunityOrPro
          caption={'Community'}
          title={'Free and open source'}
          description={
            'Every MUI X Chat feature ships in the Community plan — there is no Pro or Premium tier, so you get the complete chat toolkit with no licensing costs.'
          }
          communityDescription={
            'Free forever under an MIT license. Includes streaming responses, multi-conversation management, tool calling, attachments, and full theming support.'
          }
        />
      </Stack>
    </React.Fragment>
  );
}
