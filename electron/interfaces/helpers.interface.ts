//* Function type helpers


// Return type of a function
export type FuncReturnTypes<T> = {
  [K in keyof T]: () => T[K];
};
