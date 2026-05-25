'use client';
import * as React from 'react';

interface StudioCopilotContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  available: boolean;
}

const DEFAULT: StudioCopilotContextValue = {
  open: false,
  setOpen: () => {},
  available: false,
};

const StudioCopilotContext = React.createContext<StudioCopilotContextValue>(DEFAULT);

export interface StudioCopilotProviderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  available: boolean;
  children: React.ReactNode;
}

export function StudioCopilotProvider(props: StudioCopilotProviderProps) {
  const { open, setOpen, available, children } = props;
  const value = React.useMemo(
    () => ({ open, setOpen, available }),
    [open, setOpen, available],
  );
  return (
    <StudioCopilotContext.Provider value={value}>{children}</StudioCopilotContext.Provider>
  );
}

export function useStudioCopilotControls(): StudioCopilotContextValue {
  return React.useContext(StudioCopilotContext);
}
