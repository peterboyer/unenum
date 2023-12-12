/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Enum } from "./enum";

export const match = <
	TEnum extends Enum.Any<TDiscriminant>,
	TEnumMatcher extends {
		[Key in keyof Enum.Root<TEnum, TDiscriminant>]: Enum.Root<
			TEnum,
			TDiscriminant
		>[Key] extends true
			? () => unknown
			: (value: Enum.Root<TEnum, TDiscriminant>[Key]) => unknown;
	},
	TMatcher extends TFallback extends () => unknown
		? [ReturnType<TFallback>] extends [never]
			? TEnumMatcher
			: Partial<TEnumMatcher>
		: TEnumMatcher,
	TFallback extends (() => unknown) | (() => never) | undefined = () => never,
	TDiscriminant extends keyof TEnum & string = keyof TEnum &
		Enum.Discriminant.Default
>(
	target: TEnum | [value: TEnum, discriminant: TDiscriminant],
	matcher: TMatcher & { _?: TFallback }
): {
	_:
		| (undefined extends TMatcher[Exclude<keyof TMatcher, "_">]
				? never
				: {
						[Key in keyof TMatcher]: TMatcher[Key] extends (
							...args: any[]
						) => any
							? ReturnType<TMatcher[Key]>
							: never;
				  }[keyof TMatcher])
		| (TFallback extends (...args: any[]) => any
				? ReturnType<TFallback>
				: never);
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
	const [value, discriminant] = Array.isArray(target)
		? target
		: [target, "_type" as TDiscriminant];
	const key = value[discriminant];
	const keyMatchFn =
		matcher[key as unknown as keyof TMatcher & string] ??
		matcher["_" as keyof TMatcher & string];
	if (!keyMatchFn) {
		throw TypeError(`unhandled enum variant: ${JSON.stringify(value)}`);
	}
	return keyMatchFn(value as any) as any;
};