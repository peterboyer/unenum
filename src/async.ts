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
