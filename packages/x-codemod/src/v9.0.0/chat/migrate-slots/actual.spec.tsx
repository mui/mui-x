// @ts-nocheck
import { ChatBox, ChatComposer, ChatMessage } from '@mui/x-chat';

function MyChat() {
  return (
    <ChatBox
      adapter={adapter}
      slots={{
        avatar: CustomAvatar,
        content: CustomContent,
        send: CustomSend,
        toolbar: CustomToolbar,
        conversationHeader: CustomHeader,
        conversationTitle: CustomTitle,
        emptyState: CustomEmpty,
        composer: MyComposerWrapper,
      }}
      slotProps={{
        avatar: { sx: { width: 32 } },
        input: { placeholder: 'Ask…' },
        conversationList: { sx: { width: 240 } },
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
