export interface ResponseAPI<T = undefined, E = undefined> {
  transaction: string;
  message: string;
  data?: T;
  args?: E;
}
