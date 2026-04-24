'use client';
import * as React from 'react';

/**
 * Provides the z-order index for a plot based on its position in `ChartsWebGLLayer`'s children.
 * `useWebGLLayer` reads this and auto-binds it to `registerDraw` so consumers don't pass it manually.
 */
export const ChartsWebGLOrderContext = React.createContext<number>(0);
