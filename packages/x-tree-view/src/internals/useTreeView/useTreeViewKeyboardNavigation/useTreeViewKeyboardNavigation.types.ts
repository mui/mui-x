export interface UseTreeViewKeyboardNavigationInstance {
  mapFirstChar: (nodeId: string, firstChar: string) => () => void;
}

export interface UseTreeViewKeyboardNavigationParameters {}

export type UseTreeViewKeyboardNavigationDefaultizedParameters =
  UseTreeViewKeyboardNavigationParameters;
