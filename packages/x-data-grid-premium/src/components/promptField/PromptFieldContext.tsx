import * as React from 'react';

export interface PromptFieldState {
  value: string;
  loading: boolean;
  recording: boolean;
  error: string | null;
}

export interface PromptFieldContextValue {
  state: PromptFieldState;
  lang: string | undefined;
  onValueUpdate: (value: string) => void;
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRecordingChange: (recording: boolean) => void;
  onStopRecording: (value: string) => void;
  onSend: () => void;
  onError: (error: string) => void;
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
