import * as React from 'react';
import { WrapperVariant } from '../../models/common';

/**
 * TODO consider getting rid from wrapper variant
 * @ignore - internal component.
 */
export const WrapperVariantContext = React.createContext<WrapperVariant>(null);
