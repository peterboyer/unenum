import type { Async } from "./async.js";

export function Pending<T = Async.Pending>(): PendingReturnType<T> {
	return { _type: "Pending" } as any;
}

type PendingReturnType<T> = NeverFallback<
	Extract<T, { _type: "Pending" }>,
	Async.Pending
>;

export function Ready<T = Async.Ready>(
	...args: ReadyArgs<T>
): ReadyReturnType<T> {
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
