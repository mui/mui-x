const propNames = [
  'fontFamily',
  'fontSize',
  'fontSizeAdjust',
  'fontStretch',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'dominantBaseline',
  'textAnchor',
  'textDecoration',
  'letterSpacing',
];
export const filterAttributeSafeProperties = (props: any) => {
  return {
    safe: Object.fromEntries(
      Object.entries(props).filter(
        ([key, value]) => value !== undefined && propNames.includes(key),
      ),
    ),
    unsafe: Object.fromEntries(
      Object.entries(props).filter(
        ([key, value]) => value !== undefined && !propNames.includes(key),
      ),
    ),
  };
};
