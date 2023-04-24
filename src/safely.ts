import type { Result } from "./result";

/**
Executes a given function and returns a `Result` that wraps its normal return
value as `Ok` and any thrown errors as `Error`. Supports async/`Promise`
returns.

```ts
import { safely } from "unenum"; // runtime

safely(() => JSON.stringify(...))
-> Result<string>

safely(() => JSON.parse(...))
-> Result<unknown>

safely(() => fetch("/endpoint").then(res => res.json() as Data))
-> Promise<Result<Data>>
```
 */
export function safely<T>(fn: () => T): Safe<[T]> {
	try {
		const value = fn();
		if (value && value instanceof Promise) {
			const result = value
				.then((value: unknown): Result => ({ is: "Ok", value }))
				.catch((error: unknown): Result => ({ is: "Error", error }));
			return result as Safe<[T]>;
		}
		const result: Result = { is: "Ok", value };
		return result as Safe<[T]>;
	} catch (error) {
		const result: Result = { is: "Error", error };
		return result as Safe<[T]>;
	}
}

// prettier-ignore
type Safe<T extends [unknown]> =
	[T] extends [[never]] // handle never
		? Result<never>
	: 0 extends 1 & T[0] // handle any
		? Result<unknown>
	: T extends [Promise<unknown>] // handle promise
		? Promise<Result<Awaited<T[0]>>>
	: Result<T[0]>; // default
