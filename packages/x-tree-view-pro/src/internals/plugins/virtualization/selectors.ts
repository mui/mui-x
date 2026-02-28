import { createSelector } from '@mui/x-internals/store';
import { RichTreeViewProState } from '../../RichTreeViewProStore';

export const virtualizationSelectors = {
  enabled: createSelector((state: RichTreeViewProState<any, any>) => state.virtualization),
};
