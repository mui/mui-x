// TODO v7: This file exist only to simplify typing between
// components/componentsProps and slots/slotProps
// Should be deleted when components/componentsProps are removed

export type UncapitalizeObjectKeys<T extends object> = {
  [K in keyof T as K extends string ? Uncapitalize<K> : K]: T[K];
};

export const uncapitalizeObjectKeys = <TInputType extends object>(
  capitalizedObject: TInputType,
) => {
  if (capitalizedObject === undefined) {
    return undefined;
  }
  return Object.keys(capitalizedObject).reduce(
    (acc, key) => ({
      ...acc,
      [`${key.charAt(0).toLowerCase()}${key.slice(1)}`]: capitalizedObject[key as keyof TInputType],
    }),
    {} as UncapitalizeObjectKeys<TInputType>,
  );
};
