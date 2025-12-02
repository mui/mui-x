export default function constant(x) {
  // eslint-disable-next-line func-names
  return function () {
    return x;
  };
}
