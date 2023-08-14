import type { Result } from "./result";

/**
Executes a given function and returns a `Result` that wraps its normal return
value as `Ok` and any thrown errors as `Error`. Supports async/`Promise`
returns.

```ts
import { safely } from "unenum"; // runtime

safely(() => JSON.stringify(...))
-> Result<string, unknown>

safely(() => JSON.parse(...))
-> Result<unknown, unknown>

safely(() => fetch("/endpoint").then(res => res.json() as Data))
-> Promise<Result<Data, unknown>>
```
 */
export function safely<T>(fn: () => T): Safe<T> {
	type ResultAny = Result<unknown, unknown>;
	try {
		const value = fn();
		if (value && value instanceof Promise) {
			const result = value
				.then((value: unknown): ResultAny => ({ is: "Ok", value }))
				.catch((error: unknown): ResultAny => ({ is: "Error", error }));
			return result as Safe<T>;
		}
		const result: ResultAny = { is: "Ok", value };
		return result as Safe<T>;
	} catch (error) {
		const result: ResultAny = { is: "Error", error };
		return result as Safe<T>;
	}
}

// prettier-ignore
type Safe<T> =
	// handle never
	[T] extends [never]
		? Result
 	// handle any
	: 0 extends 1 & T
		? Result<unknown, unknown>
 	// handle promise
	: [T] extends [Promise<unknown>]
		? Promise<Result<Awaited<T>, unknown>>
 	// default
	: Result<T, unknown>;
