import * as React from 'react';

export function NotRendered<T>(_props: T): React.ReactNode {
  throw new Error('Failed assertion: should not be rendered');
}
