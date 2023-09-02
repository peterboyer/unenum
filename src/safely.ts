import type { EnumDiscriminant } from "./enum";
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
export const safely =
	<TDiscriminant extends EnumDiscriminant>(discriminant: TDiscriminant) =>
	<T>(fn: () => T): Safely<TDiscriminant, T> => {
		type Return = Safely<TDiscriminant, T>;

		try {
			const value = fn();
			if (value instanceof Promise) {
				return value
					.then((value) => ({ [discriminant]: "Ok", value }))
					.catch((error) => ({ [discriminant]: "Error", error })) as Return;
			}
			return { [discriminant]: "Ok", value } as Return;
		} catch (error) {
			return { [discriminant]: "Error", error } as Return;
		}
	};

// prettier-ignore
type Safely<TDiscriminant extends EnumDiscriminant, T> =
	// handle never
	[T] extends [never]
		? Result<TDiscriminant>
 	// handle any
	: 0 extends 1 & T
		? Result<TDiscriminant, unknown, unknown>
 	// handle promise
	: [T] extends [Promise<unknown>]
		? Promise<Result<TDiscriminant, Awaited<T>, unknown>>
 	// default
	: Result<TDiscriminant, T, unknown>;
