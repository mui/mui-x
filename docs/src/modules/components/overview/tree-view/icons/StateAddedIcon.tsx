import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function StateAddedIcon(props: SvgIconOwnProps) {
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
          stroke={theme.palette.success.main}
          strokeWidth="2"
        />
        <path
          d="M8 5V11M5 8H11"
          stroke={theme.palette.success.main}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </SvgIcon>
  );
}
