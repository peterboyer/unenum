import type { Enum } from "./enum";

export type Result<TValue = never, TError = never> = Enum<{
	Ok: [TValue] extends [never]
		? { value?: never; error?: never }
		: { value: TValue; error?: never };
	Error: [TError] extends [never]
		? { value?: never; error?: never }
		: { value?: never; error: TError };
}>;

import { try as _try } from "./result/try";

export const Result = {
	try: _try,
};
