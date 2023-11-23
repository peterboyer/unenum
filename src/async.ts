import type { Enum } from "./enum";

export type Async<TValue = never> = Enum<{
	Pending: true;
	Ready: [TValue] extends [never] ? true : { value: TValue };
}>;

export namespace Async {
	export type Enum<TEnum extends Enum.Any> = Enum.Extend<
		TEnum,
		{ Pending: true }
	>;
}
