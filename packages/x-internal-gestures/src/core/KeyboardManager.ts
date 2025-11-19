/**
 * KeyboardManager - Manager for keyboard events in the gesture recognition system
 *
 * This class tracks keyboard state:
 * 1. Capturing and tracking all pressed keys
 * 2. Providing methods to check if specific keys are pressed
 */

/**
 * Type definition for keyboard keys
 */
export type KeyboardKey = AllKeys | (string & {});

type AllNumbers = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type AllLetters =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';
type AllMeta = 'Shift' | 'Control' | 'Alt' | 'Meta' | 'ControlOrMeta';
type AllKeys = AllMeta | AllLetters | AllNumbers;

/**
 * Class responsible for tracking keyboard state
 */
export class KeyboardManager {
  private pressedKeys: Set<KeyboardKey> = new Set();

  /**
   * Create a new KeyboardManager instance
   */
  constructor() {
    this.initialize();
  }

  /**
   * Initialize the keyboard event listeners
   */
  private initialize(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Add keyboard event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    // Reset keys when window loses focus
    window.addEventListener('blur', this.clearKeys);
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

    return keys.every((key) => {
      if (key === 'ControlOrMeta') {
        // May be "deprecated" on types, but it is still the best option for cross-platform detection
        // https://stackoverflow.com/a/71785253/24269134
        return navigator.platform.includes('Mac')
          ? this.pressedKeys.has('Meta')
          : this.pressedKeys.has('Control');
      }
      return this.pressedKeys.has(key);
    });
  }

  /**
   * Cleanup method to remove event listeners
   */
  public destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      window.removeEventListener('blur', this.clearKeys);
    }
    this.clearKeys();
  }
}
