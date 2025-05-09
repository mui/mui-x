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
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   * @default 'text'
   */
  component: PropTypes.oneOfType([
    PropTypes.oneOf([
      'a',
      'abbr',
      'address',
      'animate',
      'animateMotion',
      'animateTransform',
      'area',
      'article',
      'aside',
      'audio',
      'b',
      'base',
      'bdi',
      'bdo',
      'big',
      'blockquote',
      'body',
      'br',
      'button',
      'canvas',
      'caption',
      'center',
      'circle',
      'cite',
      'clipPath',
      'code',
      'col',
      'colgroup',
      'data',
      'datalist',
      'dd',
      'defs',
      'del',
      'desc',
      'details',
      'dfn',
      'dialog',
      'div',
      'dl',
      'dt',
      'ellipse',
      'em',
      'embed',
      'feBlend',
      'feColorMatrix',
      'feComponentTransfer',
      'feComposite',
      'feConvolveMatrix',
      'feDiffuseLighting',
      'feDisplacementMap',
      'feDistantLight',
      'feDropShadow',
      'feFlood',
      'feFuncA',
      'feFuncB',
      'feFuncG',
      'feFuncR',
      'feGaussianBlur',
      'feImage',
      'feMerge',
      'feMergeNode',
      'feMorphology',
      'feOffset',
      'fePointLight',
      'feSpecularLighting',
      'feSpotLight',
      'feTile',
      'feTurbulence',
      'fieldset',
      'figcaption',
      'figure',
      'filter',
      'footer',
      'foreignObject',
      'form',
      'g',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'head',
      'header',
      'hgroup',
      'hr',
      'html',
      'i',
      'iframe',
      'image',
      'img',
      'input',
      'ins',
      'kbd',
      'keygen',
      'label',
      'legend',
      'li',
      'line',
      'linearGradient',
      'link',
      'main',
      'map',
      'mark',
      'marker',
      'mask',
      'menu',
      'menuitem',
      'meta',
      'metadata',
      'meter',
      'mpath',
      'nav',
      'noindex',
      'noscript',
      'object',
      'ol',
      'optgroup',
      'option',
      'output',
      'p',
      'param',
      'path',
      'pattern',
      'picture',
      'polygon',
      'polyline',
      'pre',
      'progress',
      'q',
      'radialGradient',
      'rect',
      'rp',
      'rt',
      'ruby',
      's',
      'samp',
      'script',
      'search',
      'section',
      'select',
      'set',
      'slot',
      'small',
      'source',
      'span',
      'stop',
      'strong',
      'style',
      'sub',
      'summary',
      'sup',
      'svg',
      'switch',
      'symbol',
      'table',
      'tbody',
      'td',
      'template',
      'text',
      'textarea',
      'textPath',
      'tfoot',
      'th',
      'thead',
      'time',
      'title',
      'tr',
      'track',
      'tspan',
      'u',
      'ul',
      'use',
      'var',
      'video',
      'view',
      'wbr',
      'webview',
    ]),
    PropTypes.func,
  ]),
  /**
   * The background color to contrast against.
   * Used to calculate the text color for optimal readability.
   */
  textBackground: PropTypes.string.isRequired,
  /**
   * Optional fill color for the text.
   * If provided, it overrides the automatically calculated contrasting color.
   */
  textFill: PropTypes.string,
} as any;

export { ChartsContrastingText };
