import * as React from 'react';
import { ReactNode } from 'react';

export const validateChildren = (
  childrenArray: Array<Exclude<ReactNode, boolean | null | undefined>>,
): void => {
  if (childrenArray.length !== 2) {
    throw new Error(
      'The Splitter component needs exactly 2 children react node to split panels properly',
    );
  } else {
    childrenArray.forEach(c => {
      if (!React.isValidElement(c)) {
        throw new Error('Invalid child element');
      }
    });
  }
};
//
// export const debounce = (fn: Function, debounceTime = 50): Function => {
//   let timeout;
//   return (...args) => {
//     console.log('timeout value is  ', timeout);
//
//     if (timeout == undefined) {
//       timeout = setTimeout(() => {
//         console.log('calling fn with ', args);
//         fn(args);
//       }, debounceTime);
//     }
//   };
// };
