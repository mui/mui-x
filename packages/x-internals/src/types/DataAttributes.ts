type DataAttributeValue = string | number | boolean | undefined;

/**
 * Module-augmentable interface that lets consumers declare strongly-typed
 * custom `data-*` keys, which become part of `DataAttributes` everywhere slot
 * props accept it. Example:
 *
 *     declare module '@mui/x-internals/types' {
 *       interface DataAttributesOverrides {
 *         'data-qa-id'?: string;
 *       }
 *     }
 */
export interface DataAttributesOverrides {}

/**
 * Index signature for arbitrary `data-*` attributes, merged with any
 * strongly-typed overrides declared via `DataAttributesOverrides`.
 *
 * `aria-*` keys are intentionally not included here: every slot inner type
 * used in MUI X already inherits `React.AriaAttributes` through its element
 * or component base type (`HTMLAttributes`, `SVGAttributes`, `ButtonBaseProps`,
 * etc.), so widening with them would be redundant. `data-*` is the only thing
 * the host React types don't expose as a typed key, so it's the only thing
 * this helper adds.
 */
export type DataAttributes = DataAttributesOverrides & {
  [k: `data-${string}`]: DataAttributeValue;
};

/**
 * Widens a slot-props type to also accept arbitrary `data-*` attributes.
 *
 * Implemented as a union between the original type and the intersected widened
 * form — `T | (T & DataAttributes)` — so that pre-typed values remain
 * assignable to the original branch without having to declare a `data-*`
 * index signature themselves, while object literals can pick up the widened
 * branch and include `data-*` keys.
 */
export type WithDataAttributes<T> = T | (T & DataAttributes);
