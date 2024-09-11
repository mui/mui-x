import { beforeAll, afterAll } from 'vitest';
import 'test/utils/addChaiAssertions';

// @ts-ignore
globalThis.before = beforeAll;
// @ts-ignore
globalThis.after = afterAll;

class Touch {
  constructor(instance) {
    this.instance = instance;
  }

  get identifier() {
    return this.instance.identifier;
  }

  get pageX() {
    return this.instance.pageX;
  }

  get pageY() {
    return this.instance.pageY;
  }

  get clientX() {
    return this.instance.clientX;
  }

  get clientY() {
    return this.instance.clientY;
  }
}
globalThis.window.Touch = Touch;
