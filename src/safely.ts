import type { Result } from "./result";

type Safe<T> = [T] extends [never]
	? Result<never>
	: 0 extends 1 & T
	? Result // if T is any, use unknown
	: T extends Promise<unknown>
	? Promise<Result<Awaited<T>>>
	: Result<Awaited<T>>;

/**
 * Executes a given function and wraps value in a `Result`:
 *
 * - `Ok`, with the function's inferred `return` value,
 * - `Err`, with `unknown` of any potentially `thrown` errors.
 * - Automatically wraps `Result` with `Promise<...>` if given function is
 *   async/returns a `Promise`.
 */
export function safely<T>(fn: () => T): Safe<T> {
	try {
		const value = fn();
		if (value && value instanceof Promise) {
			const result = value
				.then((value: unknown): Result => ({ is: "Ok", value }))
				.catch((error: unknown): Result => ({ is: "Err", error }));
			return result as Safe<T>;
		}
		const result: Result = { is: "Ok", value };
		return result as Safe<T>;
	} catch (error) {
		const result: Result = { is: "Err", error };
		return result as Safe<T>;
	}
}
