import * as React from 'react';
import { StyledComponentProps } from '@mui/material/styles';

/**
 * Remove properties `K` from `T`.
 * Distributive for union types.
 *
 * @internal
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type StandardProps<C, Removals extends keyof C = never> = DistributiveOmit<
  C,
  'classes' | Removals
> &
  // each component declares it's classes in a separate interface for proper JSDoc
  StyledComponentProps<never> & {
    ref?: C extends { ref?: infer RefType } ? RefType : React.Ref<unknown>;
    // TODO: Remove implicit props. Up to each component.
    className?: string;
    style?: React.CSSProperties;
  };

export type DefaultizedProps<
  P extends {},
  RequiredProps extends keyof P,
  AdditionalProps extends {} = {},
> = Omit<P, RequiredProps | keyof AdditionalProps> &
  Required<Pick<P, RequiredProps>> &
  AdditionalProps;
