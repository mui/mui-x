import * as React from 'react';

import { Initializable } from '../context.types';
import { AnimationState } from './Animation.types';

export const AnimationContext = React.createContext<Initializable<AnimationState>>({
  isInitialized: false,
  data: {
    skipAnimation: undefined,
  },
});

if (process.env.NODE_ENV !== 'production') {
  AnimationContext.displayName = 'AnimationContext';
}
