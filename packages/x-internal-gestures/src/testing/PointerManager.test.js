"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var PointerManager_1 = require("./PointerManager");
(0, vitest_1.describe)('PointerManager', function () {
    var mousePointerManager;
    var touchPointerManager;
    var target;
    var pointerDown;
    var pointerMove;
    var pointerUp;
    (0, vitest_1.beforeEach)(function () {
        // Create a target element for testing
        target = document.createElement('div');
        target.style.width = '100px';
        target.style.height = '100px';
        document.body.appendChild(target);
        // Set up event listeners
        pointerDown = vitest_1.vi.fn();
        pointerMove = vitest_1.vi.fn();
        pointerUp = vitest_1.vi.fn();
        target.addEventListener('pointerdown', pointerDown);
        target.addEventListener('pointermove', pointerMove);
        target.addEventListener('pointerup', pointerUp);
        // Create PointerManager instances
        mousePointerManager = new PointerManager_1.PointerManager('mouse');
        touchPointerManager = new PointerManager_1.PointerManager('touch');
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up the target element
        if (target.parentNode) {
            target.parentNode.removeChild(target);
        }
        // Remove event listeners
        target.removeEventListener('pointerdown', pointerDown);
        target.removeEventListener('pointermove', pointerMove);
        target.removeEventListener('pointerup', pointerUp);
    });
    (0, vitest_1.describe)('parseMousePointer', function () {
        (0, vitest_1.it)('should create a mouse pointer at the center of the target by default', function () {
            var pointer = mousePointerManager.parseMousePointer(undefined, target);
            (0, vitest_1.expect)(pointer.id).toBe(1);
            (0, vitest_1.expect)(pointer.x).toBe(50); // Center of 100px width
            (0, vitest_1.expect)(pointer.y).toBe(50); // Center of 100px height
            (0, vitest_1.expect)(pointer.target).toBe(target);
        });
        (0, vitest_1.it)('should create a mouse pointer with custom coordinates', function () {
            var pointer = mousePointerManager.parseMousePointer({ x: 25, y: 75 }, target);
            (0, vitest_1.expect)(pointer.id).toBe(1);
            (0, vitest_1.expect)(pointer.x).toBe(25);
            (0, vitest_1.expect)(pointer.y).toBe(75);
            (0, vitest_1.expect)(pointer.target).toBe(target);
        });
        (0, vitest_1.it)('should throw an error when used with touch mode', function () {
            (0, vitest_1.expect)(function () {
                touchPointerManager.parseMousePointer(undefined, target);
            }).toThrow('Mouse pointer can only be used in mouse mode');
        });
    });
    (0, vitest_1.describe)('parsePointers', function () {
        (0, vitest_1.it)('should create pointers based on default config for touch mode', function () {
            var pointers = touchPointerManager.parsePointers(undefined, target, {
                amount: 2,
                distance: 50,
            });
            (0, vitest_1.expect)(pointers.length).toBe(2);
            (0, vitest_1.expect)(pointers[0].id).toBeGreaterThan(500);
            (0, vitest_1.expect)(pointers[1].id).toBeGreaterThan(500);
            (0, vitest_1.expect)(pointers[0].target).toBe(target);
            (0, vitest_1.expect)(pointers[1].target).toBe(target);
            // Pointers should be at opposite positions in a circle
            var distance = Math.sqrt(Math.pow((pointers[0].x - pointers[1].x), 2) + Math.pow((pointers[0].y - pointers[1].y), 2));
            (0, vitest_1.expect)(distance).toBeCloseTo(50);
        });
        (0, vitest_1.it)('should create pointers with custom configurations', function () {
            var pointers = touchPointerManager.parsePointers({
                amount: 3,
                distance: 100,
            }, target, {
                amount: 2,
                distance: 50,
            });
            (0, vitest_1.expect)(pointers.length).toBe(3);
            // Verify they form a triangle around the center
            var uniquePositions = new Set(pointers.map(function (p) { return "".concat(Math.round(p.x), ",").concat(Math.round(p.y)); }));
            (0, vitest_1.expect)(uniquePositions.size).toBe(3);
        });
        (0, vitest_1.it)('should throw an error when trying to create multiple pointers in mouse mode', function () {
            (0, vitest_1.expect)(function () {
                mousePointerManager.parsePointers({
                    amount: 2,
                    distance: 50,
                }, target, {
                    amount: 1,
                    distance: 50,
                });
            }).toThrow('Mouse mode only supports one pointer');
        });
        (0, vitest_1.it)('should handle custom pointer ids when provided', function () {
            var customIds = [701, 702, 703];
            var pointers = touchPointerManager.parsePointers({
                amount: 3,
                distance: 100,
                ids: customIds,
            }, target, {
                amount: 2,
                distance: 50,
            });
            (0, vitest_1.expect)(pointers.length).toBe(3);
            (0, vitest_1.expect)(pointers[0].id).toBe(701);
            (0, vitest_1.expect)(pointers[1].id).toBe(702);
            (0, vitest_1.expect)(pointers[2].id).toBe(703);
        });
        (0, vitest_1.it)('should correctly parse array of pointers', function () {
            var customPointers = [
                { x: 10, y: 20 },
                { x: 30, y: 40 },
            ];
            var pointers = touchPointerManager.parsePointers(customPointers, target, {
                amount: 1,
                distance: 50,
            });
            (0, vitest_1.expect)(pointers.length).toBe(2);
            (0, vitest_1.expect)(pointers[0].x).toBe(10);
            (0, vitest_1.expect)(pointers[0].y).toBe(20);
            (0, vitest_1.expect)(pointers[1].x).toBe(30);
            (0, vitest_1.expect)(pointers[1].y).toBe(40);
        });
        (0, vitest_1.it)('should handle different targets for different pointers', function () {
            var secondTarget = document.createElement('div');
            document.body.appendChild(secondTarget);
            try {
                var customPointers = [{ target: target }, { target: secondTarget }];
                var pointers = touchPointerManager.parsePointers(customPointers, target, {
                    amount: 1,
                    distance: 50,
                });
                (0, vitest_1.expect)(pointers.length).toBe(2);
                (0, vitest_1.expect)(pointers[0].target).toBe(target);
                (0, vitest_1.expect)(pointers[1].target).toBe(secondTarget);
            }
            finally {
                if (secondTarget.parentNode) {
                    secondTarget.parentNode.removeChild(secondTarget);
                }
            }
        });
    });
    (0, vitest_1.describe)('pointerDown, pointerMove, and pointerUp', function () {
        (0, vitest_1.it)('should dispatch pointer events with correct data', function () {
            var pointer = mousePointerManager.parseMousePointer({ x: 25, y: 75 }, target);
            // Test pointerDown
            mousePointerManager.pointerDown(pointer);
            (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(1);
            var downEvent = pointerDown.mock.calls[0][0];
            (0, vitest_1.expect)(downEvent.clientX).toBe(25);
            (0, vitest_1.expect)(downEvent.clientY).toBe(75);
            (0, vitest_1.expect)(downEvent.pointerId).toBe(1);
            (0, vitest_1.expect)(downEvent.pointerType).toBe('mouse');
            // Test pointerMove
            mousePointerManager.pointerMove(__assign(__assign({}, pointer), { x: 50, y: 50 }));
            (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(1);
            var moveEvent = pointerMove.mock.calls[0][0];
            (0, vitest_1.expect)(moveEvent.clientX).toBe(50);
            (0, vitest_1.expect)(moveEvent.clientY).toBe(50);
            // Test pointerUp
            mousePointerManager.pointerUp(__assign(__assign({}, pointer), { x: 50, y: 50 }));
            (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(1);
            var upEvent = pointerUp.mock.calls[0][0];
            (0, vitest_1.expect)(upEvent.clientX).toBe(50);
            (0, vitest_1.expect)(upEvent.clientY).toBe(50);
        });
        (0, vitest_1.it)('should handle multiple touch pointers correctly', function () {
            var pointers = touchPointerManager.parsePointers({
                amount: 2,
                distance: 50,
            }, target, {
                amount: 1,
                distance: 0,
            });
            // Test pointerDown for both
            pointers.forEach(function (p) { return touchPointerManager.pointerDown(p); });
            (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(2);
            // Test pointerMove for both
            var movedPointers = pointers.map(function (p) { return (__assign(__assign({}, p), { x: p.x + 10, y: p.y + 10 })); });
            movedPointers.forEach(function (p) { return touchPointerManager.pointerMove(p); });
            (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(2);
            // Test pointerUp for both
            movedPointers.forEach(function (p) { return touchPointerManager.pointerUp(p); });
            (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(2);
        });
        (0, vitest_1.it)('should not trigger multiple pointerDown events for the same pointer', function () {
            var pointer = mousePointerManager.parseMousePointer(undefined, target);
            // First pointerDown
            mousePointerManager.pointerDown(pointer);
            (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(1);
            // Second pointerDown (should be ignored)
            mousePointerManager.pointerDown(pointer);
            (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(1); // Still 1
        });
    });
    (0, vitest_1.describe)('nextId', function () {
        (0, vitest_1.it)('should generate sequential IDs starting from 501', function () {
            var id1 = touchPointerManager.nextId();
            var id2 = touchPointerManager.nextId();
            var id3 = touchPointerManager.nextId();
            (0, vitest_1.expect)(id1).toBe(501);
            (0, vitest_1.expect)(id2).toBe(502);
            (0, vitest_1.expect)(id3).toBe(503);
        });
    });
    (0, vitest_1.describe)('Integration between methods', function () {
        (0, vitest_1.it)('should allow a full gesture workflow', function () {
            // Create a pointer
            var pointer = mousePointerManager.parseMousePointer({ x: 20, y: 20 }, target);
            // Down
            mousePointerManager.pointerDown(pointer);
            // Move in several steps
            mousePointerManager.pointerMove(__assign(__assign({}, pointer), { x: 30, y: 20 }));
            mousePointerManager.pointerMove(__assign(__assign({}, pointer), { x: 40, y: 20 }));
            mousePointerManager.pointerMove(__assign(__assign({}, pointer), { x: 50, y: 20 }));
            // Up
            mousePointerManager.pointerUp(__assign(__assign({}, pointer), { x: 50, y: 20 }));
            // Verify all events were called
            (0, vitest_1.expect)(pointerDown).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(3);
            (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(1);
            // Verify the final position
            var upEvent = pointerUp.mock.calls[0][0];
            (0, vitest_1.expect)(upEvent.clientX).toBe(50);
            (0, vitest_1.expect)(upEvent.clientY).toBe(20);
        });
        (0, vitest_1.it)('should handle touch pointer lifecycle correctly', function () {
            // Create touch pointers
            var pointers = touchPointerManager.parsePointers({
                amount: 2,
                distance: 50,
            }, target, {
                amount: 1,
                distance: 0,
            });
            // Down with both pointers
            pointers.forEach(function (p) { return touchPointerManager.pointerDown(p); });
            // Up with the first pointer only
            touchPointerManager.pointerUp(pointers[0]);
            // At this point, only one pointer should be up
            (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(1);
            // Move the remaining pointer
            touchPointerManager.pointerMove(__assign(__assign({}, pointers[1]), { x: pointers[1].x + 10, y: pointers[1].y + 10 }));
            // Should still work
            (0, vitest_1.expect)(pointerMove).toHaveBeenCalledTimes(1);
            // Up with the second pointer
            touchPointerManager.pointerUp(pointers[1]);
            (0, vitest_1.expect)(pointerUp).toHaveBeenCalledTimes(2);
        });
    });
    (0, vitest_1.describe)('Pointer Enter and Leave Events', function () {
        var pointerOver;
        var pointerEnter;
        var pointerOut;
        var pointerLeave;
        var secondTarget;
        (0, vitest_1.beforeEach)(function () {
            // Create a second target for pointer movement between elements
            secondTarget = document.createElement('div');
            secondTarget.style.width = '100px';
            secondTarget.style.height = '100px';
            secondTarget.style.position = 'absolute';
            secondTarget.style.left = '200px';
            document.body.appendChild(secondTarget);
            // Set up event listeners for over/enter/out/leave events
            pointerOver = vitest_1.vi.fn();
            pointerEnter = vitest_1.vi.fn();
            pointerOut = vitest_1.vi.fn();
            pointerLeave = vitest_1.vi.fn();
            target.addEventListener('pointerover', pointerOver);
            target.addEventListener('pointerenter', pointerEnter);
            target.addEventListener('pointerout', pointerOut);
            target.addEventListener('pointerleave', pointerLeave);
            secondTarget.addEventListener('pointerover', pointerOver);
            secondTarget.addEventListener('pointerenter', pointerEnter);
            secondTarget.addEventListener('pointerout', pointerOut);
            secondTarget.addEventListener('pointerleave', pointerLeave);
        });
        (0, vitest_1.afterEach)(function () {
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
        (0, vitest_1.it)('should fire pointerover and pointerenter events when a pointer enters an element', function () {
            // Call the protected pointerEnter method using type casting to access it
            var pointer = mousePointerManager.parseMousePointer({ x: 50, y: 50 }, target);
            mousePointerManager.pointerMove(pointer);
            // Verify events were fired
            (0, vitest_1.expect)(pointerOver).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(pointerEnter).toHaveBeenCalledTimes(1);
            // Verify event properties
            var overEvent = pointerOver.mock.calls[0][0];
            (0, vitest_1.expect)(overEvent.type).toBe('pointerover');
            (0, vitest_1.expect)(overEvent.target).toBe(target);
            var enterEvent = pointerEnter.mock.calls[0][0];
            (0, vitest_1.expect)(enterEvent.type).toBe('pointerenter');
            (0, vitest_1.expect)(enterEvent.target).toBe(target);
        });
        (0, vitest_1.it)('should fire pointerout and pointerleave events when a pointer leaves an element', function () {
            // Call the protected pointerLeave method using type casting to access it
            var pointer = mousePointerManager.parseMousePointer({ x: 50, y: 50 }, target);
            mousePointerManager.pointerMove(pointer);
            var secondPointer = mousePointerManager.parseMousePointer({ x: 50, y: 50 }, secondTarget);
            mousePointerManager.pointerMove(secondPointer);
            // Verify events were fired
            (0, vitest_1.expect)(pointerOut).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(pointerLeave).toHaveBeenCalledTimes(1);
            // Verify event properties
            var outEvent = pointerOut.mock.calls[0][0];
            (0, vitest_1.expect)(outEvent.type).toBe('pointerout');
            (0, vitest_1.expect)(outEvent.target).toBe(target);
            var leaveEvent = pointerLeave.mock.calls[0][0];
            (0, vitest_1.expect)(leaveEvent.type).toBe('pointerleave');
            (0, vitest_1.expect)(leaveEvent.target).toBe(target);
        });
    });
    (0, vitest_1.describe)('Pointer movement between elements', function () {
        var pointerOver;
        var pointerEnter;
        var pointerOut;
        var pointerLeave;
        var secondTarget;
        (0, vitest_1.beforeEach)(function () {
            // Create a second target
            secondTarget = document.createElement('div');
            secondTarget.id = 'secondTarget';
            secondTarget.style.width = '100px';
            secondTarget.style.height = '100px';
            secondTarget.style.position = 'absolute';
            secondTarget.style.left = '200px';
            document.body.appendChild(secondTarget);
            // Set up event listeners
            pointerOver = vitest_1.vi.fn();
            pointerEnter = vitest_1.vi.fn();
            pointerOut = vitest_1.vi.fn();
            pointerLeave = vitest_1.vi.fn();
            target.addEventListener('pointerover', pointerOver);
            target.addEventListener('pointerenter', pointerEnter);
            target.addEventListener('pointerout', pointerOut);
            target.addEventListener('pointerleave', pointerLeave);
            secondTarget.addEventListener('pointerover', pointerOver);
            secondTarget.addEventListener('pointerenter', pointerEnter);
            secondTarget.addEventListener('pointerout', pointerOut);
            secondTarget.addEventListener('pointerleave', pointerLeave);
        });
        (0, vitest_1.afterEach)(function () {
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
        (0, vitest_1.it)('should fire appropriate events when moving pointer between elements', function () {
            // Create pointer on first target
            var pointer = mousePointerManager.parseMousePointer({ x: 50, y: 50 }, target);
            // Simulate pointer down on first target
            mousePointerManager.pointerDown(pointer);
            // Reset mocks before the move
            pointerOver.mockReset();
            pointerEnter.mockReset();
            pointerOut.mockReset();
            pointerLeave.mockReset();
            // Move pointer to second target
            var updatedPointer = __assign(__assign({}, pointer), { x: 250, y: 50, target: secondTarget });
            mousePointerManager.pointerMove(updatedPointer);
            // Verify leave events were fired for first target
            (0, vitest_1.expect)(pointerOut).toHaveBeenCalled();
            (0, vitest_1.expect)(pointerLeave).toHaveBeenCalled();
            // Verify enter events were fired for second target
            (0, vitest_1.expect)(pointerOver).toHaveBeenCalled();
            (0, vitest_1.expect)(pointerEnter).toHaveBeenCalled();
            // Verify target of events
            var outEvent = pointerOut.mock.calls[0][0];
            var leaveEvent = pointerLeave.mock.calls[0][0];
            var overEvent = pointerOver.mock.calls[0][0];
            var enterEvent = pointerEnter.mock.calls[0][0];
            (0, vitest_1.expect)(outEvent.target).toBe(target);
            (0, vitest_1.expect)(leaveEvent.target).toBe(target);
            (0, vitest_1.expect)(overEvent.target).toBe(secondTarget);
            (0, vitest_1.expect)(enterEvent.target).toBe(secondTarget);
        });
        (0, vitest_1.it)('should correctly handle touch pointer movement between elements', function () {
            // Create touch pointer on first target
            var pointer = touchPointerManager.parsePointers({ amount: 1, distance: 0 }, target, {
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
            var updatedPointer = __assign(__assign({}, pointer), { target: secondTarget, x: 250, y: 50 });
            touchPointerManager.pointerMove(updatedPointer);
            // Verify events
            (0, vitest_1.expect)(pointerOut).toHaveBeenCalled();
            (0, vitest_1.expect)(pointerLeave).toHaveBeenCalled();
            (0, vitest_1.expect)(pointerOver).toHaveBeenCalled();
            (0, vitest_1.expect)(pointerEnter).toHaveBeenCalled();
            // Verify pointer type in events
            var enterEvent = pointerEnter.mock.calls[0][0];
            (0, vitest_1.expect)(enterEvent.pointerType).toBe('touch');
        });
    });
    (0, vitest_1.describe)('Reusing pointers', function () {
        (0, vitest_1.it)('should maintain previous x and y values when reusing pointers', function () {
            // Create initial touch pointers
            var initialPointers = touchPointerManager.parsePointers({
                amount: 2,
                distance: 50,
            }, target, {
                amount: 1,
                distance: 0,
            });
            // Remember the original positions
            var originalPositions = initialPointers.map(function (p) { return ({ id: p.id, x: p.x, y: p.y }); });
            // Create new pointers reusing the same IDs but without specifying x/y
            var pointersWithIds = {
                ids: initialPointers.map(function (p) { return p.id; }),
                amount: 2,
                distance: 100, // Different distance to ensure it would generate different positions if not reusing
            };
            var reusedPointers = touchPointerManager.parsePointers(pointersWithIds, target, {
                amount: 1,
                distance: 0,
            });
            // The positions should remain the same as the original pointers
            reusedPointers.forEach(function (pointer, index) {
                (0, vitest_1.expect)(pointer.id).toBe(originalPositions[index].id);
                (0, vitest_1.expect)(pointer.x).toBe(originalPositions[index].x);
                (0, vitest_1.expect)(pointer.y).toBe(originalPositions[index].y);
            });
        });
        (0, vitest_1.it)('should allow overriding specific x/y values when reusing pointers', function () {
            // Create an initial touch pointer
            var initialPointers = touchPointerManager.parsePointers({
                amount: 1,
                distance: 0,
            }, target, {
                amount: 1,
                distance: 0,
            });
            var initialPointer = initialPointers[0];
            // Now reuse the pointer ID but specify a new x position
            var customPointers = [
                {
                    id: initialPointer.id,
                    x: 75, // New x position
                    // y not specified - should keep original value
                },
            ];
            var reusedPointers = touchPointerManager.parsePointers(customPointers, target, {
                amount: 1,
                distance: 0,
            });
            var reusedPointer = reusedPointers[0];
            // Verify that x was updated but y remained the same
            (0, vitest_1.expect)(reusedPointer.id).toBe(initialPointer.id);
            (0, vitest_1.expect)(reusedPointer.x).toBe(75);
            (0, vitest_1.expect)(reusedPointer.y).toBe(initialPointer.y);
        });
        (0, vitest_1.it)('should reuse pointer positions for mouse pointers too', function () {
            // Create initial mouse pointer
            var initialPointer = mousePointerManager.parseMousePointer({ x: 25, y: 75 }, target);
            // We got to update the pointer first to simulate a real scenario
            Reflect.get(mousePointerManager, 'updatePointers').bind(mousePointerManager)(initialPointer);
            // Reuse the pointer but without specifying coordinates
            var reusedPointer = mousePointerManager.parseMousePointer({
            // x and y not specified
            }, target);
            // The position should be the same as the original
            (0, vitest_1.expect)(reusedPointer.x).toBe(initialPointer.x);
            (0, vitest_1.expect)(reusedPointer.y).toBe(initialPointer.y);
        });
    });
});
