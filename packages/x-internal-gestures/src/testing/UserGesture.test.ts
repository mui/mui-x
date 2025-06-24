import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PointerManager } from './PointerManager';
import { UserGesture } from './UserGesture';
import { UserGesturePlugin } from './types/UserGesturePlugin';

describe('UserGesture - Plugin System', () => {
  let userGesture: UserGesture;
  // Mock plugins for testing
  let mockGestureFunction: Mock;
  let mockPlugin: UserGesturePlugin;
  let target: Element;

  beforeEach(() => {
    userGesture = new UserGesture('mouse');
    mockGestureFunction = vi.fn().mockResolvedValue(undefined);
    mockPlugin = {
      name: 'customGesture',
      gesture: mockGestureFunction,
    };
    // We need to reset DOM between tests
    document.body.innerHTML = '';
    target = document.createElement('div');
    document.body.appendChild(target);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register plugins during setup', () => {
    // Register a plugin
    userGesture.setup({
      plugins: [mockPlugin],
    });

    // Check if the plugin was registered correctly
    // @ts-expect-error, accessing dynamic property
    expect(typeof userGesture.customGesture).toBe('function');
  });

  it('should throw an error when registering a plugin with a name that already exists', () => {
    // First registration should succeed
    userGesture.setup({
      plugins: [mockPlugin],
    });

    // Second registration with the same name should fail
    const duplicatePlugin: UserGesturePlugin = {
      name: 'customGesture',
      gesture: vi.fn(),
    };

    expect(() => {
      userGesture.setup({
        plugins: [duplicatePlugin],
      });
    }).toThrow('Plugin with name "customGesture" already exists. Please use a unique name.');
  });

  it('should call the plugin gesture function with correct parameters when invoked', async () => {
    // Register the plugin
    userGesture.setup({
      plugins: [mockPlugin],
    });

    // Create test options
    const testOptions = {
      target,
      customOption: 'test-value',
    };

    // Invoke the plugin
    // @ts-expect-error, accessing dynamic property
    await userGesture.customGesture(testOptions);

    // Verify the gesture function was called correctly
    expect(mockGestureFunction).toHaveBeenCalledTimes(1);
    expect(mockGestureFunction).toHaveBeenCalledWith(
      expect.any(PointerManager),
      testOptions,
      undefined, // advanceTimers is undefined by default
    );
  });

  it('should pass the advanceTimers function to the plugin gesture when provided', async () => {
    // Mock advance timers function
    const mockAdvanceTimers = vi.fn().mockImplementation(() => Promise.resolve());

    // Register the plugin with advanceTimers
    userGesture.setup({
      advanceTimers: mockAdvanceTimers,
      plugins: [mockPlugin],
    });

    // Invoke the plugin
    // @ts-expect-error, accessing dynamic property
    await userGesture.customGesture({});

    // Verify advanceTimers was passed to the plugin
    expect(mockGestureFunction).toHaveBeenCalledWith(
      expect.any(PointerManager),
      expect.anything(),
      mockAdvanceTimers,
    );
  });

  it('should register multiple plugins at once', () => {
    // Create several mock plugins
    const mockPlugins: UserGesturePlugin[] = [
      {
        name: 'gestureOne',
        gesture: vi.fn().mockResolvedValue(undefined),
      },
      {
        name: 'gestureTwo',
        gesture: vi.fn().mockResolvedValue(undefined),
      },
      {
        name: 'gestureThree',
        gesture: vi.fn().mockResolvedValue(undefined),
      },
    ];

    // Register all plugins
    userGesture.setup({
      plugins: mockPlugins,
    });

    // Check all plugins were registered
    // @ts-expect-error, accessing dynamic property
    expect(typeof userGesture.gestureOne).toBe('function');
    // @ts-expect-error, accessing dynamic property
    expect(typeof userGesture.gestureTwo).toBe('function');
    // @ts-expect-error, accessing dynamic property
    expect(typeof userGesture.gestureThree).toBe('function');
  });

  it('should create a working plugin that can trigger DOM events', async () => {
    // Create a real plugin that triggers DOM events
    const realPlugin: UserGesturePlugin = {
      name: 'testTap',
      gesture: async (pointerManager, options: { target: Element }, advanceTimers) => {
        const pluginTarget = options.target;
        if (!pluginTarget) {
          throw new Error('Target element is required');
        }

        // Create a tap event handler to verify the tap works
        const tapHandler = vi.fn();
        pluginTarget.addEventListener('pointerdown', tapHandler);

        // Get the center of the target for the tap
        const rect = pluginTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Perform a tap
        pointerManager.pointerDown({ id: 1, target: pluginTarget, x, y });

        // Small delay
        if (advanceTimers) {
          await advanceTimers(10);
        } else {
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
        }

        pointerManager.pointerUp({ id: 1, target: pluginTarget, x, y });
      },
    };

    // Register the plugin
    userGesture.setup({
      plugins: [realPlugin],
    });

    const pointerDownHandler = vi.fn();
    const pointerUpHandler = vi.fn();

    target.addEventListener('pointerdown', pointerDownHandler);
    target.addEventListener('pointerup', pointerUpHandler);

    // @ts-expect-error, accessing dynamic property
    await userGesture.testTap({ target });

    // Verify the events were triggered
    expect(pointerDownHandler).toHaveBeenCalledTimes(1);
    expect(pointerUpHandler).toHaveBeenCalledTimes(1);
  });

  it('should allow plugins to be registered incrementally', () => {
    // First plugin
    const firstPlugin: UserGesturePlugin = {
      name: 'firstGesture',
      gesture: vi.fn().mockResolvedValue(undefined),
    };

    userGesture.setup({
      plugins: [firstPlugin],
    });

    // @ts-expect-error, accessing dynamic property
    expect(typeof userGesture.firstGesture).toBe('function');

    // Add second plugin later
    const secondPlugin: UserGesturePlugin = {
      name: 'secondGesture',
      gesture: vi.fn().mockResolvedValue(undefined),
    };

    userGesture.setup({
      plugins: [secondPlugin],
    });

    // Both plugins should be available
    // @ts-expect-error, accessing dynamic property
    expect(typeof userGesture.firstGesture).toBe('function');
    // @ts-expect-error, accessing dynamic property
    expect(typeof userGesture.secondGesture).toBe('function');
  });

  it('should preserve advanceTimers when adding plugins incrementally', async () => {
    // Mock advance timers function
    const mockAdvanceTimers = vi.fn().mockImplementation(() => Promise.resolve());

    // Set up with advanceTimers but no plugins initially
    userGesture.setup({
      advanceTimers: mockAdvanceTimers,
    });

    // Add a plugin later
    userGesture.setup({
      plugins: [mockPlugin],
    });

    // Invoke the plugin
    // @ts-expect-error, accessing dynamic property
    await userGesture.customGesture({});

    // Verify advanceTimers was still passed to the plugin
    expect(mockGestureFunction).toHaveBeenCalledWith(
      expect.any(PointerManager),
      expect.anything(),
      mockAdvanceTimers,
    );
  });
});
