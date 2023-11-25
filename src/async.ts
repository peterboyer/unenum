/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Enum } from "./enum";

export type Async<
	T = never,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = [T] extends [never]
	? Enum<{ Pending: true; Ready: true }>
	: [T] extends [Enum.Any<TDiscriminant>]
	? Enum.Extend<T, { Pending: true }, TDiscriminant>
	: Enum<{
			Pending: [T] extends [never] ? true : { value?: never };
			Ready: [T] extends [never] ? true : { value: T };
	  }>;

export const Async = {
	Pending: <TAsync>(): [Extract<TAsync, { _type: "Pending" }>] extends [never]
		? { _type: "Pending" }
		: TAsync => ({ _type: "Pending" } as any),
	Ready: <TAsync>(
		...args: TAsync extends { value: unknown }
			? [value: TAsync["value"]]
			: never
	): [Extract<TAsync, { _type: "Ready" }>] extends [never]
		? { _type: "Ready" }
		: TAsync => ({ _type: "Ready", value: args[0] } as any),
};
