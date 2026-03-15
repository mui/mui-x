'use client';

export interface ComposerOwnerState {
  isSubmitting: boolean;
  hasValue: boolean;
  isStreaming: boolean;
  attachmentCount: number;
}

export interface ComposerRootOwnerState extends ComposerOwnerState {}

export interface ComposerInputOwnerState extends ComposerOwnerState {}

export interface ComposerSendButtonOwnerState extends ComposerOwnerState {}

export interface ComposerAttachButtonOwnerState extends ComposerOwnerState {}

export interface ComposerToolbarOwnerState extends ComposerOwnerState {}

export interface ComposerHelperTextOwnerState extends ComposerOwnerState {}
