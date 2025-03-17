import * as React from 'react';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function RightIcon(props: SvgIconOwnProps) {
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
          d="M14 1.2H2C1.55817 1.2 1.2 1.55817 1.2 2V5C1.2 5.44183 1.55817 5.8 2 5.8H14C14.4418 5.8 14.8 5.44183 14.8 5V2C14.8 1.55817 14.4418 1.2 14 1.2ZM2 0C0.895431 0 0 0.89543 0 2V5C0 6.10457 0.895431 7 2 7H14C15.1046 7 16 6.10457 16 5V2C16 0.895431 15.1046 0 14 0H2Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 10.2H7C6.55817 10.2 6.2 10.5582 6.2 11V14C6.2 14.4418 6.55817 14.8 7 14.8H14C14.4418 14.8 14.8 14.4418 14.8 14V11C14.8 10.5582 14.4418 10.2 14 10.2ZM7 9C5.89543 9 5 9.89543 5 11V14C5 15.1046 5.89543 16 7 16H14C15.1046 16 16 15.1046 16 14V11C16 9.89543 15.1046 9 14 9H7Z"
        />
      </svg>
    </SvgIcon>
  );
}
