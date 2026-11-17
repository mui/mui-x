import type * as React from 'react';
import type { MuiRenderResult } from '@mui/internal-test-utils/createRenderer';

export interface DescribePickerOptions {
  fieldType: 'single-input' | 'multi-input';
  variant: 'mobile' | 'desktop' | 'static';
  hasNoView?: boolean;
  render: (node: React.ReactElement<any>) => MuiRenderResult;
}
