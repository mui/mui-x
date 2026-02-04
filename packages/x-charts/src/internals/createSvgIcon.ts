import type * as React from 'react';
import { createSvgIcon as createSvgIconMaterial } from '@mui/material/utils';
import { type ChartBaseIconProps } from '../models/slots/chartsBaseSlotProps';

export const createSvgIcon = createSvgIconMaterial as (
  path: React.ReactNode,
  displayName?: string,
) => (props: ChartBaseIconProps) => React.ReactNode;
