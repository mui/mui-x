import * as React from 'react';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function BottomIcon(props: SvgIconOwnProps) {
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
          d="M1.2 2L1.2 14C1.2 14.4418 1.55817 14.8 2 14.8H5C5.44183 14.8 5.8 14.4418 5.8 14L5.8 2C5.8 1.55817 5.44183 1.2 5 1.2L2 1.2C1.55817 1.2 1.2 1.55817 1.2 2ZM5.24537e-07 14C5.72819e-07 15.1046 0.895431 16 2 16H5C6.10457 16 7 15.1046 7 14L7 2C7 0.89543 6.10457 -4.82814e-08 5 0L2 1.31135e-07C0.89543 1.79418e-07 -4.82823e-08 0.895431 0 2L5.24537e-07 14Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.2 7L10.2 14C10.2 14.4418 10.5582 14.8 11 14.8H14C14.4418 14.8 14.8 14.4418 14.8 14L14.8 7C14.8 6.55817 14.4418 6.2 14 6.2H11C10.5582 6.2 10.2 6.55817 10.2 7ZM9 14C9 15.1046 9.89543 16 11 16H14C15.1046 16 16 15.1046 16 14V7C16 5.89543 15.1046 5 14 5H11C9.89543 5 9 5.89543 9 7L9 14Z"
        />
      </svg>
    </SvgIcon>
  );
}
