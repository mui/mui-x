import type * as React from 'react';

export function NotRendered<T>(_props: T): React.ReactNode {
  throw new Error('MUI X: Failed assertion: should not be rendered');
}
