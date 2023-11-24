import type { Enum } from "./enum";

export type Async<TValue = never> = Enum<{
	Pending: [TValue] extends [never] ? true : { value?: never };
	Ready: [TValue] extends [never] ? true : { value: TValue };
}>;

export namespace Async {
	export type Enum<TEnum extends Enum.Any> = Enum.Extend<
		TEnum,
		{ Pending: true }
	>;
}

export const AsyncPending = <TAsync>(): [
	Extract<TAsync, { _type: "Pending" }>
] extends [never]
	? { _type: "Pending" }
	: TAsync => ({ _type: "Pending" } as any);

export const AsyncReady = <TAsync>(
	...args: TAsync extends { error: unknown } ? [TAsync["error"]] : never
): [Extract<TAsync, { _type: "Ready" }>] extends [never]
	? { _type: "Ready" }
	: TAsync => ({ _type: "Ready", value: args[0] } as any);
