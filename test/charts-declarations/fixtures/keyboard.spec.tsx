import type * as React from 'react';
import type {} from '@mui/x-charts/moduleAugmentation/keyboardActivation';
import type { ChartsActivationEvent } from '@mui/x-charts/models';
import type { Equal, Expect } from './assertions.js';

export type KeyboardTypes = [
  Expect<Equal<ChartsActivationEvent, MouseEvent | KeyboardEvent>>,
  Expect<Equal<ChartsActivationEvent<SVGElement>, React.MouseEvent<SVGElement> | KeyboardEvent>>,
];
