import type { Result } from "../result";

type Safe<T> = T extends Promise<unknown>
	? Promise<Result<Awaited<T>>>
	: Result<Awaited<T>>;

export function safely<T>(fn: () => T): Safe<T> {
	try {
		const value = fn();
		if (value && value instanceof Promise) {
			const result = value
				.then((value: unknown): Result => ({ Ok: true, value }))
				.catch((error: unknown): Result => ({ Err: true, error }));
			return result as Safe<T>;
		}
		const result: Result = { Ok: true, value };
		return result as Safe<T>;
	} catch (error) {
		const result: Result = { Err: true, error };
		return result as Safe<T>;
	}
}
