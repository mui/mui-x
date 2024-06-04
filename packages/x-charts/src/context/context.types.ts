export type Initializable<T> = {
  isInitialized: boolean;
} & T;
