import * as React from 'react';
import SvgIcon, { SvgIconOwnProps } from '@mui/material/SvgIcon';

export default function HorizontalCenterIcon(props: SvgIconOwnProps) {
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
          d="M11.5 10.2H4.5C4.05817 10.2 3.7 10.5582 3.7 11V14C3.7 14.4418 4.05817 14.8 4.5 14.8H11.5C11.9418 14.8 12.3 14.4418 12.3 14V11C12.3 10.5582 11.9418 10.2 11.5 10.2ZM4.5 9C3.39543 9 2.5 9.89543 2.5 11V14C2.5 15.1046 3.39543 16 4.5 16H11.5C12.6046 16 13.5 15.1046 13.5 14V11C13.5 9.89543 12.6046 9 11.5 9H4.5Z"
        />
      </svg>
    </SvgIcon>
  );
}
