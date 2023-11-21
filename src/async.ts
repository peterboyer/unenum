import type { Enum, EnumAny } from "./enum";

export type Async<TValue = never> = Enum<{
	Pending: true;
	Ready: [TValue] extends [never] ? true : { value: TValue };
}>;

export namespace Async {
	export type Enum<TEnum extends EnumAny> = Enum.Extend<
		TEnum,
		{ Pending: true }
	>;
}
