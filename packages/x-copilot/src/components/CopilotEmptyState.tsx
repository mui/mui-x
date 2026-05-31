'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { ChatSuggestions } from '@mui/x-chat';
import type { ChatSuggestion } from '@mui/x-chat-headless';
import type { CopilotPanelIcons, CopilotPanelLocaleText } from './CopilotChatPanel.types';
import { useCopilotPanelUtilityClasses } from './copilotPanelClasses';

const EmptyStateRoot = styled('div', {
  name: 'MuiCopilotEmptyState',
  slot: 'Root',
})(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  boxSizing: 'border-box',
  pointerEvents: 'none',
}));

const EmptyStateCenter = styled('div', {
  name: 'MuiCopilotEmptyState',
  slot: 'Center',
})(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  textAlign: 'center',
}));

const EmptyStateIconCircle = styled('div', {
  name: 'MuiCopilotEmptyState',
  slot: 'IconCircle',
})(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: (theme.vars || theme).palette.action.hover,
  color: (theme.vars || theme).palette.text.primary,
  marginBottom: theme.spacing(1.5),
}));

const EmptyStateTitle = styled('p', {
  name: 'MuiCopilotEmptyState',
  slot: 'Title',
})(({ theme }) => ({
  margin: 0,
  ...theme.typography.subtitle1,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
}));

const EmptyStateHelper = styled('p', {
  name: 'MuiCopilotEmptyState',
  slot: 'Helper',
})(({ theme }) => ({
  margin: 0,
  maxWidth: 320,
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,
}));

const EmptyStateSuggestions = styled('div', {
  name: 'MuiCopilotEmptyState',
  slot: 'Suggestions',
})({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  pointerEvents: 'auto',
});

export interface CopilotEmptyStateProps {
  /** Title shown in the hero. Defaults to `localeText.emptyStateTitle`. */
  title?: React.ReactNode;
  /** Helper text shown below the title. Defaults to `localeText.emptyStateHelper`. */
  helper?: React.ReactNode;
  /** Localized strings; only `emptyStateTitle` / `emptyStateHelper` are read. */
  localeText?: Partial<CopilotPanelLocaleText>;
  /** Icon overrides; only `prompt` (hero) is read, defaulting to `AutoAwesomeOutlined`. */
  icons?: Pick<CopilotPanelIcons, 'prompt'>;
  /** Suggestion items rendered below the hero. */
  suggestions?: Array<ChatSuggestion | string>;
  /** Whether selecting a suggestion auto-submits the composer. */
  autoSubmit?: boolean;
  /** Class name applied to the root element. */
  className?: string;
}

const DEFAULT_TITLE = 'How can I help?';
const DEFAULT_HELPER = 'Ask a question or pick a suggestion to get started.';

/**
 * Generic empty-state hero for the Copilot panel: an icon, title, helper text,
 * and a list of suggestion chips. Host-agnostic — title/helper come from
 * `localeText` (with English defaults) and the hero icon from `icons.prompt`.
 */
function CopilotEmptyState(props: CopilotEmptyStateProps) {
  const { title, helper, localeText, icons, suggestions, autoSubmit, className } = props;
  const classes = useCopilotPanelUtilityClasses(undefined);
  const PromptIcon = icons?.prompt ?? AutoAwesomeOutlinedIcon;

  const resolvedTitle = title ?? localeText?.emptyStateTitle ?? DEFAULT_TITLE;
  const resolvedHelper = helper ?? localeText?.emptyStateHelper ?? DEFAULT_HELPER;

  return (
    <EmptyStateRoot className={clsx(classes.emptyState, className)}>
      <EmptyStateCenter>
        <EmptyStateIconCircle>
          <PromptIcon style={{ width: 28, height: 28 }} fontSize="medium" />
        </EmptyStateIconCircle>
        <EmptyStateTitle>{resolvedTitle}</EmptyStateTitle>
        <EmptyStateHelper>{resolvedHelper}</EmptyStateHelper>
      </EmptyStateCenter>
      <EmptyStateSuggestions className={classes.suggestions}>
        <ChatSuggestions suggestions={suggestions} autoSubmit={autoSubmit} alwaysVisible />
      </EmptyStateSuggestions>
    </EmptyStateRoot>
  );
}

export { CopilotEmptyState };
