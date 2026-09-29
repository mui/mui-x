import * as React from 'react';
import { fastObjectShallowCompare } from '@base-ui/utils/fastObjectShallowCompare';

export function fastMemo<T>(component: T): T {
  return React.memo(component as any, fastObjectShallowCompare) as unknown as T;
}
