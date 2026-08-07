import { createSelector } from '@mui/x-internals/store';
import type { RichTreeViewProState } from '../../RichTreeViewProStore';

export const virtualizationSelectors = {
  enabled: createSelector((state: RichTreeViewProState<any, any>) => state.virtualization),
};
