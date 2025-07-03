/**
 * KeyboardManager - Centralized manager for keyboard events in the gesture recognition system
 *
 * This singleton class tracks keyboard state across the application:
 * 1. Capturing and tracking all pressed keys
 * 2. Providing methods to check if specific keys are pressed
 *
 * This is a singleton class since it is designed to manage global keyboard state, and has no need for multiple instances.
 */

/**
 * Type definition for keyboard keys
 */
export type KeyboardKey = string;

/**
 * Class responsible for tracking keyboard state across the application
 */
export class KeyboardManager {
  private static instance: KeyboardManager;

  private pressedKeys: Set<KeyboardKey> = new Set();

  private keyboardListenersAdded = false;

  /**
   * Create a new KeyboardManager instance or return the existing one
   */
  private constructor() {
    this.initialize();
  }

  /**
   * Get the singleton instance of KeyboardManager
   */
  public static getInstance(): KeyboardManager {
    if (!KeyboardManager.instance) {
      KeyboardManager.instance = new KeyboardManager();
    }
    return KeyboardManager.instance;
  }

  /**
   * Initialize the keyboard event listeners
   */
  private initialize(): void {
    if (typeof window === 'undefined' || this.keyboardListenersAdded) {
      return;
    }

    // Add keyboard event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    // Reset keys when window loses focus
    window.addEventListener('blur', this.clearKeys);

    this.keyboardListenersAdded = true;
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    this.pressedKeys.add(event.key);
  };

  /**
   * Handle keyup events
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    this.pressedKeys.delete(event.key);
  };

  /**
   * Clear all pressed keys
   */
  private clearKeys = (): void => {
    this.pressedKeys.clear();
  };

  /**
   * Check if a set of keys are all currently pressed
   * @param keys The keys to check
   * @returns True if all specified keys are pressed, false otherwise
   */
  public areKeysPressed(keys?: KeyboardKey[]): boolean {
    if (!keys || keys.length === 0) {
      return true; // No keys required means the condition is satisfied
    }

    return keys.every((key) => this.pressedKeys.has(key));
  }

  /**
   * Cleanup method to remove event listeners
   */
  public destroy(): void {
    if (typeof window !== 'undefined' && this.keyboardListenersAdded) {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      window.removeEventListener('blur', this.clearKeys);
      this.keyboardListenersAdded = false;
    }
    this.clearKeys();
  }
}
