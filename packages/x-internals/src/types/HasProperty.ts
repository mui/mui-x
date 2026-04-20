export type HasProperty<T, K extends string> = K extends keyof T ? true : false;
