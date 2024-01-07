/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Enum } from "./enum.js";

export const match = <
	TEnum extends Enum.Any<TDiscriminant>,
	TEnumMatcher extends
		| {
				[Key in keyof Enum.Root<TEnum, TDiscriminant>]: Enum.Root<
					TEnum,
					TDiscriminant
				>[Key] extends true
					? () => unknown
					: (value: Enum.Root<TEnum, TDiscriminant>[Key]) => unknown;
		  }
		| {
				[Key in keyof Enum.Root<TEnum, TDiscriminant>]: unknown;
		  },
	TMatcher extends [TFallback] extends [never]
		? TEnumMatcher
		: Partial<TEnumMatcher>,
	TFallback = never,
	TDiscriminant extends keyof TEnum & string = keyof TEnum &
		Enum.Discriminant.Default,
>(
	value: TEnum,
	matcher: TMatcher & { _?: TFallback },
	discriminant?: TDiscriminant,
): {
	_:
		| (undefined extends TMatcher[Exclude<keyof TMatcher, "_">]
				? never
				: {
						[Key in keyof TMatcher]: TMatcher[Key] extends (
							...args: any[]
						) => any
							? ReturnType<TMatcher[Key]>
							: TMatcher[Key];
					}[keyof TMatcher])
		| (TFallback extends (...args: any[]) => any
				? ReturnType<TFallback>
				: TFallback);
	// debug
	$: {
		matcher: TMatcher;
		fallback: TFallback;
		discriminant: TDiscriminant;
		keyofTEnum: keyof TEnum;
		keyofTEnumMatcher: keyof TEnumMatcher;
		keyofTMatcher: keyof TMatcher;
	};
}["_"] => {
	const key = value[discriminant ?? ("_type" as TDiscriminant)];
	const keyMatch =
		matcher[key as unknown as keyof TMatcher & string] ??
		matcher["_" as keyof TMatcher & string];
	if (!keyMatch) {
		throw TypeError(`unhandled enum variant: ${JSON.stringify(value)}`);
	}
	if (typeof keyMatch === "function") {
		return keyMatch(value as any) as any;
	}
	return keyMatch as any;
};
