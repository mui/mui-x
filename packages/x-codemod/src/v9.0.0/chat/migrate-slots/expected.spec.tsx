// @ts-nocheck
import { ChatBox, ChatComposer, ChatMessage } from '@mui/x-chat';

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

function StandaloneSlots() {
  return (
    <>
      <ChatMessage
        slots={{
          avatar: CustomAvatar,
          content: CustomContent,
        }}
        slotProps={{
          avatar: { sx: { width: 32 } },
        }}
      />
      <ChatComposer
        slots={{
          input: CustomInput,
          send: CustomSend,
        }}
        slotProps={{
          input: { placeholder: 'Ask…' },
        }}
      />
    </>
  );
}
