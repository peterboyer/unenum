/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Enum } from "./enum.js";

export type Result<TValue = never, TError = never> =
	| Result.Ok<TValue>
	| Result.Error<TError>;

export namespace Result {
	export type Ok<TValue = never> = Enum<{
		Ok: [TValue] extends [never]
			? { value?: never; error?: never }
			: { value: TValue; error?: never };
	}>;
	export type Error<TError = never> = Enum<{
		Error: [TError] extends [never]
			? { value?: never; error?: never }
			: { value?: never; error: TError };
	}>;
}

import { try as _try } from "./result/try.js";

export const Result = {
	Ok,
	Error,
	try: _try,
};

function Ok<T = Result.Ok>(
	...args: Extract<T, { _type: "Ok" }> extends { value: infer U } ? [U] : []
): NeverFallback<Extract<T, { _type: "Ok" }>, Result.Ok> {
	return { _type: "Ok", value: args[0] } as any;
}

function Error<T = Result.Error>(
	...args: Extract<T, { _type: "Error" }> extends { error: infer U } ? [U] : []
): Extract<T, { _type: "Error" }> {
	return { _type: "Error", error: args[0] } as any;
}

type NeverFallback<T, TFallback> = [T] extends [never] ? TFallback : T;
