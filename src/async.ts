import type { Enum } from "./enum.js";

export type Async<T = never> = [T] extends [never]
	? AsyncValue<T>
	: [T] extends [Enum.Any]
		? AsyncEnum<T>
		: AsyncValue<T>;

type AsyncValue<T> = Async.Pending<T> | Async.Ready<T>;
type AsyncEnum<TEnum> = Async.Pending | TEnum;

import * as $PendingReady from "./async/pending-ready.js";

export namespace Async {
	export const Pending = $PendingReady.Pending;
	export const Ready = $PendingReady.Ready;

	export type Pending<TValue = never> = Enum<{
		Pending: [TValue] extends [never] ? true : { value?: never };
	}>;
	export type Ready<TValue = never> = Enum<{
		Ready: [TValue] extends [never] ? true : { value: TValue };
	}>;
}
