// @ts-nocheck
import { ChatBox } from '@mui/x-chat';

function MyChat() {
  return (
    <ChatBox
      adapter={adapter}
      slots={{
        conversation: {
          header: CustomHeader,
        },

        message: {
          avatar: CustomAvatar,
          content: CustomContent,
        },

        composer: {
          send: CustomSend,
          toolbar: CustomToolbar,
          root: MyComposerWrapper,
        },
      }}
      slotProps={{
        message: {
          avatar: { sx: { width: 32 } },
        },

        composer: {
          input: { placeholder: 'Ask…' },
        },
      }}
    />
  );
}
