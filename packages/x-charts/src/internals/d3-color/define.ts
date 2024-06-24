/* eslint-disable  */

export default function (constructor: any, factory: any, prototype: any) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

export function extend(parent: any, definition: any) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}
