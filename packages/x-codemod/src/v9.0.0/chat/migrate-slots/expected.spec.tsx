// @ts-nocheck
import { ChatBox } from '@mui/x-chat';

function MyChat() {
  return (
    <ChatBox
      adapter={adapter}
      slots={{
        emptyState: CustomEmpty,

        conversation: {
          header: CustomHeader,
          title: CustomTitle,
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
        conversation: {
          list: { sx: { width: 240 } },
        },

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
