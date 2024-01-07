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

function Ok<T = Result.Ok>(...args: OkArgs<T>): OkReturnType<T> {
	return { _type: "Ok", value: args[0] } as any;
}

type OkArgs<T> = [Extract<T, { _type: "Ok" }>] extends [never]
	? []
	: Extract<T, { _type: "Ok" }> extends { value: infer U }
		? [value: U]
		: [];

type OkReturnType<T> = NeverFallback<Extract<T, { _type: "Ok" }>, Result.Ok>;

function Error<T = Result.Error>(...args: ErrorArgs<T>): ErrorReturnType<T> {
	return { _type: "Error", error: args[0] } as any;
}

type ErrorArgs<T> = [Extract<T, { _type: "Error" }>] extends [never]
	? []
	: Extract<T, { _type: "Error" }> extends { error: infer U }
		? [error: U]
		: [];

type ErrorReturnType<T> = NeverFallback<
	Extract<T, { _type: "Error" }>,
	Result.Error
>;

type NeverFallback<T, TFallback> = [T] extends [never] ? TFallback : T;
