import type { Enum as _Enum } from "./enum";

export type Async<TValue = never> = _Enum<{
	Pending: true;
	Ready: [TValue] extends [never] ? true : { value: TValue };
}>;

export namespace Async {
	export type Enum<TEnum> = _Enum.Extend<TEnum, { Pending: true }>;
}
