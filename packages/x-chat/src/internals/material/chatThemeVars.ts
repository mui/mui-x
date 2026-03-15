import type { Theme } from '@mui/material/styles';
import type { PaletteChat } from '../../themeAugmentation';

export const chatCssVarKeys = {
  userMessageBg: '--Chat-userMessageBg',
  userMessageColor: '--Chat-userMessageColor',
  assistantMessageBg: '--Chat-assistantMessageBg',
  assistantMessageColor: '--Chat-assistantMessageColor',
  conversationHoverBg: '--Chat-conversationHoverBg',
  conversationSelectedBg: '--Chat-conversationSelectedBg',
  conversationSelectedColor: '--Chat-conversationSelectedColor',
  composerBorder: '--Chat-composerBorder',
  composerFocusRing: '--Chat-composerFocusRing',
} as const;

export type ChatCssVarToken = keyof typeof chatCssVarKeys;

export interface ChatCSSVariablesInterface {
  [chatCssVarKeys.userMessageBg]: string;
  [chatCssVarKeys.userMessageColor]: string;
  [chatCssVarKeys.assistantMessageBg]: string;
  [chatCssVarKeys.assistantMessageColor]: string;
  [chatCssVarKeys.conversationHoverBg]: string;
  [chatCssVarKeys.conversationSelectedBg]: string;
  [chatCssVarKeys.conversationSelectedColor]: string;
  [chatCssVarKeys.composerBorder]: string;
  [chatCssVarKeys.composerFocusRing]: string;
}

const getPalette = (theme: Theme) =>
  (theme.vars || theme).palette as Theme['palette'] & { Chat?: PaletteChat };

export function getChatThemeTokens(theme: Theme): Required<PaletteChat> {
  const palette = getPalette(theme);
  const chatPalette = palette.Chat ?? {};

  return {
    userMessageBg: chatPalette.userMessageBg ?? palette.primary.main,
    userMessageColor: chatPalette.userMessageColor ?? palette.primary.contrastText,
    assistantMessageBg: chatPalette.assistantMessageBg ?? palette.background.paper,
    assistantMessageColor: chatPalette.assistantMessageColor ?? palette.text.primary,
    conversationHoverBg: chatPalette.conversationHoverBg ?? palette.action.hover,
    conversationSelectedBg: chatPalette.conversationSelectedBg ?? palette.action.selected,
    conversationSelectedColor: chatPalette.conversationSelectedColor ?? palette.text.primary,
    composerBorder: chatPalette.composerBorder ?? palette.divider,
    composerFocusRing: chatPalette.composerFocusRing ?? palette.primary.main,
  };
}

export function getChatCssVars(theme: Theme): ChatCSSVariablesInterface {
  const tokens = getChatThemeTokens(theme);

  return {
    [chatCssVarKeys.userMessageBg]: tokens.userMessageBg,
    [chatCssVarKeys.userMessageColor]: tokens.userMessageColor,
    [chatCssVarKeys.assistantMessageBg]: tokens.assistantMessageBg,
    [chatCssVarKeys.assistantMessageColor]: tokens.assistantMessageColor,
    [chatCssVarKeys.conversationHoverBg]: tokens.conversationHoverBg,
    [chatCssVarKeys.conversationSelectedBg]: tokens.conversationSelectedBg,
    [chatCssVarKeys.conversationSelectedColor]: tokens.conversationSelectedColor,
    [chatCssVarKeys.composerBorder]: tokens.composerBorder,
    [chatCssVarKeys.composerFocusRing]: tokens.composerFocusRing,
  };
}
