'use client';
import * as React from 'react';
import type { CopilotFeedbackSubmit } from './CopilotChatPanel.types';

/**
 * Context that lets the host plug in the feedback submission (the `/feedback`
 * HTTP call, an analytics event, …) without the panel components having to know
 * the backend URL or auth headers. Hosts wrap the panel in
 * `<CopilotFeedbackProvider submit={...} />`; leaf components read the handler
 * via `useCopilotFeedback()`. The `null` default keeps feedback-aware
 * components safe to render when no backend is plugged in (e.g. an echo demo).
 */
const CopilotFeedbackContext = React.createContext<CopilotFeedbackSubmit | null>(null);

export interface CopilotFeedbackProviderProps {
  /** Handler invoked when a feedback payload is submitted. */
  submit: CopilotFeedbackSubmit;
  /** The subtree that can submit feedback through this provider. */
  children: React.ReactNode;
}

/**
 * Provides a host-supplied feedback submission handler to the Copilot panel.
 */
function CopilotFeedbackProvider(props: CopilotFeedbackProviderProps) {
  const { submit, children } = props;
  return (
    <CopilotFeedbackContext.Provider value={submit}>{children}</CopilotFeedbackContext.Provider>
  );
}

/** Returns the host-supplied feedback handler, or `null` when none is provided. */
function useCopilotFeedback(): CopilotFeedbackSubmit | null {
  return React.useContext(CopilotFeedbackContext);
}

export { CopilotFeedbackProvider, useCopilotFeedback };
