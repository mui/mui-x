import * as React from 'react';

export interface ScopePopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  containerRef: React.RefObject<HTMLElement | null>;
}
