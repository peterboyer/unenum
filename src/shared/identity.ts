// https://stackoverflow.com/a/49683575
export type Identity<T> = T extends object ? { [K in keyof T]: T[K] } : never;
