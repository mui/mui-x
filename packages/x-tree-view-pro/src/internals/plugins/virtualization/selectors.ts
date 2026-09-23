import type { RichTreeViewProState } from '../../RichTreeViewProStore';

export const virtualizationSelectors = {
  enabled: (state: RichTreeViewProState<any, any>) => state.virtualization,
};
