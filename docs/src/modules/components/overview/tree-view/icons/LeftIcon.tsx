import * as React from 'react';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function LeftIcon(props: SvgIconOwnProps) {
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
          d="M9 10.2H2C1.55817 10.2 1.2 10.5582 1.2 11V14C1.2 14.4418 1.55817 14.8 2 14.8H9C9.44183 14.8 9.8 14.4418 9.8 14V11C9.8 10.5582 9.44183 10.2 9 10.2ZM2 9C0.895431 9 0 9.89543 0 11V14C0 15.1046 0.895431 16 2 16H9C10.1046 16 11 15.1046 11 14V11C11 9.89543 10.1046 9 9 9H2Z"
        />
      </svg>
    </SvgIcon>
  );
}
