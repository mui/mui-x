import { Gesture } from '../../core';
import { MockState } from './MockState';

export class MockGoodGesture extends Gesture<string> {
  // Define state for the gesture
  protected state: MockState = {
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    currentDistance: 0,
    customValue: '',
  };

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: never;

  protected readonly optionsType!: never;

  protected readonly mutableOptionsType!: {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    preventIf?: string[];
    complexOption?: { nestedValue: number; enabled: boolean };
    arrayOption?: string[];
  };

  protected readonly mutableStateType!: MockState;

  protected resetState(): void {
    this.state = {
      isDragging: false,
      startPosition: { x: 0, y: 0 },
      currentDistance: 0,
      customValue: '',
    };
  }

  // Extra property for coverage
  public extra = () => {};

  // Add custom properties for testing complex options
  public complexOption?: { nestedValue: number; enabled: boolean };

  public arrayOption?: string[];

  public clone(overrides?: Record<string, unknown>): MockGoodGesture {
    return new MockGoodGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
      preventIf: this.preventIf,
      ...overrides,
    });
  }

  // Override the updateOptions method to handle our custom properties
  protected updateOptions(options: typeof this.mutableOptionsType): void {
    super.updateOptions(options);
    this.complexOption = options.complexOption ?? this.complexOption;
    this.arrayOption = options.arrayOption ?? this.arrayOption;
  }
}
