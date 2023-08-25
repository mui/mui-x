import * as React from 'react';

export interface UseTreeViewKeyboardNavigationInstance {
  mapFirstChar: (nodeId: string, firstChar: string) => void;
  // TODO: Replace this method by the returned method of `mapFirstChar`
  unMapFirstChar: (nodeId: string) => void;
}

export interface UseTreeViewKeyboardNavigationProps
  extends Pick<React.HTMLAttributes<HTMLUListElement>, 'onKeyDown'> {}

export type UseTreeViewKeyboardNavigationDefaultizedProps = UseTreeViewKeyboardNavigationProps;
