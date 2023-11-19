/* eslint-disable @typescript-eslint/no-explicit-any */

import type { DiscriminantAny, DiscriminantDefault } from "./enum";
import type { Infer } from "./infer";

export const match = <
	TEnum extends Record<TDiscriminant, DiscriminantAny>,
	TMatcher extends {
		[Key in keyof Infer<TEnum>]?: (value: Infer<TEnum>[Key]) => unknown;
	},
	TDefault extends (() => any) | (() => never) = () => never,
	TDiscriminant extends DiscriminantAny = DiscriminantDefault
>(
	value: TEnum | [TEnum, TDiscriminant],
	matcher: (IsNever<ReturnType<TDefault>> extends true
		? Required<TMatcher>
		: Partial<TMatcher>) & {
		_?: TDefault;
	}
) => {
	const [valueEnum, valueDiscriminant] = Array.isArray(value)
		? value
		: [value, "_type" as TDiscriminant];

	const key = valueEnum[valueDiscriminant];
	const keyMatchFn =
		matcher[key as unknown as keyof TMatcher & string] ??
		matcher["_" as keyof TMatcher & string];
	if (!keyMatchFn) {
		throw TypeError(`unhandled enum variant: ${JSON.stringify(value)}`);
	}
	return keyMatchFn(valueEnum as any) as
		| {
				[Key in keyof TMatcher]: TMatcher[Key] extends (...args: any[]) => any
					? ReturnType<TMatcher[Key]>
					: never;
		  }[keyof TMatcher]
		| (TDefault extends (...args: any[]) => any ? ReturnType<TDefault> : never);
};

type IsNever<T> = [T] extends [never] ? true : false;
