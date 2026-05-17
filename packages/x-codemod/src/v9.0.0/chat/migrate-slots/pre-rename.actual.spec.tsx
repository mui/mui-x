// @ts-nocheck
import { ChatBox } from '@mui/x-chat';

function MyChat() {
  return (
    <ChatBox
      adapter={adapter}
      slots={{
        messageAvatar: CustomAvatar,
        messageContent: CustomContent,
        composerSendButton: CustomSend,
        composerToolbar: CustomToolbar,
        composerRoot: MyComposerWrapper,
        conversationHeader: CustomHeader,
      }}
      slotProps={{
        messageAvatar: { sx: { width: 32 } },
        composerInput: { placeholder: 'Ask…' },
      }}
    />
  );
}
