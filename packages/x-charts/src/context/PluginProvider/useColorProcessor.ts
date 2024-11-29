export function useColorProcessor() {
  return {
    line:
      (..._: any) =>
      (__?: number) =>
        'black',
    bar:
      (..._: any) =>
      (__?: number) =>
        'black',
    scatter:
      (..._: any) =>
      (__?: number) =>
        'black',
    pie:
      (..._: any) =>
      (__?: number) =>
        'black',
  };
}
