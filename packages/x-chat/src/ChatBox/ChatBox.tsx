'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { ChatRoot } from '@mui/x-chat-unstyled';
import { useChatBoxUtilityClasses } from './chatBoxClasses';
import { ChatBoxContent } from './ChatBoxContent';
import type { ChatBoxProps } from './ChatBox.types';

const ChatBoxStyled = styled('div', {
  name: 'MuiChatBox',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  minHeight: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: (theme.vars || theme).palette.background.default,
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
}));

type ChatBoxComponent = (<Cursor = string>(
  props: ChatBoxProps<Cursor> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ChatBox = React.forwardRef(function ChatBox<Cursor = string>(
  inProps: ChatBoxProps<Cursor>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatBox' });

  const {
    // ChatRoot / provider props
    adapter,
    messages,
    defaultMessages,
    onMessagesChange,
    conversations,
    defaultConversations,
    onConversationsChange,
    activeConversationId,
    defaultActiveConversationId,
    onActiveConversationChange,
    composerValue,
    defaultComposerValue,
    onComposerValueChange,
    onToolCall,
    onFinish,
    onData,
    onError,
    streamFlushInterval,
    partRenderers,
    storeClass,
    localeText,
    // Styled / visual props
    className,
    classes: classesProp,
    sx,
    slots,
    slotProps,
    features,
    ...other
  } = props;

  const classes = useChatBoxUtilityClasses(classesProp);

  return (
    <ChatRoot
      adapter={adapter}
      messages={messages}
      defaultMessages={defaultMessages}
      onMessagesChange={onMessagesChange}
      conversations={conversations}
      defaultConversations={defaultConversations}
      onConversationsChange={onConversationsChange}
      activeConversationId={activeConversationId}
      defaultActiveConversationId={defaultActiveConversationId}
      onActiveConversationChange={onActiveConversationChange}
      composerValue={composerValue}
      defaultComposerValue={defaultComposerValue}
      onComposerValueChange={onComposerValueChange}
      onToolCall={onToolCall}
      onFinish={onFinish}
      onData={onData}
      onError={onError}
      streamFlushInterval={streamFlushInterval}
      partRenderers={partRenderers}
      storeClass={storeClass}
      localeText={localeText}
      slotProps={{ root: { style: { display: 'contents' } } }}
    >
      <ChatBoxStyled ref={ref} className={clsx(classes.root, className)} sx={sx} {...other}>
        <ChatBoxContent
          slots={slots}
          slotProps={slotProps}
          features={features}
          layoutClassName={classes.layout}
          conversationsPaneClassName={classes.conversationsPane}
          threadPaneClassName={classes.threadPane}
        />
      </ChatBoxStyled>
    </ChatRoot>
  );
}) as ChatBoxComponent;
