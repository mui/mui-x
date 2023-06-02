import * as React from 'react';
import { fastObjectShallowCompare } from './fastObjectShallowCompare';

export function fastMemo(component: React.FunctionComponent) {
  return React.memo(component, fastObjectShallowCompare);
}
