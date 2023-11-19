import type { Result } from "../result";

export const from = <TReturnType>(
	fn: () => TReturnType
): Safely<TReturnType> => {
	type Return = Safely<TReturnType>;

	try {
		const value = fn();
		if (value instanceof Promise) {
			return value
				.then((value) => ({ _type: "Ok", value }))
				.catch((error) => ({ _type: "Error", error })) as Return;
		}
		return { _type: "Ok", value } as unknown as Return;
	} catch (error) {
		return { _type: "Error", error } as unknown as Return;
	}
};

type Safely<TReturnType> = [TReturnType] extends [never]
	? Result // when never
	: 0 extends 1 & TReturnType
	? Result<unknown, unknown> // when any
	: [TReturnType] extends [Promise<unknown>]
	? Promise<Result<Awaited<TReturnType>, unknown>> // when promise
	: Result<TReturnType, unknown>;
