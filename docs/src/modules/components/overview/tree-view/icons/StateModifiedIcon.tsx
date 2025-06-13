import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function StateModifiedIcon(props: SvgIconOwnProps) {
  const theme = useTheme();
  return (
    <SvgIcon {...props}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          rx="2"
          stroke={theme.palette.warning.dark}
          strokeWidth="2"
        />
        <path
          d="M11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z"
          fill={theme.palette.warning.dark}
        />
      </svg>
    </SvgIcon>
  );
}
