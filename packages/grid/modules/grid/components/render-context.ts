import * as React from 'react';
import { RenderContextProps } from '../models';

export const RenderContext = React.createContext<Partial<RenderContextProps> | null>(null);
