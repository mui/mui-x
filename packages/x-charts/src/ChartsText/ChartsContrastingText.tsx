'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { getContrastingTextColor } from './getContrastingTextColor';

export type ChartsContrastingTextProps<T extends React.ElementType = React.ElementType> =
  React.SVGTextElementAttributes<SVGTextElement> &
    React.ComponentPropsWithoutRef<T> & {
      /**
       * The background color to contrast against.
       * Used to calculate the text color for optimal readability.
       */
      textBackground: string;
      /**
       * Optional fill color for the text.
       * If provided, it overrides the automatically calculated contrasting color.
       */
      textFill?: string;
      /**
       * The component used for the root node.
       * Either a string to use a DOM element or a component.
       * @default 'text'
       */
      component?: T;
    };

/**
 * A text component that displays with a contrasting color against its background.
 */
function ChartsContrastingText(props: ChartsContrastingTextProps) {
  const { textBackground, textFill, component, ...other } = props;

  const Component = component ?? 'text';

  return <Component {...other} fill={textFill ?? getContrastingTextColor(textBackground)} />;
}

ChartsContrastingText.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The background color to contrast against.
   * Used to calculate the text color for optimal readability.
   */
  background: PropTypes.string.isRequired,
  /**
   * Optional fill color for the text.
   * If provided, it overrides the automatically calculated contrasting color.
   */
  fill: PropTypes.string,
} as any;

export { ChartsContrastingText };
