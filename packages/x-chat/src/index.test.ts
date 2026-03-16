import * as chat from '@mui/x-chat';
import * as chatComposerSubpath from '@mui/x-chat/ChatComposer';
import * as chatConversationsSubpath from '@mui/x-chat/ChatConversations';
import * as chatMessageSubpath from '@mui/x-chat/ChatMessage';
import * as chatThreadSubpath from '@mui/x-chat/ChatThread';
import * as headlessBridge from '@mui/x-chat/headless';
import * as chatLocales from '@mui/x-chat/locales';
import * as headlessDirect from '@mui/x-chat-headless';
import * as themeAugmentation from '@mui/x-chat/themeAugmentation';
import * as chatTypes from '@mui/x-chat/types';
import * as unstyledBridge from '@mui/x-chat/unstyled';
import * as unstyledChatBridge from '@mui/x-chat/unstyled/chat';
import * as unstyledComposerBridge from '@mui/x-chat/unstyled/composer';
import * as unstyledConversationListBridge from '@mui/x-chat/unstyled/conversation-list';
import * as unstyledIndicatorsBridge from '@mui/x-chat/unstyled/indicators';
import * as unstyledMessageGroupBridge from '@mui/x-chat/unstyled/message-group';
import * as unstyledMessageBridge from '@mui/x-chat/unstyled/message';
import * as unstyledMessageListBridge from '@mui/x-chat/unstyled/message-list';
import * as unstyledThreadBridge from '@mui/x-chat/unstyled/thread';
import * as unstyledDirect from '@mui/x-chat-unstyled';
import * as unstyledChatDirect from '@mui/x-chat-unstyled/chat';
import * as unstyledComposerDirect from '@mui/x-chat-unstyled/composer';
import * as unstyledConversationListDirect from '@mui/x-chat-unstyled/conversation-list';
import * as unstyledIndicatorsDirect from '@mui/x-chat-unstyled/indicators';
import * as unstyledMessageGroupDirect from '@mui/x-chat-unstyled/message-group';
import * as unstyledMessageDirect from '@mui/x-chat-unstyled/message';
import * as unstyledMessageListDirect from '@mui/x-chat-unstyled/message-list';
import * as unstyledThreadDirect from '@mui/x-chat-unstyled/thread';
import { Chat as UnstyledBridgeChat, ChatLayout as UnstyledBridgeChatLayout, ChatRoot as UnstyledBridgeChatRoot } from '@mui/x-chat/unstyled/chat';
import {
  Composer as UnstyledBridgeComposer,
  ComposerAttachButton as UnstyledBridgeComposerAttachButton,
  ComposerHelperText as UnstyledBridgeComposerHelperText,
  ComposerInput as UnstyledBridgeComposerInput,
  ComposerRoot as UnstyledBridgeComposerRoot,
  ComposerSendButton as UnstyledBridgeComposerSendButton,
  ComposerToolbar as UnstyledBridgeComposerToolbar,
} from '@mui/x-chat/unstyled/composer';
import {
  ConversationList as UnstyledBridgeConversationList,
  ConversationListRoot as UnstyledBridgeConversationListRoot,
} from '@mui/x-chat/unstyled/conversation-list';
import { MessageGroup as UnstyledBridgeMessageGroup } from '@mui/x-chat/unstyled/message-group';
import {
  Indicators as UnstyledBridgeIndicators,
  ScrollToBottomAffordance as UnstyledBridgeScrollToBottomAffordance,
  TypingIndicator as UnstyledBridgeTypingIndicator,
  UnreadMarker as UnstyledBridgeUnreadMarker,
} from '@mui/x-chat/unstyled/indicators';
import {
  MessageActions as UnstyledBridgeMessageActions,
  MessageAvatar as UnstyledBridgeMessageAvatar,
  Message as UnstyledBridgeMessage,
  MessageContent as UnstyledBridgeMessageContent,
  MessageMeta as UnstyledBridgeMessageMeta,
  MessageRoot as UnstyledBridgeMessageRoot,
} from '@mui/x-chat/unstyled/message';
import {
  MessageListDateDivider as UnstyledBridgeMessageListDateDivider,
  MessageList as UnstyledBridgeMessageList,
  MessageListRoot as UnstyledBridgeMessageListRoot,
} from '@mui/x-chat/unstyled/message-list';
import {
  Thread as UnstyledBridgeThread,
  ThreadRoot as UnstyledBridgeThreadRoot,
} from '@mui/x-chat/unstyled/thread';
import { Chat as UnstyledDirectChat, ChatLayout as UnstyledDirectChatLayout, ChatRoot as UnstyledDirectChatRoot } from '@mui/x-chat-unstyled/chat';
import {
  Composer as UnstyledDirectComposer,
  ComposerAttachButton as UnstyledDirectComposerAttachButton,
  ComposerHelperText as UnstyledDirectComposerHelperText,
  ComposerInput as UnstyledDirectComposerInput,
  ComposerRoot as UnstyledDirectComposerRoot,
  ComposerSendButton as UnstyledDirectComposerSendButton,
  ComposerToolbar as UnstyledDirectComposerToolbar,
} from '@mui/x-chat-unstyled/composer';
import {
  ConversationList as UnstyledDirectConversationList,
  ConversationListRoot as UnstyledDirectConversationListRoot,
} from '@mui/x-chat-unstyled/conversation-list';
import { MessageGroup as UnstyledDirectMessageGroup } from '@mui/x-chat-unstyled/message-group';
import {
  Indicators as UnstyledDirectIndicators,
  ScrollToBottomAffordance as UnstyledDirectScrollToBottomAffordance,
  TypingIndicator as UnstyledDirectTypingIndicator,
  UnreadMarker as UnstyledDirectUnreadMarker,
} from '@mui/x-chat-unstyled/indicators';
import {
  MessageActions as UnstyledDirectMessageActions,
  MessageAvatar as UnstyledDirectMessageAvatar,
  Message as UnstyledDirectMessage,
  MessageContent as UnstyledDirectMessageContent,
  MessageMeta as UnstyledDirectMessageMeta,
  MessageRoot as UnstyledDirectMessageRoot,
} from '@mui/x-chat-unstyled/message';
import {
  MessageListDateDivider as UnstyledDirectMessageListDateDivider,
  MessageList as UnstyledDirectMessageList,
  MessageListRoot as UnstyledDirectMessageListRoot,
} from '@mui/x-chat-unstyled/message-list';
import {
  Thread as UnstyledDirectThread,
  ThreadRoot as UnstyledDirectThreadRoot,
} from '@mui/x-chat-unstyled/thread';
import { ChatProvider as HeadlessBridgeChatProvider } from '@mui/x-chat/headless';
import { chatSelectors as headlessBridgeSelectors } from '@mui/x-chat/headless';
import { useChat as headlessBridgeUseChat } from '@mui/x-chat/headless';
import { useChatComposer as headlessBridgeUseChatComposer } from '@mui/x-chat/headless';
import { useChatPartRenderer as headlessBridgeUseChatPartRenderer } from '@mui/x-chat/headless';
import { useChatStatus as headlessBridgeUseChatStatus } from '@mui/x-chat/headless';
import { useConversation as headlessBridgeUseConversation } from '@mui/x-chat/headless';
import { useConversations as headlessBridgeUseConversations } from '@mui/x-chat/headless';
import { useMessage as headlessBridgeUseMessage } from '@mui/x-chat/headless';
import { useMessageIds as headlessBridgeUseMessageIds } from '@mui/x-chat/headless';
import { useChatStore as headlessBridgeUseChatStore } from '@mui/x-chat/headless';
import { ChatProvider as HeadlessDirectChatProvider } from '@mui/x-chat-headless';
import { chatSelectors as headlessDirectSelectors } from '@mui/x-chat-headless';
import { useChat as headlessDirectUseChat } from '@mui/x-chat-headless';
import { useChatComposer as headlessDirectUseChatComposer } from '@mui/x-chat-headless';
import { useChatPartRenderer as headlessDirectUseChatPartRenderer } from '@mui/x-chat-headless';
import { useChatStatus as headlessDirectUseChatStatus } from '@mui/x-chat-headless';
import { useConversation as headlessDirectUseConversation } from '@mui/x-chat-headless';
import { useConversations as headlessDirectUseConversations } from '@mui/x-chat-headless';
import { useMessage as headlessDirectUseMessage } from '@mui/x-chat-headless';
import { useMessageIds as headlessDirectUseMessageIds } from '@mui/x-chat-headless';
import { useChatStore as headlessDirectUseChatStore } from '@mui/x-chat-headless';
import type {
  ChatAddToolApproveResponseInput as HeadlessAddToolApproveResponseInput,
  ChatAdapter as HeadlessAdapter,
  ChatMessage as HeadlessMessage,
  ChatMessageChunk as HeadlessMessageChunk,
  ChatMessagePart as HeadlessMessagePart,
  ChatProviderProps as HeadlessChatProviderProps,
  ChatPartRendererMap as HeadlessPartRendererMap,
  ChatPublicState as HeadlessPublicState,
  ChatRealtimeEvent as HeadlessRealtimeEvent,
  ChatToolInvocation as HeadlessToolInvocation,
} from '@mui/x-chat/headless';
import type {
  ChatRootProps as UnstyledBridgeChatRootProps,
  ChatRootSlotProps as UnstyledBridgeChatRootSlotProps,
  ChatRootSlots as UnstyledBridgeChatRootSlots,
  ComposerInputProps as UnstyledBridgeComposerInputProps,
  ConversationListItemSlots as UnstyledBridgeConversationListItemSlots,
  MessageContentSlotProps as UnstyledBridgeMessageContentSlotProps,
  MessageListRootHandle as UnstyledBridgeMessageListRootHandle,
  ScrollToBottomAffordanceProps as UnstyledBridgeScrollToBottomAffordanceProps,
  ThreadHeaderProps as UnstyledBridgeThreadHeaderProps,
} from '@mui/x-chat/unstyled';
import type {
  ChatBoxProps as ThemeAugmentationChatBoxProps,
  ChatComposerProps as ThemeAugmentationChatComposerProps,
  ChatConversationsProps as ThemeAugmentationChatConversationsProps,
  ChatMessageProps as ThemeAugmentationChatMessageProps,
  ChatComponents as ThemeAugmentationChatComponents,
  ChatThreadProps as ThemeAugmentationChatThreadProps,
  PaletteChat as ThemeAugmentationPaletteChat,
} from '@mui/x-chat/themeAugmentation';
import type {
  ChatLocalization as ChatLocalesLocalization,
  ChatLocaleText as ChatLocalesLocaleText,
} from '@mui/x-chat/locales';
import type * as Chatbox from '@mui/x-chat/types';

declare module '@mui/x-chat-headless/types' {
  interface ChatUserMetadata {
    isStaff?: boolean;
  }

  interface ChatConversationMetadata {
    workspaceId?: string;
  }

  interface ChatMessageMetadata {
    traceId?: string;
    model?: string;
  }

  interface ChatCustomMessagePartMap {
    poll: {
      type: 'poll';
      question: string;
      options: string[];
    };
  }

  interface ChatToolDefinitionMap {
    search: {
      input: {
        query: string;
      };
      output: {
        results: Array<{
          title: string;
          url: string;
        }>;
      };
    };
  }

  interface ChatDataPartMap {
    'data-weather': {
      city: string;
      temperatureC: number;
    };
  }
}

describe('x-chat package scaffold', () => {
  it('resolves the root, bridge, and type entry points', () => {
    const expectedChatRuntimeExports = [
      'ChatComposer',
      'ChatComposerAttachButton',
      'ChatComposerHelperText',
      'ChatComposerInput',
      'ChatComposerSendButton',
      'ChatComposerToolbar',
      'ChatConversations',
      'ChatDateDivider',
      'ChatMessage',
      'ChatMessageActions',
      'ChatMessageAvatar',
      'ChatMessageContent',
      'ChatMessageGroup',
      'ChatMessageMeta',
      'ChatMessageRoot',
      'ChatThread',
      'chatComposerClasses',
      'chatConversationsClasses',
      'chatMessageClasses',
      'chatThreadClasses',
      'getChatComposerUtilityClass',
      'getChatConversationsUtilityClass',
      'getChatMessageUtilityClass',
      'getChatThreadUtilityClass',
    ];
    const expectedChatComposerSubpathExports = [
      'ChatComposer',
      'ChatComposerAttachButton',
      'ChatComposerHelperText',
      'ChatComposerInput',
      'ChatComposerSendButton',
      'ChatComposerToolbar',
      'chatComposerClasses',
      'getChatComposerUtilityClass',
    ];
    const expectedChatConversationsSubpathExports = [
      'ChatConversations',
      'chatConversationsClasses',
      'getChatConversationsUtilityClass',
    ];
    const expectedChatThreadSubpathExports = [
      'ChatThread',
      'chatThreadClasses',
      'getChatThreadUtilityClass',
    ];
    const expectedChatMessageSubpathExports = [
      'ChatDateDivider',
      'ChatMessage',
      'ChatMessageActions',
      'ChatMessageAvatar',
      'ChatMessageContent',
      'ChatMessageGroup',
      'ChatMessageMeta',
      'ChatMessageRoot',
      'chatMessageClasses',
      'getChatMessageUtilityClass',
    ];
    const expectedHeadlessRuntimeExports = [
      'ChatProvider',
      'chatSelectors',
      'useChat',
      'useChatComposer',
      'useChatPartRenderer',
      'useChatStatus',
      'useChatStore',
      'useConversation',
      'useConversations',
      'useMessage',
      'useMessageIds',
    ];
    const expectedUnstyledRuntimeExports = [
      'Chat',
      'ChatLayout',
      'ChatRoot',
      'Composer',
      'ComposerAttachButton',
      'ComposerHelperText',
      'ComposerInput',
      'ComposerRoot',
      'ComposerSendButton',
      'ComposerToolbar',
      'ConversationList',
      'ConversationListItem',
      'ConversationListItemAvatar',
      'ConversationListItemMeta',
      'ConversationListItemText',
      'ConversationListRoot',
      'Indicators',
      'Message',
      'MessageActions',
      'MessageAvatar',
      'MessageContent',
      'MessageGroup',
      'MessageList',
      'MessageListDateDivider',
      'MessageListRoot',
      'MessageMeta',
      'MessageRoot',
      'ScrollToBottomAffordance',
      'Thread',
      'ThreadActions',
      'ThreadHeader',
      'ThreadRoot',
      'ThreadSubtitle',
      'ThreadTitle',
      'TypingIndicator',
      'UnreadMarker',
      'getDefaultMessagePartRenderer',
      'renderDefaultDataPart',
      'renderDefaultDynamicToolPart',
      'renderDefaultFilePart',
      'renderDefaultReasoningPart',
      'renderDefaultSourceDocumentPart',
      'renderDefaultSourceUrlPart',
      'renderDefaultStepStartPart',
      'renderDefaultTextPart',
      'renderDefaultToolPart',
    ];
    const headlessBridgeRuntime = headlessBridge as Record<string, unknown>;
    const headlessDirectRuntime = headlessDirect as Record<string, unknown>;
    const unstyledBridgeRuntime = unstyledBridge as Record<string, unknown>;
    const unstyledDirectRuntime = unstyledDirect as Record<string, unknown>;

    expect(chat).toBeDefined();
    expect(chatLocales).toBeDefined();
    expect(chatTypes).toBeDefined();
    expect(themeAugmentation).toBeDefined();
    expect(headlessBridge).toBeDefined();
    expect(unstyledBridge).toBeDefined();
    expect(Object.keys(chat).sort()).toEqual(expectedChatRuntimeExports);
    expect(Object.keys(chatComposerSubpath).sort()).toEqual(expectedChatComposerSubpathExports);
    expect(Object.keys(chatConversationsSubpath).sort()).toEqual(
      expectedChatConversationsSubpathExports,
    );
    expect(Object.keys(chatMessageSubpath).sort()).toEqual(expectedChatMessageSubpathExports);
    expect(Object.keys(chatThreadSubpath).sort()).toEqual(expectedChatThreadSubpathExports);
    expect(Object.keys(themeAugmentation)).toEqual([]);
    expect(Object.keys(chatLocales).sort()).toEqual(['enUS', 'getChatLocalization']);
    expect(Object.keys(headlessBridge).sort()).toEqual(expectedHeadlessRuntimeExports);
    expect(Object.keys(headlessDirect).sort()).toEqual(expectedHeadlessRuntimeExports);
    expect(Object.keys(unstyledBridge).sort()).toEqual(expectedUnstyledRuntimeExports);
    expect(Object.keys(unstyledDirect).sort()).toEqual(expectedUnstyledRuntimeExports);
    expect(Object.keys(unstyledChatBridge).sort()).toEqual(Object.keys(unstyledChatDirect).sort());
    expect(Object.keys(unstyledComposerBridge).sort()).toEqual(
      Object.keys(unstyledComposerDirect).sort(),
    );
    expect(Object.keys(unstyledConversationListBridge).sort()).toEqual(
      Object.keys(unstyledConversationListDirect).sort(),
    );
    expect(Object.keys(unstyledIndicatorsBridge).sort()).toEqual(
      Object.keys(unstyledIndicatorsDirect).sort(),
    );
    expect(Object.keys(unstyledMessageGroupBridge).sort()).toEqual(
      Object.keys(unstyledMessageGroupDirect).sort(),
    );
    expect(Object.keys(unstyledMessageBridge).sort()).toEqual(Object.keys(unstyledMessageDirect).sort());
    expect(Object.keys(unstyledMessageListBridge).sort()).toEqual(
      Object.keys(unstyledMessageListDirect).sort(),
    );
    expect(Object.keys(unstyledThreadBridge).sort()).toEqual(Object.keys(unstyledThreadDirect).sort());
    expect(headlessBridgeSelectors).toBe(headlessDirectSelectors);
    expect(HeadlessBridgeChatProvider).toBe(HeadlessDirectChatProvider);
    expect(headlessBridgeUseChatStore).toBe(headlessDirectUseChatStore);
    expect(headlessBridgeUseChat).toBe(headlessDirectUseChat);
    expect(headlessBridgeUseChatComposer).toBe(headlessDirectUseChatComposer);
    expect(headlessBridgeUseChatPartRenderer).toBe(headlessDirectUseChatPartRenderer);
    expect(headlessBridgeUseMessageIds).toBe(headlessDirectUseMessageIds);
    expect(headlessBridgeUseMessage).toBe(headlessDirectUseMessage);
    expect(headlessBridgeUseConversations).toBe(headlessDirectUseConversations);
    expect(headlessBridgeUseConversation).toBe(headlessDirectUseConversation);
    expect(headlessBridgeUseChatStatus).toBe(headlessDirectUseChatStatus);
    expect(headlessBridgeRuntime.ChatStore).toBeUndefined();
    expect(headlessBridgeRuntime.processStream).toBeUndefined();
    expect(headlessBridgeRuntime.useChatStoreContext).toBeUndefined();
    expect(headlessDirectRuntime.ChatStore).toBeUndefined();
    expect(headlessDirectRuntime.processStream).toBeUndefined();
    expect(headlessDirectRuntime.useChatStoreContext).toBeUndefined();
    expect(UnstyledBridgeChat).toBe(UnstyledDirectChat);
    expect(UnstyledBridgeChatRoot).toBe(UnstyledDirectChatRoot);
    expect(UnstyledBridgeChatLayout).toBe(UnstyledDirectChatLayout);
    expect(UnstyledBridgeChat.Root).toBe(UnstyledBridgeChatRoot);
    expect(UnstyledBridgeChat.Layout).toBe(UnstyledBridgeChatLayout);
    expect(UnstyledBridgeComposer).toBe(UnstyledDirectComposer);
    expect(UnstyledBridgeComposerRoot).toBe(UnstyledDirectComposerRoot);
    expect(UnstyledBridgeComposerInput).toBe(UnstyledDirectComposerInput);
    expect(UnstyledBridgeComposerSendButton).toBe(UnstyledDirectComposerSendButton);
    expect(UnstyledBridgeComposerAttachButton).toBe(UnstyledDirectComposerAttachButton);
    expect(UnstyledBridgeComposerToolbar).toBe(UnstyledDirectComposerToolbar);
    expect(UnstyledBridgeComposerHelperText).toBe(UnstyledDirectComposerHelperText);
    expect(UnstyledBridgeComposer.Root).toBe(UnstyledBridgeComposerRoot);
    expect(UnstyledBridgeComposer.Input).toBe(UnstyledBridgeComposerInput);
    expect(UnstyledBridgeComposer.SendButton).toBe(UnstyledBridgeComposerSendButton);
    expect(UnstyledBridgeComposer.AttachButton).toBe(UnstyledBridgeComposerAttachButton);
    expect(UnstyledBridgeComposer.Toolbar).toBe(UnstyledBridgeComposerToolbar);
    expect(UnstyledBridgeComposer.HelperText).toBe(UnstyledBridgeComposerHelperText);
    expect(UnstyledBridgeConversationList).toBe(UnstyledDirectConversationList);
    expect(UnstyledBridgeConversationListRoot).toBe(UnstyledDirectConversationListRoot);
    expect(UnstyledBridgeConversationList.Root).toBe(UnstyledBridgeConversationListRoot);
    expect(UnstyledBridgeIndicators).toBe(UnstyledDirectIndicators);
    expect(UnstyledBridgeTypingIndicator).toBe(UnstyledDirectTypingIndicator);
    expect(UnstyledBridgeUnreadMarker).toBe(UnstyledDirectUnreadMarker);
    expect(UnstyledBridgeScrollToBottomAffordance).toBe(UnstyledDirectScrollToBottomAffordance);
    expect(UnstyledBridgeIndicators.TypingIndicator).toBe(UnstyledBridgeTypingIndicator);
    expect(UnstyledBridgeIndicators.UnreadMarker).toBe(UnstyledBridgeUnreadMarker);
    expect(UnstyledBridgeIndicators.ScrollToBottomAffordance).toBe(
      UnstyledBridgeScrollToBottomAffordance,
    );
    expect(UnstyledBridgeMessageGroup).toBe(UnstyledDirectMessageGroup);
    expect(UnstyledBridgeMessage).toBe(UnstyledDirectMessage);
    expect(UnstyledBridgeMessageAvatar).toBe(UnstyledDirectMessageAvatar);
    expect(UnstyledBridgeMessageContent).toBe(UnstyledDirectMessageContent);
    expect(UnstyledBridgeMessageMeta).toBe(UnstyledDirectMessageMeta);
    expect(UnstyledBridgeMessageActions).toBe(UnstyledDirectMessageActions);
    expect(UnstyledBridgeMessageRoot).toBe(UnstyledDirectMessageRoot);
    expect(UnstyledBridgeMessage.Root).toBe(UnstyledBridgeMessageRoot);
    expect(UnstyledBridgeMessage.Avatar).toBe(UnstyledBridgeMessageAvatar);
    expect(UnstyledBridgeMessage.Content).toBe(UnstyledBridgeMessageContent);
    expect(UnstyledBridgeMessage.Meta).toBe(UnstyledBridgeMessageMeta);
    expect(UnstyledBridgeMessage.Actions).toBe(UnstyledBridgeMessageActions);
    expect(UnstyledBridgeMessageList).toBe(UnstyledDirectMessageList);
    expect(UnstyledBridgeMessageListDateDivider).toBe(UnstyledDirectMessageListDateDivider);
    expect(UnstyledBridgeMessageListRoot).toBe(UnstyledDirectMessageListRoot);
    expect(UnstyledBridgeMessageList.DateDivider).toBe(UnstyledBridgeMessageListDateDivider);
    expect(UnstyledBridgeMessageList.Root).toBe(UnstyledBridgeMessageListRoot);
    expect(UnstyledBridgeThread).toBe(UnstyledDirectThread);
    expect(UnstyledBridgeThreadRoot).toBe(UnstyledDirectThreadRoot);
    expect(UnstyledBridgeThread.Root).toBe(UnstyledBridgeThreadRoot);
    expect(unstyledBridgeRuntime.Chat).toBe(UnstyledBridgeChat);
    expect(unstyledBridgeRuntime.ChatRoot).toBe(UnstyledBridgeChatRoot);
    expect(unstyledBridgeRuntime.ChatLayout).toBe(UnstyledBridgeChatLayout);
    expect(unstyledBridgeRuntime.ConversationList).toBe(UnstyledBridgeConversationList);
    expect(unstyledBridgeRuntime.ConversationListRoot).toBe(UnstyledBridgeConversationListRoot);
    expect(unstyledBridgeRuntime.Message).toBe(UnstyledBridgeMessage);
    expect(unstyledBridgeRuntime.MessageRoot).toBe(UnstyledBridgeMessageRoot);
    expect(unstyledBridgeRuntime.MessageList).toBe(UnstyledBridgeMessageList);
    expect(unstyledBridgeRuntime.MessageListRoot).toBe(UnstyledBridgeMessageListRoot);
    expect(unstyledBridgeRuntime.MessageListDateDivider).toBe(UnstyledBridgeMessageListDateDivider);
    expect(unstyledBridgeRuntime.MessageGroup).toBe(UnstyledBridgeMessageGroup);
    expect(unstyledBridgeRuntime.Thread).toBe(UnstyledBridgeThread);
    expect(unstyledBridgeRuntime.ThreadRoot).toBe(UnstyledBridgeThreadRoot);
    expect(unstyledBridgeRuntime.Composer).toBe(UnstyledBridgeComposer);
    expect(unstyledBridgeRuntime.ComposerRoot).toBe(UnstyledBridgeComposerRoot);
    expect(unstyledBridgeRuntime.Indicators).toBe(UnstyledBridgeIndicators);
    expect(unstyledBridgeRuntime.TypingIndicator).toBe(UnstyledBridgeTypingIndicator);
    expect(unstyledBridgeRuntime.UnreadMarker).toBe(UnstyledBridgeUnreadMarker);
    expect(unstyledBridgeRuntime.ScrollToBottomAffordance).toBe(
      UnstyledBridgeScrollToBottomAffordance,
    );
    expect(unstyledBridgeRuntime.getDefaultMessagePartRenderer).toBe(
      unstyledDirectRuntime.getDefaultMessagePartRenderer,
    );
    expect(unstyledBridgeRuntime.renderDefaultTextPart).toBe(unstyledDirectRuntime.renderDefaultTextPart);
    expect(unstyledBridgeRuntime.renderDefaultToolPart).toBe(unstyledDirectRuntime.renderDefaultToolPart);
    expect(chat.ChatComposer).toBe(chatComposerSubpath.ChatComposer);
    expect(chat.ChatComposerInput).toBe(chatComposerSubpath.ChatComposerInput);
    expect(chat.ChatComposerSendButton).toBe(chatComposerSubpath.ChatComposerSendButton);
    expect(chat.ChatComposerAttachButton).toBe(chatComposerSubpath.ChatComposerAttachButton);
    expect(chat.ChatComposerToolbar).toBe(chatComposerSubpath.ChatComposerToolbar);
    expect(chat.ChatComposerHelperText).toBe(chatComposerSubpath.ChatComposerHelperText);
    expect(chat.chatComposerClasses).toBe(chatComposerSubpath.chatComposerClasses);
    expect(chat.getChatComposerUtilityClass).toBe(chatComposerSubpath.getChatComposerUtilityClass);
    expect(chat.ChatConversations).toBe(chatConversationsSubpath.ChatConversations);
    expect(chat.chatConversationsClasses).toBe(chatConversationsSubpath.chatConversationsClasses);
    expect(chat.getChatConversationsUtilityClass).toBe(
      chatConversationsSubpath.getChatConversationsUtilityClass,
    );
    expect(chat.ChatMessage).toBe(chatMessageSubpath.ChatMessage);
    expect(chat.ChatMessageRoot).toBe(chatMessageSubpath.ChatMessageRoot);
    expect(chat.ChatMessageAvatar).toBe(chatMessageSubpath.ChatMessageAvatar);
    expect(chat.ChatMessageContent).toBe(chatMessageSubpath.ChatMessageContent);
    expect(chat.ChatMessageMeta).toBe(chatMessageSubpath.ChatMessageMeta);
    expect(chat.ChatMessageActions).toBe(chatMessageSubpath.ChatMessageActions);
    expect(chat.ChatMessageGroup).toBe(chatMessageSubpath.ChatMessageGroup);
    expect(chat.ChatDateDivider).toBe(chatMessageSubpath.ChatDateDivider);
    expect(chat.chatMessageClasses).toBe(chatMessageSubpath.chatMessageClasses);
    expect(chat.getChatMessageUtilityClass).toBe(chatMessageSubpath.getChatMessageUtilityClass);
    expect(chat.ChatThread).toBe(chatThreadSubpath.ChatThread);
    expect(chat.chatThreadClasses).toBe(chatThreadSubpath.chatThreadClasses);
    expect(chat.getChatThreadUtilityClass).toBe(chatThreadSubpath.getChatThreadUtilityClass);
    expect(unstyledBridgeRuntime.renderDefaultDataPart).toBe(unstyledDirectRuntime.renderDefaultDataPart);
    expect(unstyledBridgeRuntime.markChatLayoutPane).toBeUndefined();
    expect(unstyledBridgeRuntime.ToolRenderer).toBeUndefined();
    expect(unstyledBridgeRuntime.JsonBlock).toBeUndefined();
    expect(unstyledDirectRuntime.markChatLayoutPane).toBeUndefined();
    expect(unstyledDirectRuntime.ToolRenderer).toBeUndefined();
    expect(unstyledDirectRuntime.JsonBlock).toBeUndefined();
  });

  it('type-checks the public Chatbox namespace facade', () => {
    const customPart: Extract<Chatbox.MessagePart, { type: 'poll' }> = {
      type: 'poll',
      question: 'Pick one',
      options: ['A', 'B'],
    };

    const textPart: Chatbox.TextMessagePart = {
      type: 'text',
      text: 'Hello',
      state: 'done',
    };

    const toolPart: Chatbox.ToolMessagePart<'search'> = {
      type: 'tool',
      toolInvocation: {
        toolCallId: 'tool-1',
        toolName: 'search',
        state: 'output-available',
        input: {
          query: 'weather',
        },
        output: {
          results: [{ title: 'Forecast', url: 'https://example.com' }],
        },
      },
    };

    const dataPart: Extract<Chatbox.MessagePart, { type: 'data-weather' }> = {
      type: 'data-weather',
      data: {
        city: 'Prague',
        temperatureC: 12,
      },
    };

    const message: Chatbox.Message = {
      id: 'm1',
      role: 'assistant',
      metadata: {
        traceId: 'trace-1',
        model: 'gpt-test',
      },
      author: {
        id: 'u1',
        metadata: {
          isStaff: true,
        },
      },
      parts: [textPart, toolPart, dataPart, customPart],
    };

    const conversation: Chatbox.Conversation = {
      id: 'c1',
      metadata: {
        workspaceId: 'workspace-1',
      },
    };

    const inputChunk: Chatbox.ToolInputAvailableChunk<'search'> = {
      type: 'tool-input-available',
      toolCallId: 'tool-1',
      toolName: 'search',
      input: {
        query: 'weather',
      },
    };

    const outputChunk: Chatbox.ToolOutputAvailableChunk<'search'> = {
      type: 'tool-output-available',
      toolCallId: 'tool-1',
      output: {
        results: [{ title: 'Forecast', url: 'https://example.com' }],
      },
    };

    const weatherChunk: Extract<Chatbox.MessageChunk, { type: 'data-weather' }> = {
      type: 'data-weather',
      data: {
        city: 'Prague',
        temperatureC: 12,
      },
    };

    const metadataChunk: Chatbox.MessageMetadataChunk = {
      type: 'message-metadata',
      metadata: {
        traceId: 'trace-2',
      },
    };

    const envelope: Chatbox.StreamEnvelope = {
      eventId: 'evt-1',
      sequence: 1,
      chunk: inputChunk,
    };

    const adapter: HeadlessAdapter<number> = {
      async listConversations({ cursor, query } = {}) {
        expect(cursor).toBeUndefined();
        expect(query).toBeUndefined();

        return {
          conversations: [conversation],
          cursor: 2,
          hasMore: true,
        };
      },
      async listMessages({ conversationId, cursor, direction }) {
        expect(conversationId).toBe('c1');
        expect(cursor).toBe(2);
        expect(direction).toBe('backward');

        return {
          messages: [message],
          cursor: 1,
          hasMore: false,
        };
      },
      async sendMessage({ conversationId, message: currentMessage, messages, signal }) {
        expect(conversationId).toBe('c1');
        expect(currentMessage.id).toBe('m1');
        expect(messages).toHaveLength(1);
        expect(signal).toBeInstanceOf(AbortSignal);

        return new ReadableStream<Chatbox.MessageChunk>({
          start(controller) {
            controller.enqueue({
              type: 'start',
              messageId: currentMessage.id,
            });
            controller.close();
          },
        });
      },
      subscribe({ onEvent }) {
        onEvent({
          type: 'message-added',
          message,
        });

        return () => {};
      },
    };

    const rendererMap: HeadlessPartRendererMap = {
      text: ({ part: currentPart }) => currentPart.text,
      poll: ({ part: currentPart }) => currentPart.question,
      tool: ({ part: currentPart }) => currentPart.toolInvocation.toolName,
    };

    const rendererAliasMap: Chatbox.PartRendererMap = rendererMap;
    const approvalResponseInput: HeadlessAddToolApproveResponseInput = {
      id: 'approval-1',
      approved: true,
    };
    const messageAlias: HeadlessMessage = message;
    const messagePartAlias: HeadlessMessagePart = textPart;
    const toolInvocationAlias: HeadlessToolInvocation<'search'> = toolPart.toolInvocation;
    const messageChunkAlias: HeadlessMessageChunk = outputChunk;
    const providerProps: HeadlessChatProviderProps<number> = {
      adapter,
      children: null,
    };
    const chatPalette: ThemeAugmentationPaletteChat = {
      userMessageBg: '#1976d2',
      composerFocusRing: '#0d47a1',
    };
    const chatComponents: ThemeAugmentationChatComponents = {
      MuiChatBox: {
        styleOverrides: {
          root: {
            color: 'red',
          },
        },
      },
    };
    const chatBoxProps: ThemeAugmentationChatBoxProps<number> = {
      adapter,
      className: 'chat-box',
      localeText: {
        composerSendButtonLabel: 'Send',
      },
    };
    const chatConversationsProps: ThemeAugmentationChatConversationsProps = {
      className: 'chat-conversations',
      dense: true,
    };
    const chatComposerProps: ThemeAugmentationChatComposerProps = {
      className: 'chat-composer',
      helperText: 'Helpful hint',
      toolbar: 'toolbar',
    };
    const chatMessageProps: ThemeAugmentationChatMessageProps = {
      className: 'chat-message',
      messageId: 'm1',
    };
    const chatThreadProps: ThemeAugmentationChatThreadProps = {
      className: 'chat-thread',
    };
    const chatLocaleText: ChatLocalesLocaleText = {
      composerInputPlaceholder: 'Type a message',
      composerInputAriaLabel: 'Message',
      composerSendButtonLabel: 'Send message',
      composerAttachButtonLabel: 'Add attachment',
      messageEditedLabel: 'Edited',
      messageDeletedLabel: 'Deleted',
      messageReasoningLabel: 'Reasoning',
      conversationListNoConversationsLabel: 'No conversations',
      conversationListSearchPlaceholder: 'Search conversations',
      unreadMarkerLabel: 'New messages',
      scrollToBottomLabel: 'Scroll to bottom',
      threadNoMessagesLabel: 'No messages yet',
      genericErrorLabel: 'Something went wrong',
      loadingLabel: 'Loading...',
      messageStatusLabel: (status) => status,
      toolStateLabel: (state) => state,
      messageTimestampLabel: (dateTime) => dateTime,
      conversationTimestampLabel: (dateTime) => dateTime,
      typingIndicatorLabel: (users) => users.map((user) => user.displayName ?? user.id).join(', '),
      scrollToBottomWithCountLabel: (count) => `Scroll to bottom, ${count} new messages`,
    };
    const chatLocalization: ChatLocalesLocalization = chatLocales.getChatLocalization({
      composerSendButtonLabel: 'Envoyer',
    });

    const publicState: Chatbox.PublicState<number> = {
      conversations: [conversation],
      activeConversationId: 'c1',
      messages: [message],
      messageCount: 1,
      isStreaming: false,
      hasMoreHistory: true,
      historyCursor: 2,
      error: null,
    };
    const publicStateAlias: HeadlessPublicState<number> = publicState;
    const unstyledChatRootProps: UnstyledBridgeChatRootProps<number> = {
      adapter,
      children: null,
    };
    const unstyledChatRootSlots: UnstyledBridgeChatRootSlots = {
      root: 'section',
    };
    const chatRootSlotRoot = { id: 'chat-root' };
    const unstyledChatRootSlotProps: UnstyledBridgeChatRootSlotProps = {
      root: chatRootSlotRoot,
    };
    const unstyledComposerInputProps: UnstyledBridgeComposerInputProps = {
      placeholder: 'Type a message',
    };
    const unstyledConversationListItemSlots: UnstyledBridgeConversationListItemSlots = {
      root: 'button',
    };
    const messageContentSlotRoot = { className: 'message-content' };
    const unstyledMessageContentSlotProps: UnstyledBridgeMessageContentSlotProps = {
      content: messageContentSlotRoot,
    };
    const scrollToBottomRootSlot = { id: 'scroll-affordance' };
    const unstyledScrollToBottomAffordanceProps: UnstyledBridgeScrollToBottomAffordanceProps = {
      slotProps: {
        root: scrollToBottomRootSlot,
      },
    };
    const unstyledThreadHeaderProps: UnstyledBridgeThreadHeaderProps = {
      role: 'banner',
    };
    const unstyledMessageListRootHandle: UnstyledBridgeMessageListRootHandle = {
      scrollToBottom() {},
    };

    const realtimeEvent: Chatbox.RealtimeEvent = {
      type: 'typing',
      conversationId: 'c1',
      userId: 'u1',
      isTyping: true,
    };
    const realtimeEventAlias: HeadlessRealtimeEvent = realtimeEvent;

    const onFinish: Chatbox.ChatOnFinish = ({ finishReason, isError }) => {
      expect(isError).toBe(false);
      expect(finishReason).toBe('stop');
    };

    expect(message.metadata?.traceId).toBe('trace-1');
    expect(message.author?.metadata?.isStaff).toBe(true);
    expect(toolPart.toolInvocation.input?.query).toBe('weather');
    expect(dataPart.data.city).toBe('Prague');
    expect(conversation.metadata?.workspaceId).toBe('workspace-1');
    expect(outputChunk.output.results[0].title).toBe('Forecast');
    expect(approvalResponseInput.approved).toBe(true);
    expect(messageAlias.id).toBe('m1');
    expect(messagePartAlias.type).toBe('text');
    expect(toolInvocationAlias.toolName).toBe('search');
    expect(messageChunkAlias.type).toBe('tool-output-available');
    expect(providerProps.adapter).toBe(adapter);
    expect(chatPalette.userMessageBg).toBe('#1976d2');
    expect(chatComponents.MuiChatBox?.styleOverrides?.root).toBeDefined();
    expect(chatBoxProps.className).toBe('chat-box');
    expect(chatComposerProps.className).toBe('chat-composer');
    expect(chatConversationsProps.className).toBe('chat-conversations');
    expect(chatConversationsProps.dense).toBe(true);
    expect(chatMessageProps.messageId).toBe('m1');
    expect(chatThreadProps.className).toBe('chat-thread');
    expect(chatBoxProps.localeText?.composerSendButtonLabel).toBe('Send');
    expect(chatLocaleText.composerAttachButtonLabel).toBe('Add attachment');
    expect(
      chatLocalization.components.MuiChatBox.defaultProps.localeText.composerSendButtonLabel,
    ).toBe('Envoyer');
    expect(weatherChunk.data.temperatureC).toBe(12);
    expect(metadataChunk.metadata.traceId).toBe('trace-2');
    expect(envelope.chunk.type).toBe('tool-input-available');
    expect(rendererAliasMap.text?.({ part: textPart, message, index: 0 })).toBe('Hello');
    expect(publicStateAlias.historyCursor).toBe(2);
    expect(realtimeEventAlias.type).toBe('typing');
    expect(adapter.subscribe).toBeDefined();
    expect(unstyledChatRootProps.adapter).toBe(adapter);
    expect(unstyledChatRootSlots.root).toBe('section');
    expect(chatRootSlotRoot.id).toBe('chat-root');
    expect(unstyledComposerInputProps.placeholder).toBe('Type a message');
    expect(unstyledConversationListItemSlots.root).toBe('button');
    expect(messageContentSlotRoot.className).toBe('message-content');
    expect(scrollToBottomRootSlot.id).toBe('scroll-affordance');
    expect(unstyledThreadHeaderProps.role).toBe('banner');
    unstyledMessageListRootHandle.scrollToBottom();

    onFinish({
      message,
      messages: [message],
      isAbort: false,
      isDisconnect: false,
      isError: false,
      finishReason: 'stop',
    });
  });
});
