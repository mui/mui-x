import * as React from 'react';

export interface PromptFieldState {
  value: string;
  disabled: boolean;
  recording: boolean;
}

export interface PromptFieldContextValue {
  state: PromptFieldState;
  lang: string | undefined;
  onValueChange: (value: string) => void;
  onRecordingChange: (recording: boolean) => void;
  onSubmit: (prompt: string) => void;
  onError: ((error: string) => void) | undefined;
}

export const PromptFieldContext = React.createContext<PromptFieldContextValue | undefined>(
  undefined,
);

export function usePromptFieldContext() {
  const context = React.useContext(PromptFieldContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. Prompt Field subcomponents must be placed within a <PromptField /> component.',
    );
  }

  return context;
}
