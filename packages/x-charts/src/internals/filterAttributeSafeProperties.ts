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
  'stroke',
  'strokeWidth',
  'shapeRendering',
];
export const filterAttributeSafeProperties = (props: any) => {
  const safe: Record<string, any> = {};
  const unsafe: Record<string, any> = {};

  for (const key in props) {
    if (props.hasOwnProperty(key) && props[key] !== undefined) {
      const value = props[key];
      if (propNames.includes(key)) {
        safe[key] = value;
      } else {
        unsafe[key] = value;
      }
    }
  }

  return { safe, unsafe };
};
