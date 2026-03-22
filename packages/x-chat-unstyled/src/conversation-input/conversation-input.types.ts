'use client';

export interface ConversationInputOwnerState {
  isSubmitting: boolean;
  hasValue: boolean;
  isStreaming: boolean;
  attachmentCount: number;
  disabled: boolean;
}

export interface ConversationInputRootOwnerState extends ConversationInputOwnerState {}

export interface ConversationInputTextAreaOwnerState extends ConversationInputOwnerState {}

export interface ConversationInputSendButtonOwnerState extends ConversationInputOwnerState {}

export interface ConversationInputAttachButtonOwnerState extends ConversationInputOwnerState {}

export interface ConversationInputToolbarOwnerState extends ConversationInputOwnerState {}

export interface ConversationInputHelperTextOwnerState extends ConversationInputOwnerState {
  /** Whether the input currently has an error. */
  error: boolean;
}
