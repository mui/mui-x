import * as React from 'react';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function TextIcon(props: SvgIconOwnProps) {
  return (
    <SvgIcon {...props}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_11531_4738)">
          <path d="M0.494141 0V2.5679C0.494141 2.89518 0.759453 3.16049 1.08673 3.16049C1.41401 3.16049 1.67933 2.89518 1.67933 2.5679V1.18519H7.40772V14.8148H5.03735C4.71007 14.8148 4.44476 15.0801 4.44476 15.4074C4.44476 15.7347 4.71007 16 5.03735 16H10.9633C11.2906 16 11.5559 15.7347 11.5559 15.4074C11.5559 15.0801 11.2906 14.8148 10.9633 14.8148H8.59291V1.18519H14.3213V2.5679C14.3213 2.89518 14.5866 3.16049 14.9139 3.16049C15.2412 3.16049 15.5065 2.89518 15.5065 2.5679V0H0.494141Z" />
        </g>
        <defs>
          <clipPath id="clip0_11531_4738">
            <rect width="16" height="16" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
