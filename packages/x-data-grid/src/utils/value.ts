export function value<Value extends { (args: any[]): any } | any>(
  a: Value,
  ...args: Value extends (...args: infer U) => any ? U : []
): Value extends (...args: any[]) => infer U ? U : Value {
  return typeof a === 'function' ? a(...args) : a;
}
