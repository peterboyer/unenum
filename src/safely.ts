import type { Result } from "./result";

/**
Executes a given function and returns a `Result` that wraps its normal
return value as `Ok` and any thrown errors as `Err`. Supports async/`Promise`
returns automatically.

```ts
safely(() => JSON.stringify(...))
-> Result<string>

safely(() => JSON.parse(...))
-> Result<unknown>

safely(() => fetch("/endpoint").then(res => res.json() as Data))
-> Promise<Result<Data>>
```
 */
export function safely<T>(fn: () => T): Safe<Box<T>> {
	try {
		const value = fn();
		if (value && value instanceof Promise) {
			const result = value
				.then((value: unknown): Result => ({ is: "Ok", value }))
				.catch((error: unknown): Result => ({ is: "Err", error }));
			return result as Safe<Box<T>>;
		}
		const result: Result = { is: "Ok", value };
		return result as Safe<Box<T>>;
	} catch (error) {
		const result: Result = { is: "Err", error };
		return result as Safe<Box<T>>;
	}
}

/**
 * Infers a wrapped `Result` from the given T.
 *
 * Box prevents Safe from processing T as a distributive conditional type.
 *
 * Before:
 * @example
 * ```
 * Safe<string | undefined>
 * -> Result<string> | Result<undefined>
 * ```
 *
 * After:
 * @example
 * ```
 * Safe<Box<string | undefined>>
 * -> Result<string | undefined>
 * ```
 */
// prettier-ignore
type Safe<T extends Box<unknown>> =
	[T] extends [Box<never>] // handle never
		? Result<never>
	: 0 extends 1 & T[0] // handle any
		? Result<unknown>
	: T extends Box<Promise<unknown>> // handle promise
		? Promise<Result<Awaited<T[0]>>>
	: Result<T[0]>; // default

type Box<T> = [T];
