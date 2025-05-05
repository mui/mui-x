import * as React from 'react';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function VerticalCenterIcon(props: SvgIconOwnProps) {
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
          d="M1.2 2L1.2 14C1.2 14.4418 1.55817 14.8 2 14.8H5C5.44183 14.8 5.8 14.4418 5.8 14L5.8 2C5.8 1.55817 5.44183 1.2 5 1.2L2 1.2C1.55817 1.2 1.2 1.55817 1.2 2ZM10.2 4.5L10.2 11.5C10.2 11.9418 10.5582 12.3 11 12.3H14C14.4418 12.3 14.8 11.9418 14.8 11.5V4.5C14.8 4.05817 14.4418 3.7 14 3.7L11 3.7C10.5582 3.7 10.2 4.05817 10.2 4.5ZM0 14C0 15.1046 0.895431 16 2 16H5C6.10457 16 7 15.1046 7 14L7 2C7 0.89543 6.10457 0 5 0H2C0.895431 0 0 0.895431 0 2V14ZM9 11.5C9 12.6046 9.89543 13.5 11 13.5H14C15.1046 13.5 16 12.6046 16 11.5V4.5C16 3.39543 15.1046 2.5 14 2.5L11 2.5C9.89543 2.5 9 3.39543 9 4.5L9 11.5Z"
        />
      </svg>
    </SvgIcon>
  );
}
