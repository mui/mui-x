'use client';

export interface ComposerOwnerState {
  isSubmitting: boolean;
  hasValue: boolean;
  isStreaming: boolean;
  attachmentCount: number;
  disabled: boolean;
}

export interface ComposerRootOwnerState extends ComposerOwnerState {}

export interface ComposerTextAreaOwnerState extends ComposerOwnerState {}

export interface ComposerSendButtonOwnerState extends ComposerOwnerState {}

export interface ComposerAttachButtonOwnerState extends ComposerOwnerState {}

export interface ComposerToolbarOwnerState extends ComposerOwnerState {}

export interface ComposerAttachmentListOwnerState extends ComposerOwnerState {}

export interface ComposerHelperTextOwnerState extends ComposerOwnerState {
  /** Whether the input currently has an error. */
  error: boolean;
}
