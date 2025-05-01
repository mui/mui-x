import {
  GridConfiguration,
  configuration as communityConfiguration,
} from '@mui/x-data-grid/internals';
import { useGridAriaAttributes } from '../hooks/utils/useGridAriaAttributes';
import { useGridRowAriaAttributes } from '../hooks/features/rows/useGridRowAriaAttributes';

export const configuration: GridConfiguration = {
  ...communityConfiguration,
  hooks: {
    ...communityConfiguration.hooks,
    useGridAriaAttributes,
    useGridRowAriaAttributes,
  },
};
