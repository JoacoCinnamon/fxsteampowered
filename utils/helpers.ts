export type Result<T, E = Error> = [null, T] | [E, null];
export const to = async <T>(promise: Promise<T>) => {
  try {
    const data = await promise;
    return [null, data] as Result<T>;
  } catch (err) {
    return [err as Error, null] as Result<T>;
  }
};
export const Ok = <T>(data: T) => [null, data] as Result<T>;
export const Err = <E = Error>(error: E) => [error, null] as Result<never, E>;
