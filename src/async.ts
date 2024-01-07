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
	export type Ready<TValue = never> = Enum<{
		Ready: [TValue] extends [never] ? true : { value: TValue };
	}>;
	export type Pending<TValue = never> = Enum<{
		Pending: [TValue] extends [never] ? true : { value?: never };
	}>;
}

export const Async = {
	Ready,
	Pending,
};

function Ready<T = Async.Ready>(
	...args: Extract<T, { _type: "Ready" }> extends { value: infer U } ? [U] : []
): Extract<T, { _type: "Ready" }> {
	return { _type: "Ready", value: args[0] } as any;
}

function Pending<T = Async.Pending>(): Extract<T, { _type: "Pending" }> {
	return { _type: "Pending" } as any;
}
