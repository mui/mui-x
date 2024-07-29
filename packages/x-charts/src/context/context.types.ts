export type Initializable<T> = {
  isInitialized: boolean;
  data: T;
};
