import type { Enum } from "./enum";

export type Result<TValue = never, TError = never> = Enum<{
	Ok: [TValue] extends [never]
		? { value?: never; error?: never }
		: { value: TValue; error?: never };
	Error: [TError] extends [never]
		? { value?: never; error?: never }
		: { value?: never; error: TError };
}>;

import { from } from "./result/from";

export const Result = {
	from,
};
