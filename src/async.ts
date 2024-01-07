/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Enum } from "./enum.js";

export type Async<T = never> = [T] extends [never]
	? AsyncValue<T>
	: [T] extends [Enum.Any]
		? AsyncEnum<T>
		: AsyncValue<T>;

type AsyncValue<T> = Async.Pending<T> | Async.Ready<T>;
type AsyncEnum<TEnum> = Async.Pending | TEnum;

export namespace Async {
	export type Pending<TValue = never> = Enum<{
		Pending: [TValue] extends [never] ? true : { value?: never };
	}>;
	export type Ready<TValue = never> = Enum<{
		Ready: [TValue] extends [never] ? true : { value: TValue };
	}>;
}

export const Async = {
	Pending,
	Ready,
};

function Pending<T = Async.Pending>(): PendingReturnType<T> {
	return { _type: "Pending" } as any;
}

type PendingReturnType<T> = NeverFallback<
	Extract<T, { _type: "Pending" }>,
	Async.Pending
>;

function Ready<T = Async.Ready>(...args: ReadyArgs<T>): ReadyReturnType<T> {
	return { _type: "Ready", value: args[0] } as any;
}

type ReadyArgs<T> = [Extract<T, { _type: "Ready" }>] extends [never]
	? []
	: Extract<T, { _type: "Ready" }> extends { value: infer U }
		? [value: U]
		: [];

type ReadyReturnType<T> = NeverFallback<
	Extract<T, { _type: "Ready" }>,
	Async.Ready
>;

type NeverFallback<T, TFallback> = [T] extends [never] ? TFallback : T;
