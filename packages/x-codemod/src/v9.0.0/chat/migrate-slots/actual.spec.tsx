// @ts-nocheck
import { ChatBox } from '@mui/x-chat';

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
