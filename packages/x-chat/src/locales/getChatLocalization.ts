import type { ChatLocalization, ChatLocaleText } from './chatLocaleTextApi';

export const getChatLocalization = (localeText: Partial<ChatLocaleText>): ChatLocalization => ({
  components: {
    MuiChatBox: {
      defaultProps: {
        localeText,
      },
    },
  },
});
