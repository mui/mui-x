import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { PointerManager } from './PointerManager';

describe('PointerManager', () => {
  let mousePointerManager: PointerManager;
  let touchPointerManager: PointerManager;
  let target: HTMLElement;
  let pointerDown: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointerdown']) => any>;
  let pointerMove: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointermove']) => any>;
  let pointerUp: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointerup']) => any>;

  beforeEach(() => {
    // Create a target element for testing
    target = document.createElement('div');
    target.style.width = '100px';
    target.style.height = '100px';
    document.body.appendChild(target);

    // Set up event listeners
    pointerDown = vi.fn();
    pointerMove = vi.fn();
    pointerUp = vi.fn();

    target.addEventListener('pointerdown', pointerDown);
    target.addEventListener('pointermove', pointerMove);
    target.addEventListener('pointerup', pointerUp);

    // Create PointerManager instances
    mousePointerManager = new PointerManager('mouse');
    touchPointerManager = new PointerManager('touch');
  });

  afterEach(() => {
    // Clean up the target element
    if (target.parentNode) {
      target.parentNode.removeChild(target);
    }

    // Remove event listeners
    target.removeEventListener('pointerdown', pointerDown);
    target.removeEventListener('pointermove', pointerMove);
    target.removeEventListener('pointerup', pointerUp);
  });

  describe('parseMousePointer', () => {
    it('should create a mouse pointer at the center of the target by default', () => {
      const pointer = mousePointerManager.parseMousePointer(undefined, target);

      expect(pointer.id).toBe(1);
      expect(pointer.x).toBe(50); // Center of 100px width
      expect(pointer.y).toBe(50); // Center of 100px height
      expect(pointer.target).toBe(target);
    });

    it('should create a mouse pointer with custom coordinates', () => {
      const pointer = mousePointerManager.parseMousePointer({ x: 25, y: 75 }, target);

      expect(pointer.id).toBe(1);
      expect(pointer.x).toBe(25);
      expect(pointer.y).toBe(75);
      expect(pointer.target).toBe(target);
    });

    it('should throw an error when used with touch mode', () => {
      expect(() => {
        touchPointerManager.parseMousePointer(undefined, target);
      }).toThrow('Mouse pointer can only be used in mouse mode');
    });
  });

  describe('parsePointers', () => {
    it('should create pointers based on default config for touch mode', () => {
      const pointers = touchPointerManager.parsePointers(undefined, target, {
        amount: 2,
        distance: 50,
      });

      expect(pointers.length).toBe(2);
      expect(pointers[0].id).toBeGreaterThan(500);
      expect(pointers[1].id).toBeGreaterThan(500);
      expect(pointers[0].target).toBe(target);
      expect(pointers[1].target).toBe(target);

      // Pointers should be at opposite positions in a circle
      const distance = Math.sqrt(
        (pointers[0].x - pointers[1].x) ** 2 + (pointers[0].y - pointers[1].y) ** 2,
      );
      expect(distance).toBeCloseTo(50);
    });

    it('should create pointers with custom configurations', () => {
      const pointers = touchPointerManager.parsePointers(
        {
          amount: 3,
          distance: 100,
        },
        target,
        {
          amount: 2,
          distance: 50,
        },
      );

      expect(pointers.length).toBe(3);

      // Verify they form a triangle around the center
      const uniquePositions = new Set(pointers.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`));
      expect(uniquePositions.size).toBe(3);
    });

    it('should throw an error when trying to create multiple pointers in mouse mode', () => {
      expect(() => {
        mousePointerManager.parsePointers(
          {
            amount: 2,
            distance: 50,
          },
          target,
          {
            amount: 1,
            distance: 50,
          },
        );
      }).toThrow('Mouse mode only supports one pointer');
    });

    it('should handle custom pointer ids when provided', () => {
      const customIds = [701, 702, 703];
      const pointers = touchPointerManager.parsePointers(
        {
          amount: 3,
          distance: 100,
          ids: customIds,
        },
        target,
        {
          amount: 2,
          distance: 50,
        },
      );

      expect(pointers.length).toBe(3);
      expect(pointers[0].id).toBe(701);
      expect(pointers[1].id).toBe(702);
      expect(pointers[2].id).toBe(703);
    });

    it('should correctly parse array of pointers', () => {
      const customPointers = [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
      ];

      const pointers = touchPointerManager.parsePointers(customPointers, target, {
        amount: 1,
        distance: 50,
      });

      expect(pointers.length).toBe(2);
      expect(pointers[0].x).toBe(10);
      expect(pointers[0].y).toBe(20);
      expect(pointers[1].x).toBe(30);
      expect(pointers[1].y).toBe(40);
    });

    it('should handle different targets for different pointers', () => {
      const secondTarget = document.createElement('div');
      document.body.appendChild(secondTarget);

      try {
        const customPointers = [{ target }, { target: secondTarget }];

        const pointers = touchPointerManager.parsePointers(customPointers, target, {
          amount: 1,
          distance: 50,
        });

        expect(pointers.length).toBe(2);
        expect(pointers[0].target).toBe(target);
        expect(pointers[1].target).toBe(secondTarget);
      } finally {
        if (secondTarget.parentNode) {
          secondTarget.parentNode.removeChild(secondTarget);
        }
      }
    });
  });

  describe('pointerDown, pointerMove, and pointerUp', () => {
    it('should dispatch pointer events with correct data', () => {
      const pointer = mousePointerManager.parseMousePointer({ x: 25, y: 75 }, target);

      // Test pointerDown
      mousePointerManager.pointerDown(pointer);
      expect(pointerDown).toHaveBeenCalledTimes(1);
      const downEvent = pointerDown.mock.calls[0][0];
      expect(downEvent.clientX).toBe(25);
      expect(downEvent.clientY).toBe(75);
      expect(downEvent.pointerId).toBe(1);
      expect(downEvent.pointerType).toBe('mouse');

      // Test pointerMove
      mousePointerManager.pointerMove({
        ...pointer,
        x: 50,
        y: 50,
      });
      expect(pointerMove).toHaveBeenCalledTimes(1);
      const moveEvent = pointerMove.mock.calls[0][0];
      expect(moveEvent.clientX).toBe(50);
      expect(moveEvent.clientY).toBe(50);

      // Test pointerUp
      mousePointerManager.pointerUp({
        ...pointer,
        x: 50,
        y: 50,
      });
      expect(pointerUp).toHaveBeenCalledTimes(1);
      const upEvent = pointerUp.mock.calls[0][0];
      expect(upEvent.clientX).toBe(50);
      expect(upEvent.clientY).toBe(50);
    });

    it('should handle multiple touch pointers correctly', () => {
      const pointers = touchPointerManager.parsePointers(
        {
          amount: 2,
          distance: 50,
        },
        target,
        {
          amount: 1,
          distance: 0,
        },
      );

      // Test pointerDown for both
      pointers.forEach((p) => touchPointerManager.pointerDown(p));
      expect(pointerDown).toHaveBeenCalledTimes(2);

      // Test pointerMove for both
      const movedPointers = pointers.map((p) => ({
        ...p,
        x: p.x + 10,
        y: p.y + 10,
      }));
      movedPointers.forEach((p) => touchPointerManager.pointerMove(p));
      expect(pointerMove).toHaveBeenCalledTimes(2);

      // Test pointerUp for both
      movedPointers.forEach((p) => touchPointerManager.pointerUp(p));
      expect(pointerUp).toHaveBeenCalledTimes(2);
    });

    it('should not trigger multiple pointerDown events for the same pointer', () => {
      const pointer = mousePointerManager.parseMousePointer(undefined, target);

      // First pointerDown
      mousePointerManager.pointerDown(pointer);
      expect(pointerDown).toHaveBeenCalledTimes(1);

      // Second pointerDown (should be ignored)
      mousePointerManager.pointerDown(pointer);
      expect(pointerDown).toHaveBeenCalledTimes(1); // Still 1
    });
  });

  describe('nextId', () => {
    it('should generate sequential IDs starting from 501', () => {
      const id1 = touchPointerManager.nextId();
      const id2 = touchPointerManager.nextId();
      const id3 = touchPointerManager.nextId();

      expect(id1).toBe(501);
      expect(id2).toBe(502);
      expect(id3).toBe(503);
    });
  });

  describe('Integration between methods', () => {
    it('should allow a full gesture workflow', () => {
      // Create a pointer
      const pointer = mousePointerManager.parseMousePointer({ x: 20, y: 20 }, target);

      // Down
      mousePointerManager.pointerDown(pointer);

      // Move in several steps
      mousePointerManager.pointerMove({ ...pointer, x: 30, y: 20 });
      mousePointerManager.pointerMove({ ...pointer, x: 40, y: 20 });
      mousePointerManager.pointerMove({ ...pointer, x: 50, y: 20 });

      // Up
      mousePointerManager.pointerUp({ ...pointer, x: 50, y: 20 });

      // Verify all events were called
      expect(pointerDown).toHaveBeenCalledTimes(1);
      expect(pointerMove).toHaveBeenCalledTimes(3);
      expect(pointerUp).toHaveBeenCalledTimes(1);

      // Verify the final position
      const upEvent = pointerUp.mock.calls[0][0];
      expect(upEvent.clientX).toBe(50);
      expect(upEvent.clientY).toBe(20);
    });

    it('should handle touch pointer lifecycle correctly', () => {
      // Create touch pointers
      const pointers = touchPointerManager.parsePointers(
        {
          amount: 2,
          distance: 50,
        },
        target,
        {
          amount: 1,
          distance: 0,
        },
      );

      // Down with both pointers
      pointers.forEach((p) => touchPointerManager.pointerDown(p));

      // Up with the first pointer only
      touchPointerManager.pointerUp(pointers[0]);

      // At this point, only one pointer should be up
      expect(pointerUp).toHaveBeenCalledTimes(1);

      // Move the remaining pointer
      touchPointerManager.pointerMove({
        ...pointers[1],
        x: pointers[1].x + 10,
        y: pointers[1].y + 10,
      });

      // Should still work
      expect(pointerMove).toHaveBeenCalledTimes(1);

      // Up with the second pointer
      touchPointerManager.pointerUp(pointers[1]);
      expect(pointerUp).toHaveBeenCalledTimes(2);
    });
  });

  describe('Pointer Enter and Leave Events', () => {
    let pointerOver: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointerover']) => any>;
    let pointerEnter: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointerenter']) => any>;
    let pointerOut: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointerout']) => any>;
    let pointerLeave: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointerleave']) => any>;
    let secondTarget: HTMLElement;

    beforeEach(() => {
      // Create a second target for pointer movement between elements
      secondTarget = document.createElement('div');
      secondTarget.style.width = '100px';
      secondTarget.style.height = '100px';
      secondTarget.style.position = 'absolute';
      secondTarget.style.left = '200px';
      document.body.appendChild(secondTarget);

      // Set up event listeners for over/enter/out/leave events
      pointerOver = vi.fn();
      pointerEnter = vi.fn();
      pointerOut = vi.fn();
      pointerLeave = vi.fn();

      target.addEventListener('pointerover', pointerOver);
      target.addEventListener('pointerenter', pointerEnter);
      target.addEventListener('pointerout', pointerOut);
      target.addEventListener('pointerleave', pointerLeave);

      secondTarget.addEventListener('pointerover', pointerOver);
      secondTarget.addEventListener('pointerenter', pointerEnter);
      secondTarget.addEventListener('pointerout', pointerOut);
      secondTarget.addEventListener('pointerleave', pointerLeave);
    });

    afterEach(() => {
      // Clean up
      if (secondTarget.parentNode) {
        secondTarget.parentNode.removeChild(secondTarget);
      }

      target.removeEventListener('pointerover', pointerOver);
      target.removeEventListener('pointerenter', pointerEnter);
      target.removeEventListener('pointerout', pointerOut);
      target.removeEventListener('pointerleave', pointerLeave);

      secondTarget.removeEventListener('pointerover', pointerOver);
      secondTarget.removeEventListener('pointerenter', pointerEnter);
      secondTarget.removeEventListener('pointerout', pointerOut);
      secondTarget.removeEventListener('pointerleave', pointerLeave);
    });

    it('should fire pointerover and pointerenter events when a pointer enters an element', () => {
      // Call the protected pointerEnter method using type casting to access it
      const pointer = mousePointerManager.parseMousePointer({ x: 50, y: 50 }, target);
      mousePointerManager.pointerMove(pointer);

      // Verify events were fired
      expect(pointerOver).toHaveBeenCalledTimes(1);
      expect(pointerEnter).toHaveBeenCalledTimes(1);

      // Verify event properties
      const overEvent = pointerOver.mock.calls[0][0];
      expect(overEvent.type).toBe('pointerover');
      expect(overEvent.target).toBe(target);

      const enterEvent = pointerEnter.mock.calls[0][0];
      expect(enterEvent.type).toBe('pointerenter');
      expect(enterEvent.target).toBe(target);
    });

    it('should fire pointerout and pointerleave events when a pointer leaves an element', () => {
      // Call the protected pointerLeave method using type casting to access it
      const pointer = mousePointerManager.parseMousePointer({ x: 50, y: 50 }, target);
      mousePointerManager.pointerMove(pointer);
      const secondPointer = mousePointerManager.parseMousePointer({ x: 50, y: 50 }, secondTarget);
      mousePointerManager.pointerMove(secondPointer);

      // Verify events were fired
      expect(pointerOut).toHaveBeenCalledTimes(1);
      expect(pointerLeave).toHaveBeenCalledTimes(1);

      // Verify event properties
      const outEvent = pointerOut.mock.calls[0][0];
      expect(outEvent.type).toBe('pointerout');
      expect(outEvent.target).toBe(target);

      const leaveEvent = pointerLeave.mock.calls[0][0];
      expect(leaveEvent.type).toBe('pointerleave');
      expect(leaveEvent.target).toBe(target);
    });
  });

  describe('Pointer movement between elements', () => {
    let pointerOver: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointerover']) => any>;
    let pointerEnter: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointerenter']) => any>;
    let pointerOut: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointerout']) => any>;
    let pointerLeave: Mock<(this: HTMLElement, ev: HTMLElementEventMap['pointerleave']) => any>;
    let secondTarget: HTMLElement;

    beforeEach(() => {
      // Create a second target
      secondTarget = document.createElement('div');
      secondTarget.id = 'secondTarget';
      secondTarget.style.width = '100px';
      secondTarget.style.height = '100px';
      secondTarget.style.position = 'absolute';
      secondTarget.style.left = '200px';
      document.body.appendChild(secondTarget);

      // Set up event listeners
      pointerOver = vi.fn();
      pointerEnter = vi.fn();
      pointerOut = vi.fn();
      pointerLeave = vi.fn();

      target.addEventListener('pointerover', pointerOver);
      target.addEventListener('pointerenter', pointerEnter);
      target.addEventListener('pointerout', pointerOut);
      target.addEventListener('pointerleave', pointerLeave);

      secondTarget.addEventListener('pointerover', pointerOver);
      secondTarget.addEventListener('pointerenter', pointerEnter);
      secondTarget.addEventListener('pointerout', pointerOut);
      secondTarget.addEventListener('pointerleave', pointerLeave);
    });

    afterEach(() => {
      // Clean up
      if (secondTarget.parentNode) {
        secondTarget.parentNode.removeChild(secondTarget);
      }

      target.removeEventListener('pointerover', pointerOver);
      target.removeEventListener('pointerenter', pointerEnter);
      target.removeEventListener('pointerout', pointerOut);
      target.removeEventListener('pointerleave', pointerLeave);

      secondTarget.removeEventListener('pointerover', pointerOver);
      secondTarget.removeEventListener('pointerenter', pointerEnter);
      secondTarget.removeEventListener('pointerout', pointerOut);
      secondTarget.removeEventListener('pointerleave', pointerLeave);
    });

    it('should fire appropriate events when moving pointer between elements', () => {
      // Create pointer on first target
      const pointer = mousePointerManager.parseMousePointer({ x: 50, y: 50 }, target);

      // Simulate pointer down on first target
      mousePointerManager.pointerDown(pointer);

      // Reset mocks before the move
      pointerOver.mockReset();
      pointerEnter.mockReset();
      pointerOut.mockReset();
      pointerLeave.mockReset();

      // Move pointer to second target
      const updatedPointer = { ...pointer, x: 250, y: 50, target: secondTarget };
      mousePointerManager.pointerMove(updatedPointer);

      // Verify leave events were fired for first target
      expect(pointerOut).toHaveBeenCalled();
      expect(pointerLeave).toHaveBeenCalled();

      // Verify enter events were fired for second target
      expect(pointerOver).toHaveBeenCalled();
      expect(pointerEnter).toHaveBeenCalled();

      // Verify target of events
      const outEvent = pointerOut.mock.calls[0][0];
      const leaveEvent = pointerLeave.mock.calls[0][0];
      const overEvent = pointerOver.mock.calls[0][0];
      const enterEvent = pointerEnter.mock.calls[0][0];

      expect(outEvent.target).toBe(target);
      expect(leaveEvent.target).toBe(target);
      expect(overEvent.target).toBe(secondTarget);
      expect(enterEvent.target).toBe(secondTarget);
    });

    it('should correctly handle touch pointer movement between elements', () => {
      // Create touch pointer on first target
      const pointer = touchPointerManager.parsePointers({ amount: 1, distance: 0 }, target, {
        amount: 1,
        distance: 0,
      })[0];

      // Simulate pointer down
      touchPointerManager.pointerDown(pointer);

      // Reset mocks
      pointerOver.mockReset();
      pointerEnter.mockReset();
      pointerOut.mockReset();
      pointerLeave.mockReset();

      // Move to second target
      const updatedPointer = { ...pointer, target: secondTarget, x: 250, y: 50 };
      touchPointerManager.pointerMove(updatedPointer);

      // Verify events
      expect(pointerOut).toHaveBeenCalled();
      expect(pointerLeave).toHaveBeenCalled();
      expect(pointerOver).toHaveBeenCalled();
      expect(pointerEnter).toHaveBeenCalled();

      // Verify pointer type in events
      const enterEvent = pointerEnter.mock.calls[0][0];
      expect(enterEvent.pointerType).toBe('touch');
    });
  });

  describe('Reusing pointers', () => {
    it('should maintain previous x and y values when reusing pointers', () => {
      // Create initial touch pointers
      const initialPointers = touchPointerManager.parsePointers(
        {
          amount: 2,
          distance: 50,
        },
        target,
        {
          amount: 1,
          distance: 0,
        },
      );

      // Remember the original positions
      const originalPositions = initialPointers.map((p) => ({ id: p.id, x: p.x, y: p.y }));

      // Create new pointers reusing the same IDs but without specifying x/y
      const pointersWithIds = {
        ids: initialPointers.map((p) => p.id),
        amount: 2,
        distance: 100, // Different distance to ensure it would generate different positions if not reusing
      };

      const reusedPointers = touchPointerManager.parsePointers(pointersWithIds, target, {
        amount: 1,
        distance: 0,
      });

      // The positions should remain the same as the original pointers
      reusedPointers.forEach((pointer, index) => {
        expect(pointer.id).toBe(originalPositions[index].id);
        expect(pointer.x).toBe(originalPositions[index].x);
        expect(pointer.y).toBe(originalPositions[index].y);
      });
    });

    it('should allow overriding specific x/y values when reusing pointers', () => {
      // Create an initial touch pointer
      const initialPointers = touchPointerManager.parsePointers(
        {
          amount: 1,
          distance: 0,
        },
        target,
        {
          amount: 1,
          distance: 0,
        },
      );
      const initialPointer = initialPointers[0];

      // Now reuse the pointer ID but specify a new x position
      const customPointers = [
        {
          id: initialPointer.id,
          x: 75, // New x position
          // y not specified - should keep original value
        },
      ];

      const reusedPointers = touchPointerManager.parsePointers(customPointers, target, {
        amount: 1,
        distance: 0,
      });
      const reusedPointer = reusedPointers[0];

      // Verify that x was updated but y remained the same
      expect(reusedPointer.id).toBe(initialPointer.id);
      expect(reusedPointer.x).toBe(75);
      expect(reusedPointer.y).toBe(initialPointer.y);
    });

    it('should reuse pointer positions for mouse pointers too', () => {
      // Create initial mouse pointer
      const initialPointer = mousePointerManager.parseMousePointer({ x: 25, y: 75 }, target);
      // We got to update the pointer first to simulate a real scenario
      Reflect.get(mousePointerManager, 'updatePointers').bind(mousePointerManager)(initialPointer);

      // Reuse the pointer but without specifying coordinates
      const reusedPointer = mousePointerManager.parseMousePointer(
        {
          // x and y not specified
        },
        target,
      );

      // The position should be the same as the original
      expect(reusedPointer.x).toBe(initialPointer.x);
      expect(reusedPointer.y).toBe(initialPointer.y);
    });
  });
});
