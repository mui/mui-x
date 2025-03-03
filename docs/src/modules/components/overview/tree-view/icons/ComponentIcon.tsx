import * as React from 'react';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function ComponentIcon(props: SvgIconOwnProps) {
  return (
    <SvgIcon {...props}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.16912 8L8 14.8309L14.8309 8L8 1.16912L1.16912 8ZM0.266929 7.35558C-0.0889762 7.71148 -0.0889762 8.28852 0.266929 8.64442L7.35558 15.7331C7.71148 16.089 8.28852 16.089 8.64442 15.7331L15.7331 8.64442C16.089 8.28852 16.089 7.71148 15.7331 7.35558L8.64442 0.266929C8.28852 -0.0889761 7.71148 -0.0889764 7.35558 0.266929L0.266929 7.35558Z"
        />
      </svg>
    </SvgIcon>
  );
}
