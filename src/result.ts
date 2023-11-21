/* eslint-disable @typescript-eslint/no-explicit-any */

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
	Ok: <TResult>(
		...args: TResult extends { value: unknown } ? [TResult["value"]] : never
	): [Extract<TResult, { _type: "Ok" }>] extends [never]
		? { _type: "Ok" }
		: TResult => ({ _type: "Ok", value: args[0] } as any),
	Error: <TResult>(
		...args: TResult extends { error: unknown } ? [TResult["error"]] : never
	): [Extract<TResult, { _type: "Error" }>] extends [never]
		? { _type: "Error" }
		: TResult => ({ _type: "Error", value: args[0] } as any),
};
