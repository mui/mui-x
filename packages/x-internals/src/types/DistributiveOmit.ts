export type DistributiveOmit<T, K extends keyof T> = T extends any ? Omit<T, K> : never;
