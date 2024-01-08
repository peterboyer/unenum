/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Enum } from "./enum.js";

export type Result<TValue = never, TError = never> =
	| Result.Ok<TValue>
	| Result.Error<TError>;

import * as $OkError from "./result/ok-error.js";
import * as $from from "./result/from.js";

export namespace Result {
	export const Ok = $OkError.Ok;
	export const Error = $OkError.Error;
	export const from = $from.from;

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
