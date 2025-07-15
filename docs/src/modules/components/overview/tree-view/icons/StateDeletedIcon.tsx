import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function StateDeletedIcon(props: SvgIconOwnProps) {
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
          stroke={theme.palette.error.main}
          strokeWidth="2"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 8C4 7.44772 4.44772 7 5 7H11C11.5523 7 12 7.44772 12 8C12 8.55228 11.5523 9 11 9H5C4.44772 9 4 8.55228 4 8Z"
          fill={theme.palette.error.main}
        />
      </svg>
    </SvgIcon>
  );
}
