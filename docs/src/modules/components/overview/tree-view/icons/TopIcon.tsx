import * as React from 'react';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function TopIcon(props: SvgIconOwnProps) {
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
          d="M10.2 2L10.2 9C10.2 9.44183 10.5582 9.8 11 9.8H14C14.4418 9.8 14.8 9.44183 14.8 9L14.8 2C14.8 1.55817 14.4418 1.2 14 1.2L11 1.2C10.5582 1.2 10.2 1.55817 10.2 2ZM9 9C9 10.1046 9.89543 11 11 11H14C15.1046 11 16 10.1046 16 9V2C16 0.89543 15.1046 -4.82814e-08 14 0L11 1.31135e-07C9.89543 1.79418e-07 9 0.895431 9 2L9 9Z"
        />
      </svg>
    </SvgIcon>
  );
}
