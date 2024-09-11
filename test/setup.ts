import { beforeAll, afterAll } from 'vitest';
import 'test/utils/addChaiAssertions';

// @ts-ignore
globalThis.before = beforeAll;
// @ts-ignore
globalThis.after = afterAll;

const isVitest =
  // VITEST is present on the environment when not in browser mode.
  process.env.VITEST === 'true';

// Only necessary when not in browser mode.
if (isVitest) {
  class Touch {
    instance: any;
    constructor(instance: any) {
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
  // @ts-expect-error
  globalThis.window.Touch = Touch;
}
